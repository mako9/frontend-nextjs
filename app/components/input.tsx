import React from "react";
import styles from '../styles/input.module.css';

const InputField = ({ input, setInput, placeholder, className }) => {
    const handleChange = (event) => {
        setInput(event.target.value);
      };
  return (
    <input className={`${styles.input} ${styles[className]}`} type="text" value={input} onChange={handleChange} placeholder={placeholder} />
  );
};

export default InputField;