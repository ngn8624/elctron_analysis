import React, { memo, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import styles from './VibrationChart.module.css';
import Container from '../Container/Container';
import { enTitle, defaultOptions } from '../../../constant/constant';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin
);

export default memo(function VibrationChart({ title, rawData, anno }) {
  const chartRef = React.useRef(null);
  const chartData = {
    type: 'Line',
    datasets: title === enTitle ? rawData : [rawData],
  };
  // min, max 값 계산
  const calculateXMinAndMax = (title, enTitle, rawData) => {
    let xMin, xMax;

    if (title === enTitle) {
      xMin = rawData[0].data.length === 0 ? 0 : rawData[0].data[0].x;
      xMax =
        rawData[0].data.length === 0
          ? 1
          : rawData[0].data[rawData[0].data.length - 1].x;
    } else {
      xMin = rawData.data.length === 0 ? 0 : rawData.data[0].x;
      xMax =
        rawData.data.length === 0 ? 1 : rawData.data[rawData.data.length - 1].x;
    }

    return { xMin, xMax };
  };

  // annotation 계산
  const createAnnotationObject = (timeSlot, borderColor) => ({
    display: true,
    type: 'line',
    ScaleID: 'x',
    xMin: timeSlot,
    xMax: timeSlot,
    borderColor: borderColor,
    borderWidth: 5,
    textAlign: 'start',
    label: {
      position: 'right',
      enabled: true,
      color: 'orange',
      font: {
        weight: 'bold',
      },
    },
  });

  // chart option 적용
  const options = useMemo(() => {
    const { xMin, xMax } = calculateXMinAndMax(title, enTitle, rawData);

    const updatedAnnotations = {};
    if (
      (title === enTitle && rawData[0].data.length !== 0) ||
      (title !== enTitle && rawData.data.length !== 0)
    ) {
      anno
        .filter(
          (a, i) =>
            (title !== enTitle && a.timeSlot >= rawData.data[0].x) ||
            (title === enTitle && a.timeSlot >= rawData[0].data[0].x)
        )
        .forEach((a, i) => {
          const propertyName = `line${i}`;
          updatedAnnotations[propertyName] = createAnnotationObject(
            a.timeSlot,
            a.borderColor
          );
        });
    }

    return {
      ...defaultOptions,
      scales: {
        ...defaultOptions.scales,
        x: {
          ...defaultOptions.scales.x,
          min: xMin,
          max: xMax,
        },
      },
      plugins: {
        ...defaultOptions.plugins,
        zoom: {
          ...defaultOptions.plugins.zoom,
          limits: {
            ...defaultOptions.plugins.zoom.limits,
            x: {
              ...defaultOptions.plugins.zoom.limits.x,
              min: xMin,
              max: xMax,
            },
          },
        },
        annotation: {
          ...defaultOptions.plugins.annotation,
          annotations: updatedAnnotations,
        },
      },
    };
  }, [title, rawData, anno]);

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <Container>
      <button
        id='basicRoundedBtn'
        className={styles.buttonReset}
        onClick={handleResetZoom}
      >
        Reset
      </button>
      <Line ref={chartRef} type='Line' options={options} data={chartData} />
    </Container>
  );
});
