import styles from '../../app/styles/keyValue.module.css';

const KeyValue = ({ name, value }) => {
  return (
    <div className={styles.key_value_horizontal_container}>
        <text className={styles.key}>{name}:</text>
        <text className={styles.value}>{value}</text>
    </div>
  );
};

export default KeyValue;