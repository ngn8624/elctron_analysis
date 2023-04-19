import styles from './StatusBtn.module.css';

export default function StatusBtn(props) {
  const { handleClick, isGreen, name, tooltip } = props;
  return (
    <button id='basicRoundedBtn'
      className={tooltip && styles.HoverBtn}
      onClick={handleClick}
      data-tooltip={tooltip && tooltip}
    >
      <div className={isGreen ? styles.runStatus : styles.stopStatus}></div>
      {name}
    </button>
  );
}
