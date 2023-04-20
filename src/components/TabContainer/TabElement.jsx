export default function TabElement({ label, tabIndex, activeIndex, handleTabClick }) {
  const isActive = tabIndex === activeIndex;

  function handleClick() {
    handleTabClick(tabIndex);
  }

  return (
    <>
      <div className={`tab ${isActive ? 'active' : ''}`} onClick={handleClick}>
        {label}
      </div>
    </>
  );
}