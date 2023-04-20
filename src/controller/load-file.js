const ffi = require('ffi-napi');
const ref = require('ref-napi');
const { ipcRenderer } = require('electron');
const wgsFunction = ffi.Library('wave_sense_daq.dll', {
  init: ['int', ['char *']],
  setWaveStatCallback: ['int', ['pointer']],
  getStatistics: ['int', ['char *']],
});
let waveStatCallback = null;


const waveStatcallbackData = ffi.Callback(
  'void',
  ['int', 'int', 'int', 'pointer', 'pointer'],
  (rowindex,srcCnt, dataCnt, ss, ssfft) => {
    const float64 = 8;
    //ss를 double[dataCnt]로 변환
    const rawData = new Array(dataCnt);
    for (let i = 0; i < dataCnt; i++) {
      rawData[i] = new Float64Array(
        ss.buffer.slice(i * float64 * srcCnt, (i + 1) * float64 * srcCnt)
      );
    }

    //ssfft를 double[fftCnt]로 변환
    const fftData = new Array(dataCnt);
    for (let i = 0; i < dataCnt; i++) {
      fftData[i] = new Float64Array(
        ssfft.buffer.slice(i * float64 * srcCnt, (i + 1) * float64 * srcCnt)
      );
    }
    const dataset = {
      rowindex,
      srcCnt,
      dataCnt,
      rawData,
      fftData,
    };
    if (waveStatCallback != null) waveStatCallback(dataset);
  }
);

// // 프로그램 시작시 call, return 0 이면 success
async function init(path) {
  const pathBuffer = Buffer.alloc(path.length + 1);
  pathBuffer.fill(0);
  pathBuffer.write(path, 0, 'utf-8');
  return wgsFunction.init(pathBuffer);
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

//loadFile 함수 export
module.exports = {
  init,
  setWaveStatCallback,
  getStatistics
};
