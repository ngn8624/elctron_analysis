import React, { useEffect, useState } from 'react';
import styles from './Expandable.module.css';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';

export default function Expandable({ title, children }) {
  const [show, setShow] = useState(true);
  const handleShow = () => {
    setShow((prev) => !prev);
  };

  useEffect(() => {
    setShow(true);
  }, [children]);

  return (
    <div>
      <div className={styles.listHeader} onClick={handleShow}>
        <div>{title}</div>
        <div>
          {show && <MdOutlineKeyboardArrowUp className={styles.iconHover} />}
          {!show && <MdOutlineKeyboardArrowDown className={styles.iconHover} />}
        </div>
      </div>
      {show && <div>{children}</div>}
    </div>
  );
}
