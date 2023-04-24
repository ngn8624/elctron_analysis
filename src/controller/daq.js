import { generateColor } from '../constant/constant';
import { getConfigPath } from '../utils/file';

export const daqSetWaveStatCallback = async (cbData) => {
  if (!window.wgsFunction) return -1;
  return window.wgsFunction.setWaveStatCallback(cbData).then((res) => {
    if (res === 0) console.log('setWaveStatCallback');
    else console.log('setWaveStatCallback fail');
    return res;
  });
};

export const daqInit = async (path) => {
  if (!window.wgsFunction) return -1; // 0 : success , -1 : fail
  return window.wgsFunction.init(path).then((res) => {
    if (res === 0) console.log('daqInit success');
    else console.log('daqInit fail');
    return res;
  });
};

export const daqGetCycleCount = async (path) => {
  if (!window.wgsFunction) return -1; // 0 : success , -1 : fail
  return window.wgsFunction.getCycleCount(path).then((res) => {
    if (res === 0) console.log('daqGetCycleCount success');
    else console.log('daqGetCycleCount fail');
    return res;
  });
};

export const daqGetStatistics = async (json) => {
  if (!window.wgsFunction) return -1; // 0 : success , -1 : fail
  return window.wgsFunction.getStatistics(json).then((res) => {
    if (res === 0) console.log('getStatistics success');
    else console.log('getStatistics fail');
    return res;
  });
};

export const daqGetStatisticsStop = async (json) => {
  console.log("daqGetStatisticsStop 있어야해용");
};

export function DaqInitFunction({ setRawData, setFftData }) {
  daqInit(getConfigPath());
  daqSetWaveStatCallback((data) => {
    cbData({
      data: data,
      setRawData: setRawData,
      setFftData: setFftData,
    });
  });
}

export function cbData({ data, setRawData, setFftData }) {
  const { srcCnt, dataCnt, rawData, fftData } = data;
  setRawData((prevData) => {
    const newRawData = [...prevData];
    for (let i = 0; i < dataCnt; i++) {
      for (let j = 0; j < srcCnt; j++) {
        newRawData[i][j].push(rawData[i][j]);
      }
    }
    return newRawData;
  });

  setFftData((prevData) => {
    const newFftData = [...prevData];
    for (let i = 0; i < dataCnt; i++) {
      for (let j = 0; j < srcCnt; j++) {
        newFftData[i][j].push(fftData[i][j]);
      }
    }
    return newFftData;
  });
}
