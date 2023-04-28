import React, { useEffect, useState } from 'react';
import {
  generateColor,
  initSettingModels,
  initTabs,
} from '../../constant/constant';
import AppBar from '../Appbar/Appbar';
import ConfigModal from '../ConfigModal/ConfigModal';
import styles from './WaveSenseAnalysis.module.css';
import TabContainer from '../TabContainer/TabContainer';
import LineCard from '../LineCard/LineCard';
import { ColorRing } from 'react-loader-spinner';
import ChartPopup from '../ChartPopup/ChartPopup';
import { daqGetDatasByIndex } from '../../controller/daq';

export default function WaveSenseAnalysis() {
  const [rawData, setRawData] = useState([]); // chart의 y 값 data 모음
  const [fftData, setFftData] = useState([]); // chart의 y 값 fftData 모음
  const [showPopup, setShowPopup] = useState(false);
  const [settingModel, setSettingModel] = useState(() => {
    return initSettingModels;
  }); // ui 용 config, settingModel이 있으나, {}일반객체 아닌 settingModel{} 객체로 사용할경우 주의 필요
  const [selectedFile, setSelectedFile] = useState([]); // 파일 선택된 리스르
  const [isFileRunning, setIsFileRunning] = useState(false);
  const [contents, setContents] = useState({}); // .dll 보낼 config Json
  const [startIdx, setStartIdx] = useState(0); // chart의 x 값 시작점
  const [isTabs, setIsTabs] = useState(() => {
    return initTabs;
  }); // tab List
  const [activeIndex, setActiveIndex] = useState(0); // tab real index
  // setting창 조작후 settingModel에 넣기
  const [defaultDataCnt, setDefaultDataCnt] = useState(1); // 추후 각각의 src가 몇개로 받을것인지 설정 : 현재 default 1
  const [startCalc, setStartCalc] = useState(false); // loading
  const [chartPopup, setChartPopup] = useState(false); // chart popup
  const [spotData, setspotData] = useState(null);
  const [calcedFiles, setCalcedFiles] = useState([]);
  const [freq, setFreq] = useState([]);

  // tab 클릭 시 activeIndex 업데이트
  function handleTabClick(index) {
    setActiveIndex(index);
  }
  const handleLeftArrowClick = () => {
    if (startIdx > 0) {
      setStartIdx((prevIdx) => prevIdx - 1);
    }
  };
  const handleRightArrowClick = () => {
    // if (startIdx < rawData[0][0].length - 1) {
    setStartIdx((prevIdx) => prevIdx + 1);
    // }
  };

  // selectedFile 변경시 setIsFileRunning 업데이트
  useEffect(() => {
    if (selectedFile.length === 0) {
      setIsFileRunning(false);
    } else {
      setIsFileRunning(true);
    }
  }, [selectedFile]);

  // settingModel 변경시 isTabs 업데이트
  useEffect(() => {
    setIsTabs((prevTabs) => {
      const newTabs = [];

      for (const key in settingModel) {
        if (
          settingModel[key] === 'TRUE' &&
          initTabs.some((tab) => tab.label === key)
        ) {
          newTabs.push({
            label: key,
            color: [generateColor(), generateColor(), generateColor()],
          });
        }
      }
      return newTabs;
    });
  }, [settingModel]);

  // isTabs즉, 선택된 통계가 바뀌면 activeIndex 및 데이터 모음 업데이트
  useEffect(() => {
    setRawData(Array.from({ length: isTabs.length }, () => []));
    setFftData(Array.from({ length: isTabs.length }, () => []));
    setActiveIndex((prevIndex) => {
      if (prevIndex >= isTabs.length) {
        return isTabs.length - 1;
      }
      return prevIndex;
    });
  }, [isTabs]);

  // setting창 조작후 settingModel에 넣기
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    const trueCount = Object.keys(settingModel)
      .slice(
        Object.keys(settingModel).indexOf('RMS'),
        Object.keys(settingModel).indexOf('IQR') + 1
      )
      .reduce((count, key) => {
        return count + (settingModel[key] === 'TRUE' ? 1 : 0);
      }, 0);
    if (value === 'TRUE' || trueCount > 1) {
      setSettingModel((prev) => ({ ...prev, [name]: value }));
    } else {
      alert('At least one property must be TRUE.');
    }
  };
  const isEmptyArr = (arr) => {
    if (Array.isArray(arr) && arr.length === 0) {
      return true;
    }
    return false;
  };
  const onChartPopup = (evt, item) => {
    setspotData(item);
  };
  useEffect(() => {
    if (spotData !== null && spotData.length > 0) {
      setChartPopup((p) => !p);
    }
  }, [spotData]);

  const closeChartPopup = () => {
    setChartPopup(false);
  };

  useEffect(() => {
    if (startCalc) {
      const newCalcedFiles = selectedFile
        .filter((file) => file.checked)
        .map((file) => file.path);
      setCalcedFiles(newCalcedFiles);
    }
  }, [startCalc]);

  useEffect(() => {
    if (spotData === null) return;
    if (spotData.length === 0) return;
    if (spotData[0].index === undefined) return;
    console.log("calcedFiles[0]",calcedFiles[0]);
    console.log("spotData[0].index",spotData[0].index);
    daqGetDatasByIndex(calcedFiles[0], spotData[0].index);
  }, [spotData]);

  return (
    <div className={styles.waveSense}>
      <div className='loading'>
        <ColorRing
          visible={
            startCalc &&
            isEmptyArr(rawData.flat(Infinity)) &&
            isEmptyArr(fftData.flat(Infinity))
          }
          height='160'
          width='160'
          ariaLabel='blocks-loading'
          wrapperStyle={{}}
          wrapperClass='blocks-wrapper'
          colors={['#ffffff', '#357dbb', '#2468a8', '#0d21a1', ' #73fbd3']}
        />
      </div>
      {chartPopup && (
        <div className='unableBg'>
          <ChartPopup
            spotData={spotData}
            closeChartPopup={closeChartPopup}
            filePaths={calcedFiles}
          />
        </div>
      )}

      <ConfigModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        settingModel={settingModel}
        setSettingModel={setSettingModel}
        setRawData={setRawData}
        setFftData={setFftData}
        contents={contents}
        setContents={setContents}
        setFreq={setFreq}
      />
      <AppBar
        setRawData={setRawData}
        setFftData={setFftData}
        setShowPopup={setShowPopup}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        isFileRunning={isFileRunning}
        setIsFileRunning={setIsFileRunning}
        settingModel={settingModel}
        setSettingModel={setSettingModel}
        contents={contents}
        isTabs={isTabs}
        setContents={setContents}
        startCalc={startCalc}
        setStartCalc={setStartCalc}
        setFreq={setFreq}
      />
      <TabContainer
        isTabs={isTabs}
        activeIndex={activeIndex}
        handleTabClick={handleTabClick}
        handleRightArrowClick={handleRightArrowClick}
        handleLeftArrowClick={handleLeftArrowClick}
      />
      <LineCard
        isTabs={isTabs}
        fftData={fftData}
        rawData={rawData}
        activeIndex={activeIndex}
        settingModel={settingModel}
        onChangeInput={onChangeInput}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        defaultDataCnt={defaultDataCnt}
        onChartPopup={onChartPopup}
        spotData={spotData}
        calcedFiles={calcedFiles}
        freq={freq}
      />
    </div>
  );
}
