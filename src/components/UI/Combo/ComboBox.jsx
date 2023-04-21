import styles from './ComboBox.module.css';

export default function ComboBox({
  title,
  options,
  onChangeInput,
  name,
  value,
  isStatistics,
  isSmallHoverCard,
}) {
  console.log('ComboBox', value);
  return (
    <div className={isStatistics ? styles.statisticsCombo : styles.combo}>
      <div className={styles.title}>{title}</div>
      {isSmallHoverCard ? (
        <div className={value === 'TRUE' ? styles.true : styles.false}>
          {value === 'TRUE' ? 'T' : 'F'}
        </div>
      ) : (
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
      )}
    </div>
  );
}
