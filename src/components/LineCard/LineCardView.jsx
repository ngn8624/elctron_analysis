import React, { useEffect, useRef } from 'react';
import { enTitle } from '../../constant/constant';
import VibrationChart from '../UI/Chart/VibrationChart';
import { BsTrash } from 'react-icons/bs';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import styles from './LineCard.module.css';
import Container from '../UI/Container/Container';
import Toggle from '../UI/Toggle/Toggle';

export default function LineCardView({
  title,
  rawData,
  handleLegendVisible,
  selectedFile,
  setRawData,
  setFftData,
  isFileRunning,
  settingModel,
}) {
  return (
    <div className={styles.lineChartCard}>
        <Container title={title}>
          <LineChart rawData={rawData} />
        </Container>
    </div>
  );
}

export function LineChart({ rawData }) {
  return (
    <ul className={styles.ulCol}>
      <VibrationChart title={enTitle} rawData={rawData} />
    </ul>
  );
}
