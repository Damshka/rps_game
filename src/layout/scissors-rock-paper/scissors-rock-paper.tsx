import React from "react";
import { observer } from "mobx-react";
import { Header } from "../../components/Header/Header";
import { Counter } from "../../components/Counter/Counter";
import { Card } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { ScissorsRockPaperStore } from "../../stores/scissors-rock-paper.store";
import { EResult } from "../../types/enums/result.enum";

@observer
export class ScissorsRockPaper extends React.Component<{}> {

  private _store: ScissorsRockPaperStore;

  constructor(props: {}) {
    super(props);
    this._store = new ScissorsRockPaperStore();
  }

  renderTitle(){
    if(!this._store.gameResult) {
      return this._store.bestPlayersChoice ?  <p>{this._store.computersChoice} <span>vs</span> {this._store.bestPlayersChoice}</p> : <p>Pick your position</p>;
    };
    const title: string = this._store.gameResult.result === EResult.TIE ? "It's a tie!" : `${this._store.gameResult.value} won`;
    const subtitle: string = this._store.gameResult.result === EResult.WIN ? `You won ${this._store.gameResult.bet}` : this._store.gameResult.result === EResult.LOSS ? `You lost ${this._store.gameResult.bet}` : ''
    return (
      <>
        <p>{title}</p>
        <p>{subtitle}</p>
      </>
    )
  }

  render() {
    return (
      <>
        <Header>
          <Counter title={'Balance'} value={this._store.balance} />
          <Counter title={'Bet'} value={this._store.currentBetSize} />
          <Counter title={'Win'} value={this._store.victoryCounter} />
        </Header>
        <main>
          {this.renderTitle()}
          <div>
            {this._store.choiceOptions.map((o, index) => (
              <Card
                key={index}
                disabled={this._store.isOptionDisabled(o) || !!this._store.computersChoice}
                onClick={() => {this._store.handlePlayersBet(o)}}
                label={o}
                betValue={this._store.getChoiceValue(o)} />
            ))}
          </div>
          {this._store.gameResult ? <Button
            title={'Clear'}
            onClick={() => {this._store.reset()}} /> : <Button
            disabled={!this._store.isAllowedToPlay || !!this._store.computersChoice}
            title={'Play'}
            onClick={() => {this._store.defineWinner()}} />}
        </main>
      </>
    )
  }
}
