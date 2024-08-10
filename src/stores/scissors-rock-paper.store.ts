import { action, computed, makeObservable, observable } from "mobx";
import { EChoice } from "../types/scissors-rock-paper/enums/choice.enum";

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

  @observable private _playersChoice: Map<EChoice, number> = new Map<EChoice, number>();

  @action private _setPlayersChoice(v: EChoice, bet: number) {
    this._playersChoice.set(v, bet);
  }

  @action private _clearPlayersChoice() {
    this._playersChoice.clear()
  }

  @observable computersChoice: EChoice | null = null;

  @action setComputersChoice(v: EChoice | null) {
    this.computersChoice = v;
  }

  @observable currentBalance: number = this._maxAvailableBalance;

  @action setCurrentBalance(v: number) {
    this.currentBalance = v;
  }

  @observable victoryCounter: number = 0;

  @action setVictoryCounter(v: number) {
    this.victoryCounter = v;
  }

  @computed get currentBetSize(): number {
    return Array.from(this._playersChoice.values()).reduce((total, value) => total + value, 0);
  }

  @computed get currentBalanceForRound(): number {
    return this.currentBalance - this.currentBetSize
  }

  @computed get isAllowedToBet(): boolean {
    return this.currentBalanceForRound > this._betSize
  }

  @computed get isAllowedToPlay(): boolean {
    return !!this._playersChoice.size;
    // return !!this._playersChoice.size && this.currentBalanceForRound >=0;
  }

  @computed get winningRateForRound(): number {
    return this._playersChoice.size === 1 ? this._winningRateOneChoice : this._winingRateTwoChoices;
  }

  get choiceOptions(): EChoice[] {
    return Object.values(EChoice)
  }

  handlePlayersBet(v: EChoice) {
    if(!this.isAllowedToBet) return;
    const currentBet = this._playersChoice.get(v) || 0;
    this._setPlayersChoice(v, currentBet + this._betSize);
  }

  getChoiceValue(choice: EChoice) {
    return this._playersChoice.get(choice) || 0
  }

  isOptionDisabled(option: EChoice): boolean {
    if(this._playersChoice.size === 2) {
      return !this._playersChoice.has(option) || !this.isAllowedToBet;
    }
    return !this.isAllowedToBet;
  }

  reset() {
    this._clearPlayersChoice();
    this.setComputersChoice(null);
  }

}
