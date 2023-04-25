import { useEffect, useState } from 'react';
import AppbarView from './AppbarView';
import { controlWindowBtns } from '../../utils/file';
import { FileModel } from '../../model/FileModel';
import {
  DaqInitFunction,
  daqGetStatistics,
  daqGetStatisticsStop,
} from '../../controller/daq';

let timer = 0;
export default function AppBar({
  setRawData,
  setFftData,
  setShowPopup,
  selectedFile,
  setSelectedFile,
  isFileRunning,
  setIsFileRunning,
  setSettingModel,
  contents,
  isTabs,
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
    const pathList = filesArray.map((file) => file.path);
    const path = pathList[0];
    if (path !== undefined) {
      const selectedFiles = filesArray.map(
        (file) => new FileModel(file.name, file.path)
      );
      setSelectedFile(selectedFiles);
      setIsFileRunning(true);
      setSettingModel((prevModel) => ({ ...prevModel, paths: pathList }));
    }

    clearFileInput(e.target);
  };

  // test용
  const Start = async () => {
    console.log('Start탔냐');
    timer = setInterval(() => {
      const dataCnt = isTabs.length;
      const srcCnt = 3;
      setRawData((prevData) => {
        const newRawData = [...prevData];
        for (let i = 0; i < dataCnt; i++) {
          for (let j = 0; j < srcCnt; j++) {
            newRawData[i][j].push(Math.floor(Math.random() * 100));
          }
        }
        return newRawData;
      });
      setFftData((prevData) => {
        const newRawData = [...prevData];
        for (let i = 0; i < dataCnt; i++) {
          for (let j = 0; j < srcCnt; j++) {
            newRawData[i][j].push(Math.floor(Math.random() * 100));
          }
        }
        return newRawData;
      });
    }, 1000);
  };

  // test용
  const end = () => {
    console.log('end 탔냐');
    clearInterval(timer);
  };

  const handleRun = () => {
    setIsRunning((prev) => {
      if (prev) {
        daqGetStatisticsStop();
        // end(); // test용
      } else {
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
        // Start(); // test용
        daqGetStatistics(contents);
      }
      return !prev;
    });
  };

  const handleFileLoad = () => {
    if (isFileRunning) {
      setIsFileRunning(false);
      setSelectedFile([]);
      setSettingModel((prevModel) => ({ ...prevModel, paths: [] }));
      console.log('file list', selectedFile);
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
