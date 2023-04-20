import React, { useEffect, useState } from 'react';
import VibrationChart from '../UI/Chart/VibrationChart';
import { v4 as uuidv4 } from 'uuid';
import Container from '../UI/Container/Container';
import { labels } from '../../constant/constant';
import styles from './LineCard.module.css';

export default function LineCard({
  isTabs,
  fftData,
  rawData,
  activeIndex,
}) {
  const [titleContents, setTitleContents] = useState(''); // 해당 탭의 title
  const [useChartData, setUseChartData] = useState([]); // 해당 탭의 chartRawData
  const [useChartFFTData, setUseChartFFTData] = useState([]); // 해당 탭의 chartFftData

  // chart에 넣을 data로 {x: , y: }로 변환
  useEffect(() => {
    setTitleContents(isTabs[activeIndex].label);
    if (rawData.length === 0 || rawData[activeIndex].length === 0) return;
    setUseChartData(
      rawData[activeIndex].map((arr, i) => ({
        id: uuidv4(),
        label: isTabs[activeIndex].label + "-" + labels[i],
        borderColor: isTabs[activeIndex].color[i],
        backgroundColor: isTabs[activeIndex].color[i],
        fill: false,
        borderWidth: 1,
        radius: 0,
        pointRaduis: 0,
        data: arr.map((value, j) => ({ x: j, y: value })),
      }))
    );
    if (fftData.length === 0 || fftData[activeIndex].length === 0) return;
    setUseChartFFTData(
      fftData[activeIndex].map((arr, i) => ({
        id: uuidv4(),
        label: "FFT" + "-" + labels[i],
        borderColor: isTabs[activeIndex].color[i],
        backgroundColor: isTabs[activeIndex].color[i],
        fill: false,
        borderWidth: 1,
        radius: 0,
        pointRaduis: 0,
        data: arr.map((value, j) => ({ x: j, y: value })),
      }))
    );
  }, [activeIndex, rawData, fftData]);

  return (
    <div className={styles.surface}>
      <div className={styles.lineChartCard}>
        <Container title={titleContents + " Statistics"}>
          <ul className={styles.ulCol}>
            <VibrationChart rawData={useChartData} />
          </ul>
        </Container>
      </div>
      <div className={styles.lineChartCard}>
        <Container title={titleContents + " FFT"}>
          <ul className={styles.ulCol}>
            <VibrationChart rawData={useChartFFTData} />
          </ul>
        </Container>
      </div>
    </div>
  );
}