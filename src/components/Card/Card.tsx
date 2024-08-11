import React from "react";
import styles from "./Card.module.scss";
import { EColorKind } from "../../types/enums/color-kind.enum";

export interface  CardProps {
  onClick: () => void,
  label: string,
  betValue: number,
  disabled: boolean,
  kind: EColorKind | null
}
export class Card extends React.Component<CardProps>{
  render() {
    const {
      label,
      betValue,
      onClick,
      disabled,
      kind
    } = this.props;
    return (<button
      className={`${styles.card} ${!!kind ? styles[kind] : ''}`}
      disabled={disabled}
      type={"button"}
      onClick={onClick}>
        {!!betValue && <span className={styles.bet}>{betValue}</span>}
        <span className={styles.label}>{label}</span>
    </button>)
  }
}
