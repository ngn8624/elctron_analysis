import styles from './Input.module.css';

export default function Input({
  title,
  type = 'text',
  onChangeInput,
  placeholder,
  name,
  style,
  onInput,
  readOnly = false,
}) {
  return (
    <div className={styles.inputArea}>
      <div className={styles.title}>{title}</div>
      <input
        className={readOnly ? styles.readOnly : styles.input}
        type={type}
        onChange={onChangeInput}
        placeholder={placeholder}
        name={name}
        style={style}
        onInput={onInput}
        readOnly={readOnly}
      />
    </div>
  );
}
