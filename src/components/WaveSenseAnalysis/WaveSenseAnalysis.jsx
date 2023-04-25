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
    setRawData(
      Array.from({ length: isTabs.length }, () =>
        Array.from({ length: 3 }, () => [])
      )
    );
    setFftData(
      Array.from({ length: isTabs.length }, () =>
        Array.from({ length: 3 }, () => [])
      )
    );
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

  return (
    <div className={styles.waveSense}>
      <ConfigModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        settingModel={settingModel}
        setSettingModel={setSettingModel}
        setRawData={setRawData}
        setFftData={setFftData}
        contents={contents}
        setContents={setContents}
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
      />
    </div>
  );
}
