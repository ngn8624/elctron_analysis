import React from 'react';
import styles from './Container.module.css';
import { CgArrowsExpandRight } from 'react-icons/cg';

export default function ZoomContainer({ title, onClick, children }) {
  return (
    <div className={styles.zoomBox}>
      <div className={styles.expandIcon}>
        <CgArrowsExpandRight onClick={() => onClick(title)} />
      </div>
      {children}
    </div>
  );
}
