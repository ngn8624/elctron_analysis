import styles from './ConfigModal.module.css';
import { MdClose } from 'react-icons/md';
import SaveBtn from './SaveBtn';
import LoadBtn from './LoadBtn';
import Input from '../UI/Input/Input';
import Expandable from '../UI/Expandable/Expandable';
import {
  ENUM_FFT_DBV_RANGE,
  ENUM_FFT_DC_IGNORE,
  ENUM_FFT_SAMPLE_NUM,
  ENUM_FFT_VIEW_MODE,
  ENUM_WINDOWS_INDEX,
  ENUM_STATISTICS_IGNORE,
} from '../../constant/constant';
import ComboBox from '../UI/Combo/ComboBox';

export default function ConfigModalView({
  closePopup,
  settingModel,
  onChangeInput,
  isShowIcon,
  isSavedSuccess,
  modalRef,
  handleSave,
  handleLoad,
}) {
  return (
    <div className={styles.modal} ref={modalRef}>
      {
        <section className={styles.modalSection}>
          <div>
            <header className={styles.modalHeader}>
              Settings
              <div className={styles.toRight} style={{ padding: 0 }}>
                <LoadBtn handleLoad={handleLoad} />
                <SaveBtn
                  handleSave={handleSave}
                  isShowIcon={isShowIcon}
                  isSavedSuccess={isSavedSuccess}
                />
                <MdClose
                  onClick={closePopup}
                  cursor='pointer'
                  style={{ paddingLeft: '5px' }}
                />
              </div>
            </header>
            <main className={styles.configBody}>
              <ConfigBody
                settingModel={settingModel}
                onChangeInput={onChangeInput}
              />
            </main>
          </div>
        </section>
      }
    </div>
  );
}
function ConfigBody({ settingModel, onChangeInput }) {
  return (
    <>
      <FileConfig settingModel={settingModel} />
      <FftConfig settingModel={settingModel} onChangeInput={onChangeInput} />
    </>
  );
}

function FftConfig({ settingModel, onChangeInput }) {
  return (
    <Expandable title={'FFT'}>
      <ComboBox
        title={'Sample Number'}
        options={Object.values(ENUM_FFT_SAMPLE_NUM)}
        name={'fftCnt'}
        onChangeInput={onChangeInput}
        value={settingModel.fftCnt ?? ENUM_FFT_SAMPLE_NUM._4096}
      />
      <ComboBox
        title={'DC Ignore'}
        options={Object.values(ENUM_FFT_DC_IGNORE)}
        name={'dcIgnore'}
        onChangeInput={onChangeInput}
        value={settingModel.dcIgnore ?? ENUM_FFT_DC_IGNORE.FALSE}
      />
      <Input
        type={'number'}
        title={'Sample Interval'}
        name={'sampleInterval'}
        placeholder={settingModel.sampleInterval ?? 1}
        onChangeInput={onChangeInput}
      />
      <ComboBox
        title={'Windows Index'}
        options={Object.values(ENUM_WINDOWS_INDEX)}
        name={'windowsIdx'}
        onChangeInput={onChangeInput}
        value={settingModel.windowsIdx}
      />
      <ComboBox
        title={'View Mode'}
        options={Object.values(ENUM_FFT_VIEW_MODE)}
        name={'viewMode'}
        onChangeInput={onChangeInput}
        value={settingModel.viewMode ?? ENUM_FFT_VIEW_MODE.DBV}
      />
      <ComboBox
        title={'DBV Range'}
        options={Object.values(ENUM_FFT_DBV_RANGE)}
        name={'dbvRange'}
        onChangeInput={onChangeInput}
        value={settingModel.dbvRange}
      />
    </Expandable>
  );
}

function FileConfig({ settingModel }) {
  return (
    <Expandable title={'FILE PATH'}>
      <div className={styles.fileName}>
        <div className={styles.title}>
          {settingModel.paths.length > 0 ? settingModel.paths : '[]'}
        </div>
      </div>
    </Expandable>
  );
}
