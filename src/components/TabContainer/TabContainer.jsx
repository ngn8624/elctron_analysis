import TabElement from './TabElement';
import styles from './TabContainer.module.css';
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
export default function TabContainer({
  isTabs,
  activeIndex,
  handleTabClick,
  handleRightArrowClick,
  handleLeftArrowClick,
}) {
  const [isLeftHover, setIsLeftHover] = useState(false);
  const [isRightHover, setIsRightHover] = useState(false);
  const horizontalScrollRef = useRef();

  return (
    <div className='tab-container'>
      <button
        // ref={horizontalScrollRef}
        className={styles.left}
        onMouseEnter={() => {
          // console.log('left mouse enter');
          setIsLeftHover(true);
        }}
        onMouseLeave={() => {
          // console.log('left mouse leave');
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
      </button>{' '}
      {/* <div className={styles.tabList}> */}
      <ul ref={horizontalScrollRef}>
        {isTabs.map((tab, index) => (
          <li className={`li` + (index + 1)}>
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
      {/* </div> */}
      <button
        // ref={horizontalScrollRef}
        className={styles.right}
        onMouseEnter={() => {
          // console.log('Right mouse enter');
          setIsRightHover(true);
        }}
        onMouseLeave={() => {
          // console.log('Right mouse leave');
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
          console.log(
            horizontalScrollRef.current.scrollLeft,
            horizontalScrollRef.current.offsetWidth
          );
          // setStartIdx((p) => p + 1);
        }}
      >
        {isRightHover ? <AiOutlineArrowRight /> : <AiOutlineRight />}
      </button>
    </div>
  );
}
