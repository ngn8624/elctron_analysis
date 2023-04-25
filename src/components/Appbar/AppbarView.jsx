import StatusBtn from '../UI/StatusBtn/StatusBtn';
import WGSLogo from '../WGSLogo/WGSLogo';
import styles from './Appbar.module.css';
import CurrentTimeDisplay from '../UI/CurrentTime';
import { IoMdSettings } from 'react-icons/io';
import {
  VscChromeClose,
  VscChromeMinimize,
  VscChromeRestore,
} from 'react-icons/vsc';

export default function AppbarView(props) {
  const {
    handleFile,
    handleFileLoad,
    handleCloseWindow,
    handleMinimizeWindow,
    handleMaximizeWindow,
    isRunning,
    selectedFile,
    openPopup,
    isFileRunning,
    handleRun,
  } = props;
  return (
    <div className={styles.appbar}>
      <div className={styles.appbarLeft}>
        <WGSLogo />
        <CurrentTimeDisplay className={styles.time} />
        <StatusBtn handleClick={handleRun} isGreen={isRunning} name={'Calc'} />
        <input
          type='file'
          id='importAttachment'
          className={styles.inputfile}
          onChange={handleFile}
          multiple
        />
        <StatusBtn
          handleClick={handleFileLoad}
          isGreen={isFileRunning}
          name={'FILELOAD'}
          tooltip={selectedFile}
        />
      </div>
      {/* 윈도우 버튼들 */}
      <ul className='winBtns'>
        <button className='settingBtn'>
          <IoMdSettings size={'14px'} onClick={openPopup} />
        </button>
        <button type='button' className='winBtn' onClick={handleMinimizeWindow}>
          <VscChromeMinimize />
        </button>
        <button type='button' className='winBtn' onClick={handleMaximizeWindow}>
          <VscChromeRestore />
        </button>
        <button
          id='closeBtn'
          type='button'
          className='winBtn'
          onClick={handleCloseWindow}
        >
          <VscChromeClose />
        </button>
      </ul>
    </div>
  );
}
