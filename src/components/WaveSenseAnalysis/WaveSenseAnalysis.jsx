import React, { useEffect, useRef, useState } from 'react';
import { chartDatas } from '../../constant/constant';
import LineCard from '../LineCard/LineCard';
import AppBar from '../Appbar/Appbar';
import { readConfig } from '../../utils/file';
import ConfigModal from '../ConfigModal/ConfigModal';
import styles from './WaveSenseAnalysis.module.css';
const tabs = [
  {
    label: 'RMS',
  },
  {
    label: 'Mean',
  },
  {
    label: 'MeanH',
  },
  {
    label: 'MeanG',
  },
  {
    label: 'StDev',
  },
  {
    label: 'Skew',
  },
  {
    label: 'Kurt',
  },
  {
    label: 'Mode',
  },
  {
    label: 'Median',
  },
  {
    label: 'Q1',
  },
  {
    label: 'Q3',
  },
  {
    label: 'IQR',
  },
];
export default function WaveSenseAnalysis() {
  const [rawData, setRawData] = useState(chartDatas);
  const [fftData, setFftData] = useState(chartDatas);
  const [showPopup, setShowPopup] = useState(false);
  const [settingModel, setSettingModel] = useState({
    paths: [],
    fftCnt: '2048',
    dcIgnore: 'TRUE',
    sampleInterval: '1',
    windowsIdx: 'rectangle',
    viewMode: 'DBV',
    dbvRange: '100',
    RMS: 'TRUE',
    Mean: 'TRUE',
    MeanH: 'TRUE',
    MeanG: 'TRUE',
    StDev: 'TRUE',
    Skew: 'TRUE',
    Kurt: 'TRUE',
    Mode: 'TRUE',
    Median: 'TRUE',
    Q1: 'TRUE',
    Q3: 'TRUE',
    IQR: 'TRUE',
  }); // ui 용 config
  const [cbStatus, setCbStatus] = useState({});
  const [selectedFile, setSelectedFile] = useState([]);
  const [isFileRunning, setIsFileRunning] = useState(false);
  const [contents, setContents] = useState({}); // .dll 보낼 config
  const [isTabs, setIsTabs] = useState(tabs);
  const [activeIndex, setActiveIndex] = useState(0); // tab index

  useEffect(() => {
    setIsTabs(tabs);
  }, []);
  console.log('contents ', contents);
  console.log('WaveSenseAnalysis settingModel', settingModel);
  // console.log('isTabs ', isTabs);
  // console.log("activeIndex",activeIndex);
  console.log('selectedFile ', selectedFile);
  // Tab 클릭 시 activeIndex 업데이트
  function handleTabClick(index) {
    setActiveIndex(index);
  }

  // isTabs 업데이트
  useEffect(() => {
    setIsTabs((prevTabs) => {
      const newTabs = [];
      for (const key in settingModel) {
        if (settingModel[key] === 'TRUE' && tabs.some((tab) => tab.label === key)) {
          newTabs.push({ label: key });
        }
      }
      return newTabs;
    });
  }, [settingModel]);

  // activeIndex 업데이트
  useEffect(() => {
    setActiveIndex((prevIndex) => {
      if (prevIndex >= isTabs.length) {
        return isTabs.length - 1;
      }
      return prevIndex;
    });
  }, [isTabs]);

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
        rawData={rawData}
        setRawData={setRawData}
        setFftData={setFftData}
        setShowPopup={setShowPopup}
        setCbStatus={setCbStatus}
        cbStatus={cbStatus}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        isFileRunning={isFileRunning}
        setIsFileRunning={setIsFileRunning}
        settingModel={settingModel}
        setSettingModel={setSettingModel}
        contents={contents}
      />
      <TabContainer
        tabs={isTabs}
        fftData={fftData}
        rawData={rawData}
        setRawData={setRawData}
        selectedFile={selectedFile}
        setFftData={setFftData}
        isFileRunning={isFileRunning}
        settingModel={settingModel}
        activeIndex={activeIndex}
        handleTabClick={handleTabClick}
      />
    </div>
  );
}

function Tab({ label, tabIndex, activeIndex, handleTabClick }) {
  const isActive = tabIndex === activeIndex;

  function handleClick() {
    handleTabClick(tabIndex);
    // console.log("tabIndex'", tabIndex, ' : ', activeIndex);
  }

  return (
    <div className={`tab ${isActive ? 'active' : ''}`} onClick={handleClick}>
      {label}
    </div>
  );
}

function TabContent({
  title,
  fftData,
  rawData,
  setRawData,
  selectedFile,
  setFftData,
  isFileRunning,
  settingModel,
}) {
  return (
    <div className={styles.surface}>
      <LineCard
        title={title}
        rawData={rawData}
        setRawData={setRawData}
        selectedFile={selectedFile}
        setFftData={setFftData}
        isFileRunning={isFileRunning}
        settingModel={settingModel}
      />
      <LineCard
        title={title}
        rawData={fftData}
        setRawData={setRawData}
        selectedFile={selectedFile}
        setFftData={setFftData}
        isFileRunning={isFileRunning}
        settingModel={settingModel}
      />
    </div>
  );
}

function TabContainer({
  tabs,
  fftData,
  rawData,
  setRawData,
  selectedFile,
  setFftData,
  isFileRunning,
  settingModel,
  activeIndex,
  handleTabClick,
}) {
  return (
    <div className='tab-container'>
      <div
        className='tab-list'
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            tabIndex={index}
            activeIndex={activeIndex}
            handleTabClick={handleTabClick}
          />
        ))}
      </div>
      <div className='tab-content'>
        {tabs.map((tab, index) => (
          <div
            key={index}
            style={{ display: activeIndex === index ? 'block' : 'none' }}
          >
            <TabContent
              title={tab.label}
              fftData={fftData}
              rawData={rawData}
              setRawData={setRawData}
              selectedFile={selectedFile}
              setFftData={setFftData}
              isFileRunning={isFileRunning}
              settingModel={settingModel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
