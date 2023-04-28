import React, { useEffect, useRef, useState } from 'react';
import { DaqInitFunction } from '../../controller/daq';
import { writeConfig, readConfig } from '../../utils/file';
import ConfigModalView from './ConfigModalView';

export default function ConfigModal({
  showPopup,
  setShowPopup,
  settingModel,
  setSettingModel,
  setRawData,
  setFftData,
  contents,
  setContents,
  setFreq,
  setCheckRawData,
  setCheckFftData,
  setCnt
}) {
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [isShowIcon, setIsShowIcon] = useState(false);
  const modalRef = useRef();

  // 영역 밖으로 나가면 창 끄기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  // String to json용, contents로 보낼 json데이터 변환용
  useEffect(() => {
    const newSet = {
      paths: settingModel.paths,
      fftCnt:
        typeof settingModel.fftCnt == 'string'
          ? parseInt(settingModel.fftCnt)
          : settingModel.fftCnt,
      dcIgnore: settingModel.dcIgnore == 'TRUE' ? true : false,
      sampleInterval:
        typeof settingModel.sampleInterval == 'string'
          ? parseInt(settingModel.sampleInterval)
          : settingModel.sampleInterval,
      windowsIdx: settingModel.windowsIdx,
      viewMode: settingModel.viewMode,
      dbvRange:
        typeof settingModel.dbvRange == 'string'
          ? parseInt(settingModel.dbvRange)
          : settingModel.dbvRange,
      RMS: settingModel.RMS == 'TRUE' ? true : false,
      Mean: settingModel.Mean == 'TRUE' ? true : false,
      MeanH: settingModel.MeanH == 'TRUE' ? true : false,
      MeanG: settingModel.MeanG == 'TRUE' ? true : false,
      StDev: settingModel.StDev == 'TRUE' ? true : false,
      Skew: settingModel.Skew == 'TRUE' ? true : false,
      Kurt: settingModel.Kurt == 'TRUE' ? true : false,
      Mode: settingModel.Mode == 'TRUE' ? true : false,
      Median: settingModel.Median == 'TRUE' ? true : false,
      Q1: settingModel.Q1 == 'TRUE' ? true : false,
      Q3: settingModel.Q3 == 'TRUE' ? true : false,
      IQR: settingModel.IQR == 'TRUE' ? true : false,
    };
    setContents(JSON.stringify(newSet, null, 2));
  }, [settingModel]);

  const closePopup = () => {
    setShowPopup(false);
  };

  // json to string용, config파일에서 불러서 settingModel에 넣을때 변환용
  function convertToStrings(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertToStrings(item));
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = convertToStrings(value);
        return acc;
      }, {});
    } else if (typeof obj === 'boolean') {
      return obj ? 'TRUE' : 'FALSE';
    } else {
      return String(obj);
    }
  }

  // Load
  const handleLoad = async () => {
    await readConfig().then((data) => {
      const json = data ? JSON.parse(data) : {};
      if (json === JSON.stringify(settingModel)) return;
      const strObj = convertToStrings(json);
      setSettingModel(strObj);
      DaqInitFunction({ setCnt, setRawData, setFftData,setFreq, setCheckRawData, setCheckFftData });
    });
  };

  // save
  const handleSave = async () => {
    await writeConfig({ contents, setIsSavedSuccess }).then((res) => {
      if (!res) return;
      DaqInitFunction({ setCnt,setRawData, setFftData, setFreq, setCheckRawData, setCheckFftData });
    });
    setIsShowIcon((prev) => !prev);
    setTimeout(() => {
      setIsShowIcon((prev) => !prev);
    }, 1000);
  };

  // FFT 변경 함수
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setSettingModel((prev) => ({ ...prev, [name]: value }));
  };

  if (!showPopup) return null;

  return (
    <ConfigModalView
      closePopup={closePopup}
      settingModel={settingModel}
      onChangeInput={onChangeInput}
      isShowIcon={isShowIcon}
      isSavedSuccess={isSavedSuccess}
      modalRef={modalRef}
      handleSave={handleSave}
      handleLoad={handleLoad}
    />
  );
}
