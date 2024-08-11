import React from "react";
import { observer } from "mobx-react";
import { Header } from "../../components/Header/Header";
import { Counter } from "../../components/Counter/Counter";
import { Card } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { ScissorsRockPaperStore } from "../../stores/scissors-rock-paper.store";
import { EResult } from "../../types/enums/result.enum";
import { EChoice } from "../../types/scissors-rock-paper/enums/choice.enum";
import { EColorKind } from "../../types/enums/color-kind.enum";
import styles from "./ScissorsRockPaper.module.scss";

@observer
export class ScissorsRockPaper extends React.Component<{}> {

  private _store: ScissorsRockPaperStore;

  constructor(props: {}) {
    super(props);
    this._store = new ScissorsRockPaperStore();
  }

  renderTitle(){
    const gameResult = this._store.gameResult;
    const bestPlayersChoice = this._store.bestPlayersChoice;
    const computersChoice = this._store.computersChoice;
    const colorKind = !!gameResult?.value ? this.getColorKind(gameResult.value) : '';
    if(!gameResult) {
      return bestPlayersChoice ?  <h2>{computersChoice} <span>vs</span> {bestPlayersChoice}</h2> : <p>Pick your position</p>;
    };
    const title: string = gameResult.result === EResult.TIE ? "It's a tie!" : `${gameResult.value} won`; //TODO: loss
    const subtitle: string = gameResult.result === EResult.WIN ? `You win ${gameResult.bet}` : gameResult.result === EResult.LOSS ? `You lost ${gameResult.bet}` : ''
    return (
      <>
        <h2 className={!!colorKind ? styles[colorKind] : ''}>{title}</h2>
        <h3>{subtitle}</h3>
      </>
    )
  }

  getColorKind(o: EChoice): EColorKind | null {
    switch (o) {
      case EChoice.PAPER:
        return EColorKind.GREEN;
      case EChoice.ROCK:
        return EColorKind.BLUE;
      case EChoice.SCISSORS:
        return EColorKind.RED;
      default:
        return null;
    }
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
          <section className={styles['title-wrapper']}>
            {this.renderTitle()}
          </section>
          <section className={styles.wrapper}>
            {this._store.choiceOptions.map((o, index) => (
              <Card
                key={index}
                disabled={this._store.isOptionDisabled(o) || !!this._store.computersChoice}
                onClick={() => {this._store.handlePlayersBet(o)}}
                label={o}
                betValue={this._store.getChoiceValue(o)}
                kind={this.getColorKind(o)}
              />
            ))}
          </section>
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
