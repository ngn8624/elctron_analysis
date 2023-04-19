const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs').promises;

ipcMain.handle('read-file', async (event, path) => {
  return await fs
    .access(path, 0)
    .then(async () => {
      //파일이 있으면 readFile
      return await fs
        .readFile(path)
        .then((data) => {
          return data.toString();
        })
        .catch(() => {
          return '';
        });
    })
    .catch(() => {
      //파일 없으면 return
      return '';
    });
});

ipcMain.handle('write-file', async (event, path, data) => {
  return await fs
    .access(path, 0)
    .then(async () => {
      //파일이 있으면 writeFile
      return await fs
        .writeFile(path, data)
        .then(() => true)
        .catch(() => false);
    })
    .catch(async () => {
      //파일이 없다면 경로 생성 후 writeFile
      const idx = path.lastIndexOf('\\');
      const dir = path.slice(0, idx);
      return await fs.mkdir(dir, { recursive: true }).then(async () => {
        return await fs
          .writeFile(path, data)
          .then(() => true)
          .catch(() => false);
      });
    });
});

ipcMain.handle('existsSync', async (event, path) => {
  return await fs
    .access(path, 0)
    .then(() => true)
    .catch(() => false);
});

ipcMain.handle('mkdir', async (event, path) => {
  return await fs
    .mkdir(path, { recursive: true })
    .then(() => true)
    .catch(() => false);
});

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let win = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 600,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      preload: `${__dirname}/preload.js`,
    },
    icon: `${__dirname}/app_icon_512.ico`,
  });

  if (isDev) {
    console.log('dev');
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    console.log('release');
    win.loadFile(`${path.join(__dirname, '../build/index.html')}`);
  }

  win.once('ready-to-show', () => win.show());
  win.on('closed', () => {
    win = null;
  });
  ipcMain.handle('minimizeWindow', async (event) => {
    try {
      win.isMinimized() ? win.restore() : win.minimize();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  });
  ipcMain.handle('maximizeWindow', async (event) => {
    try {
      win.isMaximized() ? win.restore() : win.maximize();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }});
});
ipcMain.handle('closeWindow', async (event) => {
  try {
    app.quit();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
