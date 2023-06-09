const ffi = require('ffi-napi');
const ref = require('ref-napi');
const { ipcRenderer } = require('electron');
const wgsFunction = ffi.Library('wave_sense_daq.dll', {
  analysisInit: ['int', []],
  analysisClose: ['int', []],
  setWaveStatCallback: ['int', ['pointer']],
  getStatistics: ['int', ['char *']],
  getCycleCount: ['int', ['char *']],
  setRawDatasCallback: ['int', ['pointer']],
  getDatasByIndex: ['int', ['char *', 'int']],
  setFFTCallback: ['int', ['pointer']],
});

let waveStatCallback = null;
let fftCallback = null;
let rawDataCallback = null;

const waveFftCallbackData = ffi.Callback(
  'void',
  ['int', 'int', 'pointer', 'pointer'],
  (srcCnt, cycleCnt, ss, ssfft) => {

    const float64 = 8;
    const cycleData3dFft=[];
    for (let i = 0; i < cycleCnt; i++) {
        const srcDataFft = [];
        for (let k = 0; k < srcCnt; k++) {
          const start = (i *srcCnt + k) * float64;
          const end = start + float64;
          const datafft = new Float64Array(ss.buffer.slice(start, end));
          srcDataFft.push(datafft[0]); // 0번째 인덱스만 사용
      }
      cycleData3dFft.push(srcDataFft);
    }
    const fftdata = [];
    for (let i = 0; i < srcCnt; i++) {
      const fftdataRow = [];
      for (let j = 0; j < cycleCnt; j++) {
        fftdataRow.push(cycleData3dFft[j][i]);
      }
      fftdata.push(fftdataRow);
    }

    // // fft 주파수
    const fftDataFreq = new Float64Array(
      ssfft.buffer.slice(0, srcCnt* float64)
      );
    const dataset = {
      srcCnt,
      cycleCnt,
      fftdata,
      fftDataFreq,
    };
    if (fftCallback != null) fftCallback(dataset);
  }
);

// setRawData
const waveStatcallbackData = ffi.Callback(
  'void',
  ['int', 'int', 'int', 'pointer'],
  (srcCnt, cycleCnt, dataCnt, ss) => {
    const float64 = 8;
    const cycleData3d = [];
    for (let i = 0; i < cycleCnt; i++) {
      const dataData = [];
      for (let j = 0; j < dataCnt; j++) {
        const srcData = [];
        // const srcDataFft = [];
        for (let k = 0; k < srcCnt; k++) {
          const start = (i * dataCnt * srcCnt + j * srcCnt + k) * float64;
          const end = start + float64;
          const data = new Float64Array(ss.buffer.slice(start, end));
          srcData.push(data[0]); // 0번째 인덱스만 사용
        }
        dataData.push(srcData);
      }
      cycleData3d.push(dataData);
    }
    const rawData = [];
    for (let i = 0; i < dataCnt; i++) {
      const rawDataRow = [];
      for (let j = 0; j < srcCnt; j++) {
        const srcData = [];
        for (let k = 0; k < cycleCnt; k++) {
          srcData.push(cycleData3d[k][i][j]);
        }
        rawDataRow.push(srcData);
      }
      rawData.push(rawDataRow);
    }
    const dataset = {
      srcCnt,
      cycleCnt,
      dataCnt,
      rawData,
    };
    if (waveStatCallback != null) waveStatCallback(dataset);
  }
);

const rawDataCallbackData = ffi.Callback(
  'void',
  [ 'int','int','int', 'int', 'pointer', 'pointer'],
  (index,srcCnt, waveSize, fftSize, waveDatas, fftDatas) => {
    const float64 = 8;
    //waveData는 sampleRate * srcCnt 개, xyz 분리해야됨
    //fftData는 fftCnt * srcCnt 개, xyz 분리해야됨
    const rawData = new Array(srcCnt);
    for (let i = 0; i < srcCnt; i++) {
      rawData[i] = new Float64Array(
        waveDatas.buffer.slice(i * float64 * waveSize, (i + 1) * float64 * waveSize)
      );
    }
    const fftData = new Array(srcCnt + 1);
    for (let i = 0; i < srcCnt + 1; i++) {
      fftData[i] = new Float64Array(
        fftDatas.buffer.slice(i * float64 * fftSize, (i + 1) * float64 * fftSize)
      );
    }
    const dataset = {
      index,
      srcCnt,
      waveSize,
      fftSize,
      rawData,
      fftData
    };
    if (rawDataCallback != null) rawDataCallback(dataset);
  }
);

// // 프로그램 시작시 call, return 0 이면 success
async function analysisInit() {
  return wgsFunction.analysisInit();
}

async function analysisClose() {
  return wgsFunction.analysisClose();
}

async function getStatistics(json) {
  const pathBuffer = Buffer.alloc(json.length + 1);
  pathBuffer.fill(0);
  pathBuffer.write(json, 0, 'utf-8');
  return wgsFunction.getStatistics(pathBuffer);
}

// return 0 이면 success,
async function setWaveStatCallback(cbData) {
  waveStatCallback = cbData;
  return wgsFunction.setWaveStatCallback(waveStatcallbackData);
}

async function setRawDatasCallback(data) {
  rawDataCallback = data;
  return wgsFunction.setRawDatasCallback(rawDataCallbackData);
}

async function getCycleCount(path) {
  const pathBuffer = Buffer.alloc(path.length + 1);
  pathBuffer.fill(0);
  pathBuffer.write(path, 0, 'utf-8');
  return wgsFunction.getCycleCount(pathBuffer);
}

async function getDatasByIndex(path, index) {
  const pathBuffer = Buffer.alloc(path.length + 1);
  pathBuffer.fill(0);
  pathBuffer.write(path, 0, 'utf-8');
  return wgsFunction.getDatasByIndex(pathBuffer, index);
}
async function setFFTCallback(cbData) {
  fftCallback = cbData;
  return wgsFunction.setFFTCallback(waveFftCallbackData);
}

//loadFile 함수 export
module.exports = {
  analysisInit,
  analysisClose,
  setWaveStatCallback,
  getStatistics,
  getCycleCount,
  setRawDatasCallback,
  getDatasByIndex,
  setFFTCallback
};
