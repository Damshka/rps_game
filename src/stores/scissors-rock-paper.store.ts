import { action, computed, makeObservable, observable } from "mobx";
import { EChoice } from "../types/scissors-rock-paper/enums/choice.enum";
import { EResult } from "../types/enums/result.enum";
import { IGameResult } from "../types/scissors-rock-paper/interfaces/game-result.interface";

export class ScissorsRockPaperStore {

  constructor() {
    makeObservable(this);
  }

  private _victoryScheme: { [key in EChoice]: EChoice } = {
    [EChoice.ROCK]: EChoice.SCISSORS,
    [EChoice.PAPER]: EChoice.ROCK,
    [EChoice.SCISSORS]: EChoice.PAPER,
  };

  private _betSize: number = 500;
  private _maxAvailableBalance: number = 5000;
  private _winningRateOneChoice: number = 14;
  private _winingRateTwoChoices: number = 3;
  private _maxNumberOfPositions: number = 2;

  @observable private _playersChoice: Map<EChoice, number> = new Map<EChoice, number>();

  @action private _setPlayersChoice(v: EChoice, bet: number) {
    this._playersChoice.set(v, bet);
  }

  @action private _clearPlayersChoice() {
    this._playersChoice.clear()
  }

  @observable bestPlayersChoice: EChoice | null = null;

  @action private _setBestPlayersChoice(v: EChoice | null) {
    this.bestPlayersChoice = v;
  }

  @observable computersChoice: EChoice | null = null;

  @action private _setComputersChoice(v: EChoice | null) {
    this.computersChoice = v;
  }

  @observable balance: number = this._maxAvailableBalance;

  @action private _setBalance(v: number) {
    this.balance = v;
  }

  @observable victoryCounter: number = 0;

  @action private _setVictoryCounter(v: number) {
    this.victoryCounter = v;
  }

  @observable gameResult: IGameResult | null = null;

  @action private _setGameResult(v: IGameResult | null) {
    this.gameResult = v;
  }

  @computed get currentBetSize(): number {
    return Array.from(this._playersChoice.values()).reduce((total, value) => total + value, 0);
  }

  @computed get isAllowedToBet(): boolean {
    return this.balance >= this._betSize
  }

  @computed get isAllowedToPlay(): boolean {
    return !!this._playersChoice.size;
  }

  @computed private get _currentWinningRate(): number {
    return this._maxNumberOfPositionsReached ? this._winingRateTwoChoices : this._winningRateOneChoice;
  }

  private get _randomChoice(): EChoice {
    return this.choiceOptions[Math.floor(Math.random() * this.choiceOptions.length)];
  }

  private get _maxNumberOfPositionsReached(): boolean {
    return this._playersChoice.size === this._maxNumberOfPositions
  }

  get choiceOptions(): EChoice[] {
    return Object.values(EChoice)
  }

  getBetForPlayersChoice(choice: EChoice): number {
    return this._playersChoice.get(choice) || 0
  }

  get isVictory(): boolean {
    return this.gameResult?.result === EResult.WIN;
  }

  get isTie(): boolean {
    return this.gameResult?.result === EResult.TIE;
  }

  handlePlayersBet(v: EChoice): void {
    if(!this.isAllowedToBet) return;
    const currentBet = this._playersChoice.get(v) || 0;
    const updatedBet = currentBet + this._betSize;
    this._setPlayersChoice(v, updatedBet);
    this._setBalance(this.balance - this._betSize);
  }

  isOptionDisabled(option: EChoice): boolean {
    if(this._maxNumberOfPositionsReached) {
      return !this._playersChoice.has(option) || !this.isAllowedToBet;
    }
    return !this.isAllowedToBet;
  }

  private get _gameResult(): IGameResult {
    let result: EResult = EResult.LOSS;
    let value: EChoice | null = null;
    let bet: number = 0;
    for (const [ch, b] of this._playersChoice.entries()) {
      value = ch;
      bet = this.currentBetSize;
      if (this._victoryScheme[ch] === this.computersChoice) {
        result = EResult.WIN;
        bet = b * this._currentWinningRate;
        break;
      } else if (ch === this.computersChoice) {
        bet = this._maxNumberOfPositionsReached ? this.currentBetSize : b;
        result = this._maxNumberOfPositionsReached ? EResult.LOSS : EResult.TIE;
      }
    }
    return {
      result,
      value,
      bet
    };
  }

  defineWinner(): void {
    this._setComputersChoice(this._randomChoice);
    const result: IGameResult = this._gameResult;
    this._setBestPlayersChoice(result.value);
    //setTimeout to emulate some loading
    setTimeout(() => {
      if(result.result === EResult.WIN) {
        this._setBalance(this.balance + result.bet)
        this._setVictoryCounter(this.victoryCounter + 1)
      }
      if(result.result === EResult.TIE) {
        this._setBalance(this.balance + result.bet);
      }

      this._setGameResult(result);
      this._clearPlayersChoice();
    }, 1000)

  }

  reset(): void {
    this._setBestPlayersChoice(null);
    this._setComputersChoice(null);
    this._setGameResult(null);
  }

}
