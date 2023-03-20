import React from "react";
import styles from '../styles/button.module.css';

const Button = ({ title, onClick, isDisabled = false, type = null }) => {
  return (
    <button className={styles.button} disabled={isDisabled} onClick={() => onClick()} type={type} >
        {title}
    </button>
  );
};

export default Button;