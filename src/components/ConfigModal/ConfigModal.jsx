import React, { useEffect, useRef, useState } from 'react';
import { daqInit, DaqInitFunction } from '../../controller/daq';

import { ConfigModel, SettingModel } from '../../model/SettingModel';
import { getConfigPath, writeConfig } from '../../utils/file';
import ConfigModalView from './ConfigModalView';

export default function ConfigModal({
  showPopup,
  setShowPopup,
  settingModel,
  setSettingModel,
  setRawData,
  setFftData,
  contents,
  setContents
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

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setSettingModel((prev) => ({...prev, [name]: value}));
  };

  const handleSave = async () => {
    await writeConfig({ contents, setIsSavedSuccess }).then((res) => {
      if (!res) return;
      DaqInitFunction({ setRawData, setFftData });
    });
    setIsShowIcon((prev) => !prev);
    setTimeout(() => {
      setIsShowIcon((prev) => !prev);
    }, 1000);
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
    />
  );
}
