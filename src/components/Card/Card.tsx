import React from "react";
import styles from "./Card.module.scss";

export interface  CardProps {
  onClick: () => void,
  label: string,
  betValue: number,
  disabled: boolean
}
export class Card extends React.Component<CardProps>{
  render() {
    const {
      label,
      betValue,
      onClick,
      disabled
    } = this.props;
    return (<button
      disabled={disabled}
      type={"button"}
      onClick={onClick}>
        {!!betValue && <span>{betValue}</span>}
        <span>{label}</span>
    </button>)
  }
}
