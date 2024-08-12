import React from "react";
import styles from "./Card.module.scss";
import { EColorKind } from "../../types/enums/color-kind.enum";

export interface CardProps {
  onClick: () => void;
  label: string;
  value: number;
  disabled: boolean;
  kind: EColorKind | null;
}
export class Card extends React.Component<CardProps> {
  render() {
    const { label, value, onClick, disabled, kind } = this.props;
    return (
      <button
        className={`${styles["card"]} ${kind ? styles[kind] : ""}`}
        disabled={disabled}
        type={"button"}
        onClick={onClick}
      >
        {!!value && <span className={styles["card-value"]}>{value}</span>}
        <span className={styles["card-label"]}>{label}</span>
      </button>
    );
  }
}
