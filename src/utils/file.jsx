//config용
export const getConfigPath = () => {
  if (!window.wgsFunction) return '';
  const publicPath = window.wgsFunction.dirname;
  if (publicPath.includes('public')) {
    return publicPath.replace('public', 'config') + '\\config.json';
  } else {
    const cutIdx = publicPath.indexOf('resources');
    return publicPath.slice(0, cutIdx) + 'config\\config.json';
  }
};

export const getCalcPath = () => {
  if (!window.wgsFunction) return '';
  const publicPath = window.wgsFunction.dirname;
  if (publicPath.includes('public')) {
    return publicPath.replace('public', 'calc') + '\\calc.json';
  } else {
    const cutIdx = publicPath.indexOf('resources');
    return publicPath.slice(0, cutIdx) + 'calc\\calc.json';
  }
};

export const writeConfig = async ({ contents, setIsSavedSuccess }) => {
  if (!window.wgsFunction) return false;
  const isSuccess = await window.wgsFunction.writeFile(
    getCalcPath(),
    contents
  );
  setIsSavedSuccess(isSuccess);
  return isSuccess;
};

export const readConfig = async () => {
  if (!window.wgsFunction) return '';
  return await window.wgsFunction.readFile(getCalcPath());
};

export const existFile = async (path) => {
  if (!window.wgsFunction) return false;
  return await window.wgsFunction.existsSync(path);
};

export const makeDir = async (dir) => {
  if (!window.wgsFunction) return false;
  return await window.wgsFunction.mkdir(dir);
};
//window버튼함수
export const controlWindowBtns = async (controlMsg) => {
  if (!window.wgsFunction) return;
  await window.wgsFunction.controlWindow(controlMsg);
};
