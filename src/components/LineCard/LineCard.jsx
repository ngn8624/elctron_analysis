import React, { useEffect, useState } from 'react';
import VibrationChart from '../UI/Chart/VibrationChart';
import { v4 as uuidv4 } from 'uuid';
import Container from '../UI/Container/Container';
import {
  ENUM_STATISTICS_IGNORE,
  labels,
  generateColor,
} from '../../constant/constant';
import styles from './LineCard.module.css';
import Expandable from '../UI/Expandable/Expandable';
import ComboBox from '../UI/Combo/ComboBox';
import FileList from '../FileList/FileList';
import { TiArrowMaximise, TiArrowMinimise } from 'react-icons/ti';
export default function LineCard({
  isTabs,
  fftData,
  rawData,
  activeIndex,
  settingModel,
  onChangeInput,
  selectedFile,
  setSelectedFile,
  defaultDataCnt,
}) {
  const [titleContents, setTitleContents] = useState(''); // 해당 탭의 title
  const [useChartData, setUseChartData] = useState([]); // 해당 탭의 chartRawData
  const [useChartFFTData, setUseChartFFTData] = useState([]); // 해당 탭의 chartFftData
  const [isSmallHoverCard, setIsSmallHoverCard] = useState(true);
  const [isSmallHoverCard2, setIsSmallHoverCard2] = useState(true);
  const onSizing = () => {
    setIsSmallHoverCard(!isSmallHoverCard);
  };

  // chart에 넣을 data로 {x: , y: }로 변환
  useEffect(() => {
    setTitleContents(isTabs[activeIndex].label);
    if (rawData.length === 0 || rawData[activeIndex].length === 0) return;
    const useChartData = [];
    const activeRawData = rawData[activeIndex];
    const sendSelectedFile = selectedFile.filter(
      (item) => item.checked == true
    );
    for (let i = 0; i < activeRawData.length; i++) {
      // src만큼 반복 예 : 3
      const arr = activeRawData[i];
      for (let j = 0; j < arr.length; j++) {
        // 파일 갯수
        const colors = generateColor();
        let label = isTabs[activeIndex].label + '-' + labels[i];
        if (sendSelectedFile.length > j) {
          const fileName = sendSelectedFile[j].num +'-'+ 'File';
          label = label + '-' + fileName;
        }
        const chartData = {
          id: uuidv4(),
          label: label,
          borderColor: colors,
          backgroundColor: colors,
          fill: false,
          borderWidth: 2,
          radius: 2,
          pointRaduis: 1,
          data: [],
        };

        for (let k = 0; k < arr[j].length; k++) {
          chartData.data.push({ x: k+1, y: arr[j][k] });
        }
        useChartData.push(chartData);
      }
    }
    setUseChartData(useChartData);
    if (fftData.length === 0 || fftData[activeIndex].length === 0) return;
    const useChartFftData = [];
    const activeFftData = fftData[activeIndex];
    for (let i = 0; i < activeFftData.length; i++) {
      // src만큼 반복 예 : 3
      const arrfft = activeFftData[i];
      for (let j = 0; j < arrfft.length; j++) {
        // 파일 갯수
        const colorss = generateColor();
        let label = isTabs[activeIndex].label + '-' + labels[i];
        if (sendSelectedFile.length > j) {
          const fileName = sendSelectedFile[j].num +'-'+ 'File';
          label = label + '-' + fileName;
        }
        const chartDatafft = {
          id: uuidv4(),
          label: 'FFT' + '-' + label,
          borderColor: colorss,
          backgroundColor: colorss,
          fill: false,
          borderWidth: 2,
          radius: 2,
          pointRaduis: 1,
          data: [],
        };

        for (let k = 0; k < arrfft[j].length; k++) {
          chartDatafft.data.push({ x: k, y: arrfft[j][k] });
        }
        useChartFftData.push(chartDatafft);
      }
    }
    setUseChartFFTData(useChartFftData);
  }, [activeIndex, rawData, fftData]);

  return (
    <div className={styles.surface}>
      <div className={styles.twoCards}>
        <div
          className={
            isSmallHoverCard ? styles.lineChartCard : styles.lineChartCardHover
          }
        >
          <Container title={titleContents}>
            <ul className={styles.ulCol}>
              <VibrationChart
                rawData={useChartData}
                selectedFile={selectedFile}
                defaultDataCnt={defaultDataCnt}
              />
            </ul>
          </Container>
        </div>
        <div
          className={
            isSmallHoverCard ? styles.hoverSmallCard : styles.hoverCard
          }
        >
          <FileList
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isSmallHoverCard={isSmallHoverCard}
            onSizing={onSizing}
          />
        </div>
      </div>
      <div className={styles.twoCards}>
        <div
          className={
            isSmallHoverCard2 ? styles.lineChartCard : styles.lineChartCardHover
          }
        >
          <Container title={'FFT '}>
            <ul className={styles.ulCol}>
              <VibrationChart
                rawData={useChartFFTData}
                selectedFile={selectedFile}
                defaultDataCnt={defaultDataCnt}
              />
            </ul>
          </Container>
        </div>
        <div
          className={
            isSmallHoverCard2 ? styles.hoverSmallCard : styles.hoverCard
          }
        >
          <div className={styles.maxZone}>
            <button
              className={isSmallHoverCard2 ? styles.maxBtn2 : styles.maxBtn}
              onClick={() => {
                setIsSmallHoverCard2((p) => !p);
              }}
            >
              {isSmallHoverCard2 ? (
                <TiArrowMaximise size={'14px'} />
              ) : (
                <TiArrowMinimise size={'14px'} />
              )}{' '}
            </button>
          </div>
          <StatisticsConfig
            settingModel={settingModel}
            onChangeInput={onChangeInput}
            isSmallHoverCard={isSmallHoverCard2}
          />
        </div>
      </div>
    </div>
  );
}

function StatisticsConfig({ settingModel, onChangeInput, isSmallHoverCard }) {
  return (
    <>
      {' '}
      <ComboBox
        title={'RMS'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'RMS'}
        onChangeInput={onChangeInput}
        value={settingModel.RMS ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'Mean'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Mean'}
        onChangeInput={onChangeInput}
        value={settingModel.Mean ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'MeanH'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'MeanH'}
        onChangeInput={onChangeInput}
        value={settingModel.MeanH ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'MeanG'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'MeanG'}
        onChangeInput={onChangeInput}
        value={settingModel.MeanG ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'StDev'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'StDev'}
        onChangeInput={onChangeInput}
        value={settingModel.StDev ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'Skew'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Skew'}
        onChangeInput={onChangeInput}
        value={settingModel.Skew ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'Kurt'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Kurt'}
        onChangeInput={onChangeInput}
        value={settingModel.Kurt ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'Mode'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Mode'}
        onChangeInput={onChangeInput}
        value={settingModel.Mode ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'Median'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Median'}
        onChangeInput={onChangeInput}
        value={settingModel.Median ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'Q1'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Q1'}
        onChangeInput={onChangeInput}
        value={settingModel.Q1 ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'Q3'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'Q3'}
        onChangeInput={onChangeInput}
        value={settingModel.Q3 ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
      <ComboBox
        title={'IQR'}
        options={Object.values(ENUM_STATISTICS_IGNORE)}
        name={'IQR'}
        onChangeInput={onChangeInput}
        value={settingModel.IQR ?? ENUM_STATISTICS_IGNORE.FALSE}
        isStatistics={true}
        isSmallHoverCard={isSmallHoverCard}
      />
    </>
  );
}
