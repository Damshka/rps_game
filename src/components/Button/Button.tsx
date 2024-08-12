import React from "react";
import styles from "./Button.module.scss";

export interface ButtonProps {
  title: string;
  onClick: () => void;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
}
export class Button extends React.Component<ButtonProps> {
  render() {
    const { type, title, onClick, disabled } = this.props;
    return (
      <button
        disabled={disabled}
        className={`${styles["button"]}`}
        type={type || "button"}
        onClick={onClick}
      >
        {title}
      </button>
    );
  }
}
