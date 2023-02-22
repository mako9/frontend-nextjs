import React from "react";
import styles from '../styles/toggleButton.module.css';

const ToggleButton = ({ titleOne, titleTwo, selectedIndex, setSelectedIndex }) => {
  return (
    <div>
        <button className={`${styles.toggle_button} ${styles.toggle_button_left} ${selectedIndex == 0 ? styles.toggle_button_on : ""}`} onClick={() => setSelectedIndex(0)}>
            {titleOne}
        </button>
        <button className={`${styles.toggle_button} ${styles.toggle_button_right} ${selectedIndex == 1 ? styles.toggle_button_on : ""}`} onClick={() => setSelectedIndex(1)}>
            {titleTwo}
        </button>
    </div>
  );
};

export default ToggleButton;