import { useEffect, useState } from 'react';
import { chartDatas, generateColor } from '../../constant/constant';
import AppbarView from './AppbarView';
import { controlWindowBtns } from '../../utils/file';
import { FileModel } from '../../model/FileModel';
import { DaqInitFunction, daqGetStatistics } from '../../controller/daq';
export default function AppBar({
  rawData,
  setRawData,
  setFftData,
  setShowPopup,
  setCbStatus,
  cbStatus,
  selectedFile,
  setSelectedFile,
  isFileRunning,
  setIsFileRunning,
  setSettingModel,
  contents
}) {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    DaqInitFunction({ setRawData, setFftData });
  }, []);

  const openPopup = () => {
    setShowPopup(true);
  };

  const clearFileInput = (inputElement) => {
    inputElement.value = '';
  };

  // 파일 선택후 bin에 전달
  const handleFile = async (e) => {
    const file = e.target.files;
    let filesArray = Array.from(file);
    // fileArray중에 bin이 아닌거 제외
    const updatedFileArray = filesArray.filter((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return fileExtension === 'bin';
    });
    if (updatedFileArray.length === 0) return;
    // bin으로만 정렬
    if (updatedFileArray.length !== filesArray.length) {
      filesArray = updatedFileArray;
    }
    const pathList = filesArray.map(file => file.path);
    const path = pathList[0];
    if (path !== undefined) {
      const selectedFiles = filesArray.map(
        (file) => new FileModel(file.name, file.path)
      );
      setSelectedFile(selectedFiles);
      setIsFileRunning(true);
      setSettingModel(prevModel => ({...prevModel, paths: pathList}));
    }

    clearFileInput(e.target);
  };

  const handleRun = async () => {
    // 날리기
   console.log("Calc", contents);
   const ret = await daqGetStatistics(contents);
   console.log("ret", ret);
  };

  const handleFileLoad = () => {
    if (isFileRunning) {
      setIsFileRunning(false);
      setSelectedFile([]);
      setSettingModel(prevModel => ({...prevModel, paths: []}));
      return;
    }
    document.getElementById('importAttachment').click();
  };

  const handleCloseWindow = () => {
    controlWindowBtns('closeWindow');
  };
  const handleMinimizeWindow = () => {
    controlWindowBtns('minimizeWindow');
  };
  const handleMaximizeWindow = () => {
    controlWindowBtns('maximizeWindow');
  };
  return (
    <AppbarView
      handleFile={handleFile}
      handleFileLoad={handleFileLoad}
      handleCloseWindow={handleCloseWindow}
      handleMinimizeWindow={handleMinimizeWindow}
      handleMaximizeWindow={handleMaximizeWindow}
      isRunning={isRunning}
      selectedFile={selectedFile}
      openPopup={openPopup}
      isFileRunning={isFileRunning}
      handleRun={handleRun}
    />
  );
}
