import React from "react";
import styles from '../styles/button.module.css';

const Button = ({ title, onClick, isDisabled = false, type }: {
  title: string;
  onClick: () => void;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <button className={styles.button} disabled={isDisabled} onClick={() => onClick()} type={type} >
        {title}
    </button>
  );
};

export default Button;