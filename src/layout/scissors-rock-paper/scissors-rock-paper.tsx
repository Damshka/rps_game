import React from "react";
import { observer } from "mobx-react";
import { Header } from "../../components/Header/Header";
import { Counter } from "../../components/Counter/Counter";
import { Card } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import {ScissorsRockPaperStore} from "../../stores/scissors-rock-paper.store";
import { EChoice } from "../../types/scissors-rock-paper/enums/choice.enum";

@observer
export class ScissorsRockPaper extends React.Component<{}> {

  private _store: ScissorsRockPaperStore;

  constructor(props: {}) {
    super(props);
    this._store = new ScissorsRockPaperStore();
  }

  render() {
    return (
      <>
        <Header>
          <Counter title={'Balance'} value={this._store.currentBalanceForRound} />
          <Counter title={'Bet'} value={this._store.currentBetSize} />
          <Counter title={'Win'} value={this._store.victoryCounter} />
        </Header>
        <main>
          <p>Pick your position</p>
          <div>
            {this._store.choiceOptions.map((o, index) => (
              <Card
                key={index}
                disabled={this._store.isOptionDisabled(o)}
                onClick={() => {this._store.handlePlayersBet(o)}}
                label={o}
                betValue={this._store.getChoiceValue(o)} />
            ))}
          </div>
          <Button
            disabled={!this._store.isAllowedToPlay}
            title={'Play'}
            onClick={() => {
            console.log('play')
          }} />
        </main>
      </>
    )
  }
}
