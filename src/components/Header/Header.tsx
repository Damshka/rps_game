import React from "react";
import styles from "./Header.module.scss";

export interface HeaderProps {
  children?: React.ReactNode;
}

export class Header extends React.Component<HeaderProps> {
  render() {
    const { children } = this.props;
    return <header className={styles["header"]}>{children}</header>;
  }
}
