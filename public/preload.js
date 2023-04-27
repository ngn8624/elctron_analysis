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
  analysisInit: async (path) => {
    const dll = require('../src/controller/load-file');
    return await dll.analysisInit(path);
  },
  analysisClose: async (path) => {
    const dll = require('../src/controller/load-file');
    return await dll.analysisClose(path);
  },
  getStatistics: async (path) => {
    const dll = require('../src/controller/load-file');
    return await dll.getStatistics(path);
  },
  getCycleCount: async (path) => {
    const dll = require('../src/controller/load-file');
    return await dll.getCycleCount(path);
  },
  setWaveStatCallback: async (cbData) => {
    const dll = require('../src/controller/load-file');
    return await dll.setWaveStatCallback(cbData);
  },
  setFFTCallback: async (cbData) => {
    const dll = require('../src/controller/load-file');
    return await dll.setFFTCallback(cbData);
  },
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
});
