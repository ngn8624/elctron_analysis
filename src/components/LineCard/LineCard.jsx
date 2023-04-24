import React, { useEffect, useState } from 'react';
import VibrationChart from '../UI/Chart/VibrationChart';
import { v4 as uuidv4 } from 'uuid';
import Container from '../UI/Container/Container';
import { ENUM_STATISTICS_IGNORE, labels } from '../../constant/constant';
import styles from './LineCard.module.css';
import Expandable from '../UI/Expandable/Expandable';
import ComboBox from '../UI/Combo/ComboBox';
import FileList from '../FileList/FileList';

export default function LineCard({
  isTabs,
  fftData,
  rawData,
  activeIndex,
  settingModel,
  onChangeInput,
  selectedFile,
  setSelectedFile
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
        label: isTabs[activeIndex].label + '-' + labels[i],
        borderColor: isTabs[activeIndex].color[i],
        backgroundColor: isTabs[activeIndex].color[i],
        fill: false,
        borderWidth: 2,
        radius: 2,
        pointRaduis: 1,
        data: arr.map((value, j) => ({ x: j, y: value })),
      }))
    );
    if (fftData.length === 0 || fftData[activeIndex].length === 0) return;
    setUseChartFFTData(
      fftData[activeIndex].map((arr, i) => ({
        id: uuidv4(),
        label: 'FFT' + '-' + labels[i],
        borderColor: isTabs[activeIndex].color[i],
        backgroundColor: isTabs[activeIndex].color[i],
        fill: false,
        borderWidth: 2,
        radius: 2,
        pointRaduis: 1,
        data: arr.map((value, j) => ({ x: j, y: value })),
      }))
    );
  }, [activeIndex, rawData, fftData]);
  console.log("useChartData", useChartData);
  return (
    <div className={styles.surface}>
      <div className={styles.twoCards}>
        <div className={styles.lineChartCard}>
          <Container title={titleContents + ' Statistics'}>
            <ul className={styles.ulCol}>
              <VibrationChart rawData={useChartData} selectedFile={selectedFile} />
            </ul>
          </Container>
        </div>
        <div className={styles.hoverCard}>
          <FileList selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
        </div>
      </div>
      <div className={styles.twoCards}>
        <div className={styles.lineChartCard}>
          <Container title={titleContents + ' FFT'}>
            <ul className={styles.ulCol}>
              <VibrationChart rawData={useChartFFTData} selectedFile={selectedFile}/>
            </ul>
          </Container>
        </div>
        <div className={styles.hoverCard}>
          <StatisticsConfig
            settingModel={settingModel}
            onChangeInput={onChangeInput}
          />
        </div>
      </div>
    </div>
  );
}

function StatisticsConfig({ settingModel, onChangeInput }) {
  return (
    <Expandable title={'STATISTICS'}>
      <ComboBox
        title={'RMS'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'RMS'}
        onChangeInput={onChangeInput}
        value={settingModel.RMS ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'Mean'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Mean'}
        onChangeInput={onChangeInput}
        value={settingModel.Mean ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'MeanH'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'MeanH'}
        onChangeInput={onChangeInput}
        value={settingModel.MeanH ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'MeanG'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'MeanG'}
        onChangeInput={onChangeInput}
        value={settingModel.MeanG ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'StDev'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'StDev'}
        onChangeInput={onChangeInput}
        value={settingModel.StDev ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'Skew'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Skew'}
        onChangeInput={onChangeInput}
        value={settingModel.Skew ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'Kurt'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Kurt'}
        onChangeInput={onChangeInput}
        value={settingModel.Kurt ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'Mode'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Mode'}
        onChangeInput={onChangeInput}
        value={settingModel.Mode ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'Median'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Median'}
        onChangeInput={onChangeInput}
        value={settingModel.Median ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'Q1'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Q1'}
        onChangeInput={onChangeInput}
        value={settingModel.Q1 ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'Q3'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Q3'}
        onChangeInput={onChangeInput}
        value={settingModel.Q3 ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
      <ComboBox
        title={'IQR'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'IQR'}
        onChangeInput={onChangeInput}
        value={settingModel.IQR ?? ENUM_STATISTICS_IGNORE.FALSE}
      />
    </Expandable>
  );
}
