import React from "react";
import { observer } from "mobx-react";
import { Header } from "../../components/Header/Header";
import { Counter } from "../../components/Counter/Counter";
import { Card } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { RockScissorsPaperStore } from "../../stores/rock-scissors-paper.store";
import { EChoice } from "../../types/rock-scissors-paper/enums/choice.enum";
import { EColorKind } from "../../types/enums/color-kind.enum";
import styles from "./RockScissorsPaper.module.scss";
import { IGameResult } from "../../types/rock-scissors-paper/interfaces/game-result.interface";

interface ScissorsRockPaperProps {}

@observer
export class RockScissorsPaper extends React.Component<ScissorsRockPaperProps> {
  private _store: RockScissorsPaperStore;

  constructor(props: ScissorsRockPaperProps) {
    super(props);
    this._store = new RockScissorsPaperStore();
  }

  renderTitle() {
    const gameResult: IGameResult | null = this._store.gameResult;
    const isVictory: boolean = this._store.isVictory;
    const isTie: boolean = this._store.isTie;
    const bestPlayersChoice: EChoice | null = this._store.bestPlayersChoice;
    const computersChoice: EChoice | null = this._store.computersChoice;
    const colorKind: EColorKind | null = this._getColorKind(
      isVictory ? bestPlayersChoice : computersChoice
    );
    if (!gameResult) {
      return bestPlayersChoice ? (
        <h2>
          {computersChoice}&nbsp;<span>vs</span>&nbsp;{bestPlayersChoice}
        </h2>
      ) : (
        <p>Pick your position</p>
      );
    }
    const title: string = isTie
      ? "It's a tie!"
      : `${isVictory ? bestPlayersChoice : computersChoice} won`;
    const subtitle: string = isTie
      ? ""
      : `You ${isVictory ? "win" : "loss"} ${gameResult.bet}`;
    return (
      <>
        <h2 className={colorKind ? styles[colorKind] : ""}>{title}</h2>
        <h3>{subtitle}</h3>
      </>
    );
  }

  private _getColorKind(o: EChoice | null): EColorKind | null {
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
          <Counter title={"Balance"} value={this._store.balance} />
          <Counter title={"Bet"} value={this._store.currentBetSize} />
          <Counter title={"Win"} value={this._store.victoryCounter} />
        </Header>
        <main>
          <section className={styles["title-wrapper"]}>
            {this.renderTitle()}
          </section>
          <section className={styles["wrapper"]}>
            {this._store.choiceOptions.map((o, index) => (
              <Card
                key={index}
                disabled={
                  this._store.isOptionDisabled(o) ||
                  !!this._store.computersChoice
                }
                onClick={() => {
                  this._store.handlePlayersBet(o);
                }}
                label={o}
                value={this._store.getBetForPlayersChoice(o)}
                kind={this._getColorKind(o)}
              />
            ))}
          </section>
          {this._store.gameResult ? (
            <Button
              title={"Clear"}
              onClick={() => {
                this._store.reset();
              }}
            />
          ) : (
            <Button
              disabled={
                !this._store.isAllowedToPlay || !!this._store.computersChoice
              }
              title={"Play"}
              onClick={() => {
                this._store.defineWinner();
              }}
            />
          )}
        </main>
      </>
    );
  }
}
