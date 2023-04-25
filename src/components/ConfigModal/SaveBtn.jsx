import styles from './ConfigModal.module.css';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

function BtnIcon({ isShowIcon, isSavedSuccess }) {
  return (
    isShowIcon && (
      <div>
        {isSavedSuccess ? (
          <BsCheckCircleFill style={{ paddingLeft: '5px' }} />
        ) : (
          <BsXCircleFill style={{ paddingLeft: '5px', color: 'red' }} />
        )}
      </div>
    )
  );
}

export default function SaveBtn({ handleSave, isShowIcon, isSavedSuccess }) {
  return (
    <button
      id='basicRoundedBtn'
      className={styles.smallBtn}
      onClick={handleSave}
    >
      Save
      <BtnIcon isShowIcon={isShowIcon} isSavedSuccess={isSavedSuccess} />
    </button>
  );
}
