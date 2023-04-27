import { generateColor } from '../constant/constant';
import { getConfigPath } from '../utils/file';

export const daqSetFFTCallback = async (cbData) => {
  if (!window.wgsFunction) return -1;
  return window.wgsFunction.setFFTCallback(cbData).then((res) => {
    if (res === 0) console.log('daqSetFFTCallback');
    else console.log('daqSetFFTCallback fail');
    return res;
  });
};

export const daqSetWaveStatCallback = async (cbData) => {
  if (!window.wgsFunction) return -1;
  return window.wgsFunction.setWaveStatCallback(cbData).then((res) => {
    if (res === 0) console.log('setWaveStatCallback');
    else console.log('setWaveStatCallback fail');
    return res;
  });
};

export const daqInit = async () => {
  if (!window.wgsFunction) return -1; // 0 : success , -1 : fail
  return window.wgsFunction.analysisInit().then((res) => {
    if (res === 0) console.log('daqInit success');
    else console.log('daqInit fail');
    return res;
  });
};

export const daqClose = async () => {
  if (!window.wgsFunction) return -1; // 0 : success , -1 : fail
  return window.wgsFunction.analysisClose().then((res) => {
    if (res === 0) console.log('daqClose success');
    else console.log('daqClose fail');
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
    if (res === 0) console.log('getStatistics fail');
    else console.log('getStatistics success');
    return res;
  });
};

export const daqGetStatisticsStop = async (json) => {
  console.log('daqGetStatisticsStop 있어야해용????');
};

export function DaqInitFunction({ setRawData, setFftData,setFreq }) {
  daqInit();
  daqSetWaveStatCallback((data) => {
    cbData({
      data: data,
      setRawData: setRawData,
    });
  });
  daqSetFFTCallback((data) => {
    cbFftData({
      data: data,
      setFftData: setFftData,
      setFreq: setFreq
    });
  });
}

export function cbData({ data, setRawData }) {
  const { srcCnt, cycleCnt, dataCnt, rawData } = data;
  setRawData((prevData) => {
    const newRawData = [...prevData];
    for (let i = 0; i < dataCnt; i++) {
      for (let j = 0; j < srcCnt; j++) {
        if (!newRawData[i][j]) {
          newRawData[i][j] = [];
        }
        const k = newRawData[i][j].length;
        newRawData[i][j].length = k + 1;
        if (!newRawData[i][j][k]) {
          newRawData[i][j][k] = [];
        }
        for (let l = 0; l < cycleCnt; l++) {
          newRawData[i][j][k].push(rawData[i][j][l]);
        }
      }
    }
    return newRawData;
  });
}

export function cbFftData({ data, setFftData,setFreq }) {
  const { srcCnt, cycleCnt, fftdata, fftDataFreq } = data;
  setFftData((prevData) => {
    const newRawData = [...prevData];
    newRawData.push(fftdata); // 요소를 추가
    return newRawData;
  });
  setFreq((prevData) => {
    const newRawData = [...prevData];
    newRawData.push(fftDataFreq); // 요소를 추가
    return newRawData;
  });
}
