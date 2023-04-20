import TabElement from './TabElement';
import styles from './TabContainer.module.css';

export default function TabContainer({
  isTabs,
  activeIndex,
  handleTabClick,
}) {
  return (
    <div className='tab-container'>
      <div
        className={styles.tabList}
      >
        {isTabs.map((tab, index) => (
          <TabElement
            key={index}
            label={tab.label}
            tabIndex={index}
            activeIndex={activeIndex}
            handleTabClick={handleTabClick}
          />
        ))}
      </div>
    </div>
  );
}

