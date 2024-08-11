import React from "react";
import styles from "./Counter.module.scss";

export interface CounterProps {
  title: string;
  value: number;
}

export class Counter extends React.Component<CounterProps> {
  render() {
    const { title, value } = this.props;
    return (
      <p className={styles["title"]}>
        {title}: <span>{value}</span>
      </p>
    );
  }
}
