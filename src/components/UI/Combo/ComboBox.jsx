import styles from './ComboBox.module.css';

export default function ComboBox({
  title,
  options,
  onChangeInput,
  name,
  value,
}) {
  return (
    <div className={styles.combo}>
      <div className={styles.title}>{title}</div>
      <select
        className={styles.select}
        name={name}
        value={value}
        onChange={onChangeInput}
      >
        {options.map((option) => {
          return (
            <option className={styles.option} key={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
