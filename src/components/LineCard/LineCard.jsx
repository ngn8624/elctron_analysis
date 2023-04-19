import { useCallback, useState } from 'react';
import LineCardView from './LineCardView';

export default function LineCard({
  title,
  rawData,
  setRawData,
  selectedFile,
  setFftData,
  isFileRunning,
  settingModel,
}) {
  const handleLegendVisible = useCallback((id) => {
    setRawData((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          item.hidden = !item.hidden;
        }
        return item;
      });
    });
  }, []);
  return (
    <LineCardView
      title={title}
      rawData={rawData}
      handleLegendVisible={handleLegendVisible}
      setRawData={setRawData}
      selectedFile={selectedFile}
      setFftData={setFftData}
      isFileRunning={isFileRunning}
      settingModel={settingModel}
    />
  );
}
