const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wgsFunction', {
  dirname: __dirname,
  readFile: async (path) => {
    return await ipcRenderer.invoke('read-file', path);
  },
  writeFile: async (path, data) => {
    return await ipcRenderer.invoke('write-file', path, data);
  },
  existsSync: async (path) => {
    return await ipcRenderer.invoke('existsSync', path);
  },
  mkdir: async (path) => {
    return await ipcRenderer.invoke('mkdir', path);
  },
  // loadFile: async (path) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.loadFile(path);
  // },
  init: async (path) => {
    const dll = require('../src/controller/load-file');
    return await dll.init(path);
  },
  getStatistics: async (path) => {
    const dll = require('../src/controller/load-file');
    return await dll.getStatistics(path);
  },
  // start: async (path) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.start(path);
  // },
  // stop: async () => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.stop();
  // },
  setCallback: async (cbData) => {
    const dll = require('../src/controller/load-file');
    return await dll.setCallback(cbData);
  },
  // setCallbackStatus: async (cbData) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.setCallbackStatus(cbData);
  // },
  // setCallbackLog: async (cbData) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.setCallbackLog(cbData);
  // },
  // saveStart: async (time) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.saveStart(time);
  // },
  // saveStop: async () => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.saveStop();
  // },
  // addCheck: async (time) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.addCheck(time);
  // },
  handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
  receive: (channel, func) => {
    let validChannels = ['fromMain']; // IPC채널들 추가
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  sendMessage: (message) => {
    window.postMessage({ type: 'message', data: message }, '*');
  },
  ///window 버튼들 기능
  controlWindow: async (controlMsg) => {
    ipcRenderer.invoke(controlMsg, []);
  },
  // binLoadFile: async (path) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.binLoadFile(path);
  // },
  // checkFilePath: async (path, length) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.checkFilePath(path, length);
  // },
  // setCallbackCheck: async (cbData) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.setCallbackCheck(cbData);
  // },
  // checkListStart: async (path, selectedTime) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.checkListStart(path, selectedTime);
  // },
  // checkPlayStop: async () => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.checkPlayStop();
  // },
  // setCallbackCheckData: async (cbCheckData) => {
  //   const dll = require('../src/controller/load-file');
  //   return await dll.setCallbackCheckData(cbCheckData);
  // },
});
