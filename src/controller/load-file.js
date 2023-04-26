const ffi = require('ffi-napi');
const ref = require('ref-napi');
const { ipcRenderer } = require('electron');
const wgsFunction = ffi.Library('wave_sense_daq.dll', {
  analysisInit: ['int', []],
  analysisClose: ['int', []],
  setWaveStatCallback: ['int', ['pointer']],
  getStatistics: ['int', ['char *']],
  getCycleCount: ['int', ['char *']],
});
let waveStatCallback = null;

const waveStatcallbackData = ffi.Callback(
  'void',
  ['int', 'int', 'int', 'pointer', 'pointer'],
  (srcCnt, cycleCnt, dataCnt, ss, ssfft) => {
    const float64 = 8;
    const cycleData = Array.from(
      { length: cycleCnt },
      (_, i) =>
        new Float64Array(
          ss.buffer.slice(
            i * float64 * dataCnt * srcCnt,
            (i + 1) * float64 * dataCnt * srcCnt
          )
        )
    );
    const cyclefftData = Array.from(
      { length: cycleCnt },
      (_, i) =>
        new Float64Array(
          ssfft.buffer.slice(
            i * float64 * dataCnt * srcCnt,
            (i + 1) * float64 * dataCnt * srcCnt
          )
        )
    );
    const rawData = [];
    const fftData = [];
    for (let i = 0; i < dataCnt; i++) {
      const rawDataRow = [];
      const fftDataRow = [];
      for (let j = 0; j < srcCnt; j++) {
        const srcData = [];
        const srcFFTData = [];
        for (let k = 0; k < cycleCnt; k++) {
          srcData.push(cycleData[k][i][j]);
          srcFFTData.push(cyclefftData[k][i][j]);
        }
        rawDataRow.push(srcData);
        fftDataRow.push(srcFFTData);
      }
      rawData.push(rawDataRow);
      fftData.push(fftDataRow);
    }
    const dataset = {
      srcCnt,
      dataCnt,
      rawData,
      fftData,
    };
    if (waveStatCallback != null) waveStatCallback(dataset);
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

async function getCycleCount(path) {
  const pathBuffer = Buffer.alloc(path.length + 1);
  pathBuffer.fill(0);
  pathBuffer.write(path, 0, 'utf-8');
  return wgsFunction.getCycleCount(pathBuffer);
}

//loadFile 함수 export
module.exports = {
  analysisInit,
  analysisClose,
  setWaveStatCallback,
  getStatistics,
  getCycleCount,
};
