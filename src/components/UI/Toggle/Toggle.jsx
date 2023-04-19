import React from 'react';
import styles from './Toggle.module.css';

export default function Toggle({ value, onChanged }) {
  return (
    <>
      <label className={styles.label}>
        <span>XYZ</span>
        <input
          id='toggle'
          role='switch'
          type='checkbox'
          value={value}
          onChange={onChanged}
        />
      </label>
    </>
  );
}
