import React from 'react';
import whiteLogo from './whitelogo.svg';
import styles from './WGSLogo.module.css';

export default function WGSLogo() {
  return (
    <div className={styles.logo}>
      <img src={whiteLogo} className={styles.logo} alt='logo' />
    </div>
  );
}
