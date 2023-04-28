import { generateColor } from '../constant/constant';
import { getConfigPath } from '../utils/file';
import { v4 as uuidv4 } from 'uuid';
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

export const daqSetRawDatasCallback = async (cbData) => {
  if (!window.wgsFunction) return -1;
  return window.wgsFunction.setRawDatasCallback(cbData).then((res) => {
    if (res === 0) console.log('setRawDatasCallback');
    else console.log('setRawDatasCallback fail');
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

export const daqGetDatasByIndex = async (path, index) => {
  if (!window.wgsFunction) return -1; // 0 : success , -1 : fail
  return window.wgsFunction.getDatasByIndex(path, index).then((res) => {
    if (res === 0) console.log('getDatasByIndex success');
    else console.log('getDatasByIndex fail');
    return res;
  });
};

export function DaqInitFunction({
  setRawData,
  setFftData,
  setFreq,
  setCheckRawData,
  setCheckFftData,
}) {
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
      setFreq: setFreq,
    });
  });
  daqSetRawDatasCallback((data) => {
    clickDatas({
      data: data,
      setCheckRawData: setCheckRawData,
      setCheckFftData: setCheckFftData,
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

export function cbFftData({ data, setFftData, setFreq }) {
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

export function clickDatas({ data, setCheckRawData, setCheckFftData }) {
  const { index, srcCnt, waveSize, fftSize, rawData, fftData } = data;
  const tempRawData = Array.from({ length: srcCnt }, () => []);
  const tempX = Array.from({ length: waveSize }, () => []);
  for (let j = 0; j < waveSize; j++) {
    tempX[j] = parseFloat(((j + 1) / waveSize).toFixed(6)) + index;
  }
  for (let i = 0; i < srcCnt; i++) {
    for (let j = 0; j < waveSize; j++) {
      tempRawData[i].push({ x: tempX[j], y: rawData[i][j] });
    }
  }
  const tempFftData = Array.from({ length: srcCnt }, () => []);
  for (let i = 0; i < srcCnt; i++) {
    for (let j = 0; j < fftSize; j++) {
      tempFftData[i].push({ x: fftData[0][j], y: fftData[i + 1][j] });
    }
  }
  const colorsArray = [];
  for (let i = 0; i < srcCnt; i++) {
    colorsArray.push(generateColor());
  }
  setCheckRawData((prev) => {
    let tempx=1;
    if (prev.length != 0) {
      tempx +=1;
    }
    const newData = [
      ...prev,
      {
        id: uuidv4(),
        hidden: false,
        label: 'X'+ '-'+ tempx,
        borderColor: colorsArray[0],
        backgroundColor: colorsArray[0],
        fill: false,
        borderWidth: 0.7,
        radius: 0,
        pointRaduis: 0,
        data: tempRawData[0],
      },
      {
        id: uuidv4(),
        hidden: false,
        label: 'Y'+ '-'+ tempx,
        borderColor: colorsArray[1],
        backgroundColor: colorsArray[1],
        fill: false,
        borderWidth: 0.7,
        radius: 0,
        pointRaduis: 0,
        data: tempRawData[1],
      },
      {
        id: uuidv4(),
        hidden: false,
        label: 'Z'+ '-'+ tempx,
        borderColor: colorsArray[2],
        backgroundColor: colorsArray[2],
        fill: false,
        borderWidth: 0.7,
        radius: 0,
        pointRaduis: 0,
        data: tempRawData[2],
      },
    ];
    return newData;
  });

  setCheckFftData((prev) => {
    let tempx=1;
    if (prev.length != 0) {
      tempx +=1;
    }
    const newData = [
      ...prev,
      {
        id: uuidv4(),
        hidden: false,
        label: 'X'+ '-'+ tempx,
        borderColor: colorsArray[0],
        backgroundColor: colorsArray[0],
        fill: false,
        borderWidth: 0.7,
        radius: 0,
        pointRaduis: 0,
        data: tempFftData[0],
      },
      {
        id: uuidv4(),
        hidden: false,
        label: 'Y'+ '-'+ tempx,
        borderColor: colorsArray[1],
        backgroundColor: colorsArray[1],
        fill: false,
        borderWidth: 0.7,
        radius: 0,
        pointRaduis: 0,
        data: tempFftData[1],
      },
      {
        id: uuidv4(),
        hidden: false,
        label: 'Z'+ '-'+ tempx,
        borderColor: colorsArray[2],
        backgroundColor: colorsArray[2],
        fill: false,
        borderWidth: 0.7,
        radius: 0,
        pointRaduis: 0,
        data: tempFftData[2],
      },
    ];
    return newData;
  });
}
