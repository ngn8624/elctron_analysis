const ffi = require('ffi-napi');
const ref = require('ref-napi');
const { ipcRenderer } = require('electron');
const wgsFunction = ffi.Library('wave_sense_daq.dll', {
  init: ['int', ['char *']],
  setWaveStatCallback: ['int', ['pointer']],
  getStatistics: ['int', ['char *']],
  getCycleCount: ['int', ['char *']],
});
let waveStatCallback = null;

const waveStatcallbackData = ffi.Callback(
  'void',
  ['int', 'int', 'pointer', 'pointer'],
  (srcCnt, dataCnt, ss, ssfft) => {
    const float64 = 8;
    //ss를 double[srcCnt]로 변환
    const srcData = Array.from(
      { length: srcCnt },
      (_, i) =>
        new Float64Array(
          ss.buffer.slice(i * float64 * dataCnt, (i + 1) * float64 * dataCnt)
        )
    );
    // UI 탭 통계 DATA 형식으로 위치만 정렬
    const rawData = Array.from({ length: dataCnt }, (_, i) =>
      Array.from({ length: srcCnt }, (_, j) => srcData[j][i])
    );
    //ssfft를 double[srcCnt]로 변환
    const srcFFTData = Array.from(
      { length: srcCnt },
      (_, i) =>
        new Float64Array(
          ssfft.buffer.slice(i * float64 * dataCnt, (i + 1) * float64 * dataCnt)
        )
    );
    // UI 탭 통계 DATA 형식으로 위치만 정렬
    const fftData = Array.from({ length: dataCnt }, (_, i) =>
      Array.from({ length: srcCnt }, (_, j) => srcFFTData[j][i])
    );
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

async function getCycleCount(path) {
  const pathBuffer = Buffer.alloc(path.length + 1);
  pathBuffer.fill(0);
  pathBuffer.write(path, 0, 'utf-8');
  return wgsFunction.getCycleCount(pathBuffer);
}

//loadFile 함수 export
module.exports = {
  init,
  setWaveStatCallback,
  getStatistics,
  getCycleCount,
};
