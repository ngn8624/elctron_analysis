import { generateColor } from '../constant/constant';
import { getConfigPath } from '../utils/file';

export const daqSetCallBack = async (cbData) => {
  if (!window.wgsFunction) return -1;
  return window.wgsFunction.setCallback(cbData).then((res) => {
    if (res === 0) console.log('daqSetCallBack');
    else console.log('daqSetCallBack fail');
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

export const daqGetStatistics = async (json) => {
  if (!window.wgsFunction) return -1; // 0 : success , -1 : fail
  return window.wgsFunction.getStatistics(json).then((res) => {
    if (res === 0) console.log('getStatistics success');
    else console.log('getStatistics fail');
    return res;
  });
};

export function DaqInitFunction({ setRawData, setFftData }) {
  daqInit(getConfigPath());
  daqSetCallBack((data) => {
    cbData({
      data: data,
      setRawData: setRawData,
      setFftData: setFftData,
    });
  });
}

export function cbData({ data, setRawData, setFftData }) {
  const { srcCnt, staticsCnt, rawData, fftData } = data;
  console.log("asdasd'");
//   const tempRawData = Array.from({ length: srcCnt }, () => []);
//   const tempX = Array.from({ length: dataCnt }, () => []);
//   for (let j = 0; j < dataCnt; j++) {
//     tempX[j] = parseFloat(((j + 1) / dataCnt).toFixed(6)) + rowIdx;
//   }
//   for (let i = 0; i < srcCnt; i++) {
//     for (let j = 0; j < dataCnt; j++) {
//       tempRawData[i].push({ x: tempX[j], y: rawData[i][j] });
//     }
//   }
//   const tempFftData = Array.from({ length: srcCnt }, () => []);
//   for (let i = 0; i < srcCnt; i++) {
//     for (let j = 0; j < fftCnt; j++) {
//       tempFftData[i].push({ x: fftData[0][j], y: fftData[i][j] });
//     }
//   }
//   setRawData((prev) => {
//     const newData = prev.map((d, index) => {
//       return {
//         ...d,
//         data: tempRawData[index],
//       };
//     });
//     return newData;
//   });

//   setFftData((prev) => {
//     const newData = prev.map((d, index) => {
//       return {
//         ...d,
//         data: tempFftData[index],
//       };
//     });
//     return newData;
//   });
}
