import TabElement from './TabElement';
import styles from './TabContainer.module.css';
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from 'react-icons/ai';
import { useRef, useState } from 'react';

export default function TabContainer({ isTabs, activeIndex, handleTabClick }) {
  const [isLeftHover, setIsLeftHover] = useState(false);
  const [isRightHover, setIsRightHover] = useState(false);
  const horizontalScrollRef = useRef();
  return (
    <div className='tab-container'>
      <button
        className={styles.left}
        onMouseEnter={() => {
          setIsLeftHover(true);
        }}
        onMouseLeave={() => {
          setIsLeftHover(false);
        }}
        onClick={() => {
          horizontalScrollRef.current.scrollTo({
            left:
              horizontalScrollRef.current.scrollLeft -
              horizontalScrollRef.current.offsetWidth,
            behavior: 'smooth',
          });
        }}
      >
        {isLeftHover ? <AiOutlineArrowLeft /> : <AiOutlineLeft />}
      </button>
      <ul ref={horizontalScrollRef}>
        {isTabs.map((tab, index) => (
          <li key={index} className={`li` + (index + 1)}>
            <TabElement
              key={index}
              label={tab.label}
              tabIndex={index}
              activeIndex={activeIndex}
              handleTabClick={handleTabClick}
            />
          </li>
        ))}
      </ul>
      <button
        className={styles.right}
        onMouseEnter={() => {
          setIsRightHover(true);
        }}
        onMouseLeave={() => {
          setIsRightHover(false);
        }}
        onClick={() => {
          if (!horizontalScrollRef.current) return;
          horizontalScrollRef.current.scrollTo({
            left:
              horizontalScrollRef.current.scrollLeft +
              horizontalScrollRef.current.offsetWidth,
            behavior: 'smooth',
          });
        }}
      >
        {isRightHover ? <AiOutlineArrowRight /> : <AiOutlineRight />}
      </button>
    </div>
  );
}
