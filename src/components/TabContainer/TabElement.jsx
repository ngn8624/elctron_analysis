import styles from './TabElement.module.css';

export default function TabElement({
  label,
  tabIndex,
  activeIndex,
  handleTabClick,
}) {
  const isActive = tabIndex === activeIndex;

  function handleClick() {
    handleTabClick(tabIndex);
  }

  return (
    <>
      <div
        className={isActive ? styles.active : styles.inactive}
        onClick={handleClick}
      >
        {label}
      </div>
    </>
  );
}
