import { action, computed, makeObservable, observable } from "mobx";
import { EChoice } from "../types/scissors-rock-paper/enums/choice.enum";
import { EResult } from "../types/enums/result.enum";

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
  private _maxAvailableBalance: number = 2500;
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

  @action setBestPlayersChoice(v: EChoice | null) {
    this.bestPlayersChoice = v;
  }

  @observable computersChoice: EChoice | null = null;

  @action setComputersChoice(v: EChoice | null) {
    this.computersChoice = v;
  }

  @observable balance: number = this._maxAvailableBalance;

  @action setBalance(v: number) {
    this.balance = v;
  }

  @observable victoryCounter: number = 0;

  @action setVictoryCounter(v: number) {
    this.victoryCounter = v;
  }

  @observable gameResult: {result: EResult, value: EChoice | null, bet: number} | null = null;

  @action setGameResult(v: {result: EResult, value: EChoice | null, bet: number} | null) {
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
    return this._playersChoice.size === 1 ? this._winningRateOneChoice : this._winingRateTwoChoices;
  }

  get choiceOptions(): EChoice[] {
    return Object.values(EChoice)
  }

  handlePlayersBet(v: EChoice): void {
    if(!this.isAllowedToBet) return;
    const currentBet = this._playersChoice.get(v) || 0;
    const updatedBet = currentBet + this._betSize;
    this._setPlayersChoice(v, updatedBet);
    this.setBalance(this.balance - this._betSize);
  }

  getChoiceValue(choice: EChoice): number {
    return this._playersChoice.get(choice) || 0
  }

  private get _computerChoice(): EChoice {
    return EChoice.SCISSORS
    // return this.choiceOptions[Math.floor(Math.random() * this.choiceOptions.length)];
  }

  isOptionDisabled(option: EChoice): boolean {
    if(this._maxNumberOfPositionsReached) {
      return !this._playersChoice.has(option) || !this.isAllowedToBet;
    }
    return !this.isAllowedToBet;
  }

  private get _maxNumberOfPositionsReached(): boolean {
    return this._playersChoice.size === this._maxNumberOfPositions
  }

  private get _result(): {result: EResult, value: EChoice | null, bet: number} {
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
      }

      if (ch === this.computersChoice) {
        bet = this._maxNumberOfPositionsReached ? this.currentBetSize : b;
        result = this._maxNumberOfPositionsReached ? EResult.LOSS : EResult.TIE;
        break;
      }
    }
    return {
      result,
      value,
      bet
    };
  }

  defineWinner() {
    this.setComputersChoice(this._computerChoice);
    console.log('this._computerChoice', this._computerChoice);
    const result = this._result;
    this.setBestPlayersChoice(result.value);
    console.log(result);
    //setTimeout to emulate some loading
    setTimeout(() => {
      if(result.result === EResult.WIN) {
        this.setBalance(this.balance + result.bet)
        this.setVictoryCounter(this.victoryCounter + 1)
      }
      if(result.result === EResult.TIE) {
        this.setBalance(this.balance + result.bet);
      }

      this.setGameResult(result);
      this._clearPlayersChoice();
    }, 1000)

  }

  reset() {
    this.setBestPlayersChoice(null);
    this.setComputersChoice(null);
    this.setGameResult(null);
  }

}
