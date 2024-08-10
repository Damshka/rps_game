import React from "react";

export interface CounterProps {
  title: string,
  value: number
}

export class Counter extends React.Component<CounterProps> {
  render() {
    const {
      title,
      value} = this.props;
    return (
      <p>{title}: <span>{value}</span></p>
    )
  }
}
