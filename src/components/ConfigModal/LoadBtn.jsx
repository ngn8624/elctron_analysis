import styles from './ConfigModal.module.css';
export default function LoadBtn({ handleLoad }) {
  return (
    <button
      id='basicRoundedBtn'
      className={styles.smallBtn}
      onClick={handleLoad}
    >
      Load
    </button>
  );
}
