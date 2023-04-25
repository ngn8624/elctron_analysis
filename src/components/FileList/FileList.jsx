import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './FileList.module.css';
import { daqGetCycleCount } from '../../controller/daq';

export default function FileList({ selectedFile, setSelectedFile }) {
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

  // check된 파일들의 cycleCount를 가져온다.
  const getCycleCountStart = async () => {
    // selectedFile중에서 check된것만 filter하는 code있어야함
    const checkedFile = selectedFile.filter((file) => file.checked === true);
    for (let i = 0; i < checkedFile.length; i++) {
      let ret = await daqGetCycleCount(checkedFile[i].path);
      // ret을 이용해서 selectedFile에 cycleCount를 넣어줘야함
      setSelectedFile((prev) => {
        return prev.map((item) => {
          if (item.id === checkedFile[i].id) {
            item.cycle = ret;
          }
          return item;
        });
      });
    }
  };

  return (
    <div>
      <div className={styles.fileWindowTitle}>
        <ul className={styles.fileWindowTitleUl}>
          <li className={styles.fileWindowTitleLi}>
            <input
              type={'checkbox'}
              name=''
              id=''
              checked={checkList}
              onChange={(e) => onCheckedAll(e.target.checked)}
            />
          </li>
          <li className={styles.fileWindowTitleLi}>NUM</li>
          <li className={styles.fileWindowTitleLi}>Files</li>
          <li className={styles.fileWindowTitleLi}>
            <button
              className={styles.fileWindowTitleButton}
              onClick={onDeleteFile}
            >
              Delete
            </button>
          </li>
          <li className={styles.fileWindowTitleLi}>
            <button
              className={styles.fileWindowTitleButton}
              onClick={getCycleCountStart}
            >
              getCycle
            </button>
          </li>
        </ul>
      </div>
      <div className={styles.fileWindowContents}>
        <ul className={styles.fileWindowContentsUl}>
          {FileCardMap(selectedFile, checkHandler)}
        </ul>
      </div>
    </div>
  );
}

const FileCardMap = (selectedFiles, checkHandler) => {
  return selectedFiles.map((file, index) => (
    <li key={file.id} className={styles.fileWindowContentsLi}>
      <input
        className={styles.fileWindowContentsCheckbox}
        type={'checkbox'}
        id={file.id}
        checked={file.checked}
        onChange={(e) => checkHandler(e)}
      />
      <span className={styles.fileWindowContentsIndex}>{index + 1}</span>
      <span className={styles.fileWindowContentsName}>{file.name}</span>
      <span className={styles.fileWindowContentsName}>{file.cycle}</span>
    </li>
  ));
};