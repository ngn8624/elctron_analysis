import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './FileList.module.css';
import { daqGetCycleCount } from '../../controller/daq';
import { TiArrowMaximise, TiArrowMinimise, TiTrash } from 'react-icons/ti';

export default function FileList({
  selectedFile,
  setSelectedFile,
  isSmallHoverCard,
  onSizing,
}) {
  // 초기에 체크박스 전체선택이 되어있는지 확인하는 함수
  const initCheckList = (selectedFile) => {
    return selectedFile.findIndex((file) => file.checked === false) == -1
      ? true
      : false;
  };

  const [checkList, setCheckList] = useState(() => {
    return initCheckList(selectedFile);
  });

  // 파일 window 체크된 파일 지우기!
  const onDeleteFile = (e) => {
    setSelectedFile(selectedFile.filter((file) => file.checked === false));
  };

  // 파일 window 개별 checkbox에 속성값 변경
  const checkHandler = (e) => {
    const { id, checked } = e.target;
    setSelectedFile((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          item.checked = checked;
        }
        return item;
      });
    });
  };

  // File 체크박스 전체선택
  const onCheckedAll = (e) => {
    setCheckList(e);
    // 개별 checkbox 값 변경
    setSelectedFile((prev) => {
      return prev.map((item) => {
        item.checked = e;
        return item;
      });
    });
  };

  // 개별 checkbox 값이 바뀌면 전체 checkbox값도 바꾼다.
  useEffect(() => {
    if (selectedFile.filter((file) => file.checked === false).length === 0) {
      setCheckList(true);
    } else if (
      selectedFile.filter((file) => file.checked === true).length === 0
    ) {
      setCheckList(false);
    } else {
      setCheckList(false);
    }
  }, [selectedFile]);

  return (
    <div>
      {isSmallHoverCard ? (
        <ul className={styles.fileWindowTitleUlSmall}>
          <li>
            <button
              className={isSmallHoverCard ? styles.maxBtn2 : styles.maxBtn}
              onClick={onSizing}
            >
              {isSmallHoverCard ? (
                <TiArrowMaximise size={'14px'} />
              ) : (
                <TiArrowMinimise size={'14px'} />
              )}{' '}
            </button>
          </li>
        </ul>
      ) : (
        <div className={styles.fileWindowTitle}>
          <ul className={styles.fileWindowTitleUl}>
            <li>
              <input
                type={'checkbox'}
                name=''
                id=''
                checked={checkList}
                onChange={(e) => onCheckedAll(e.target.checked)}
              />
            </li>
            <li>NUM</li>
            <li>FILE </li>
            <li>
              <button
                className={styles.fileWindowTitleButton}
                onClick={onDeleteFile}
              >
                <TiTrash size={'14px'} />
              </button>
            </li>
            <li>
              <button
                className={isSmallHoverCard ? styles.maxBtn2 : styles.maxBtn}
                onClick={onSizing}
              >
                {isSmallHoverCard ? (
                  <TiArrowMaximise size={'14px'} />
                ) : (
                  <TiArrowMinimise size={'14px'} />
                )}{' '}
              </button>
            </li>
          </ul>
        </div>
      )}
      <ul
        className={
          isSmallHoverCard
            ? styles.fileWindowContentsUlSmall
            : styles.fileWindowContentsUl
        }
      >
        {FileCardMap(selectedFile, checkHandler, isSmallHoverCard)}
      </ul>
    </div>
  );
}

const FileCardMap = (selectedFiles, checkHandler, isSmallHoverCard) => {
  return selectedFiles.map((file, index) => (
    <li key={file.id}>
      <input
        className={isSmallHoverCard ? styles.noDisplay : styles.fileFirst}
        type={'checkbox'}
        id={file.id}
        checked={file.checked}
        onChange={(e) => checkHandler(e)}
      />
      <span className={isSmallHoverCard ? styles.noDisplay : styles.fileSecond}>
        {index + 1}
      </span>
      <span className={isSmallHoverCard ? styles.smallName : styles.fileThird}>
        {file.name}
      </span>
      <span></span>
    </li>
  ));
};
