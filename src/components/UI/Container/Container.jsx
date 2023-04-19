import React from 'react';
import styles from './Container.module.css';
import { CgMoreVerticalR } from 'react-icons/cg';

export default function Container({ children, title, handleMore }) {
  return (
    <div
      className={
        title
          ? title === 'Check'
            ? styles.checkBox
            : title === 'FFT'
            ? styles.fftRoundedBox
            : styles.roundedBox
          : styles.box
      }
    >
      {title && (
        <div className={styles.boxHeader}>
          {title}
          <CgMoreVerticalR
            size={'14px'}
            onClick={handleMore}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
