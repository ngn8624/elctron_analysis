const ffi = require('ffi-napi');
const ref = require('ref-napi');
const { ipcRenderer } = require('electron');
const wgsFunction = ffi.Library('wave_sense_daq.dll', {
  // openFileDataCount: ['int', ['char *']],
  // openFile: ['int', ['char *', 'char *', 'int']],
  init: ['int', ['char *']],
  // start: ['int', ['char *']],
  // stop: ['int', []],
  setCallbackData: ['int', ['pointer']], // 리턴값 확인 필요함. 성공인데 0 안들어옴
  // saveStart: ['int', ['int64']],
  // saveStop: ['int', []], // 저장하다가 중단하면 프리즈현상 발생하는 것 같음
  // addCheck: ['int', ['int64']],
  // setCallbackStatus: ['int', ['pointer']], // 함수는 동작되는데 json 어떻게 들어오는 지 모르겠음
  // setCallbackLog: ['int', ['pointer']], // 함수는 동작되는데 json 어떻게 들어오는 지 모르겠음
  // binLoadFile: ['int', ['char *']],
  // checkFilePath: ['int', ['pointer', 'int']],
  // setCallbackCheck: ['int', ['pointer']],
  // checkListStart: ['int', ['char *', 'int']],
  // checkPlayStop:['int', []],
  // setCallbackCheckData: ['int', ['pointer']],
  getStatistics: ['int', ['char *']],
});
let dataCallback = null;
// let dataStatusCallback = null;
// let dataCheckCallback = null;
// let dataCheckDataCallback = null;

const callbackData = ffi.Callback(
  'void',
  ['int', 'int', 'int', 'int', 'pointer', 'pointer'],
  (rowIdx, srcCnt, dataCnt, fftCnt, ss, ssfft) => {
    // rowIdx : 몇번째 던지는지
    // srcCnt : 예를들어 3개면 x,y,z
    // dataCnt : rawData 하나당 1초에 몇개씩 던지는지 현재 240000
    // fftCnt : fft한 개수 : ex) 2048개
    const float64 = 8;
    //ss를 double[dataCnt]로 변환
    const rawData = new Array(srcCnt);
    for (let i = 0; i < srcCnt; i++) {
      rawData[i] = new Float64Array(
        ss.buffer.slice(i * float64 * dataCnt, (i + 1) * float64 * dataCnt)
      );
    }

    //ssfft를 double[fftCnt]로 변환
    const fftData = new Array(srcCnt + 1);
    for (let i = 0; i < srcCnt + 1; i++) {
      fftData[i] = new Float64Array(
        ssfft.buffer.slice(i * float64 * fftCnt, (i + 1) * float64 * fftCnt)
      );
    }

    const dataset = {
      rowIdx,
      srcCnt,
      dataCnt,
      fftCnt,
      rawData,
      fftData,
    };
    if (dataCallback != null) dataCallback(dataset);
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
  console.log("json", json);
  const pathBuffer = Buffer.alloc(json.length + 1);
  pathBuffer.fill(0);
  pathBuffer.write(json, 0, 'utf-8');
  return wgsFunction.getStatistics(pathBuffer);
}

// return 0 이면 success,
async function setCallback(cbData) {
  dataCallback = cbData;
  return wgsFunction.setCallbackData(callbackData);
}

//loadFile 함수 export
module.exports = {
  init,
  // start,
  // stop,
  setCallback,
  // saveStart,
  // saveStop,
  // addCheck,
  // setCallbackLog,
  // setCallbackStatus,
  // binLoadFile,
  // checkFilePath,
  // setCallbackCheck,
  // checkListStart,
  // checkPlayStop,
  // setCallbackCheckData
  getStatistics
};
