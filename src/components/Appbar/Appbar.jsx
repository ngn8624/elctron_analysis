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
  settingModel,
  setSettingModel,
  contents,
  isTabs,
  setContents,
  startCalc,
  setStartCalc,
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
    filesArray = filesArray.filter((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return fileExtension === 'bin';
    });
    // 중복 제거
    const selectedFileNames = selectedFile.map((file) => file.name);
    filesArray = filesArray.filter((file) => {
      return !selectedFileNames.includes(file.name);
    });
    filesArray = filesArray.map((file) => new FileModel(file.name, file.path));
    if (filesArray.length !== 0) {
      setSelectedFile([...selectedFile, ...filesArray]);
      setIsFileRunning(true);
      clearFileInput(e.target);
    }
  };

  // test용 지우지 말것
  const Start = async () => {
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
    clearInterval(timer);
  };

  const handleRun = async () => {
    setIsRunning((prev) => {
      if (prev) {
        setStartCalc(false);
        daqGetStatisticsStop();
        // end(); // test용
      } else {
        setStartCalc(true);
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
        // selectedFile중에서 check된것만 filter하는 code있어야함
        const sendSelectedFile = selectedFile.filter(
          (item) => item.checked == true
        );
        const contentsTemp = JSON.parse(contents); // JSON 형식의 문자열을 JavaScript 객체로 변환
        for (let i = 0; i < sendSelectedFile.length; i++) {
          const newSet = {
            ...contentsTemp,
            paths: [sendSelectedFile[i].path],
          };
          const contentsValue = JSON.stringify(newSet, null, 2); // JavaScript 객체를 JSON 형식의 문자열로 변환
          daqGetStatistics(contentsValue);
        }
        // Start(); // test용
      }
      return !prev;
    });
  };

  const handleFileLoad = () => {
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
