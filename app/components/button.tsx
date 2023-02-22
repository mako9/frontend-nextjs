import React from "react";
import styles from '../styles/button.module.css';

const Button = ({ title, onClick, isDisabled = false }) => {
  return (
    <button className={styles.button} disabled={isDisabled} onClick={() => onClick()}>
        {title}
    </button>
  );
};

export default Button;