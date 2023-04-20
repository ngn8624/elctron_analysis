import React, { useMemo } from 'react';
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
import { Chart } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import styles from './VibrationChart.module.css';
import Container from '../Container/Container';
import { defaultOptions } from '../../../constant/constant';

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

export default function VibrationChart({ rawData }) {
  const chartRef = React.useRef(null);
  const chartData = {
    type: 'Line',
    datasets: rawData,
  };

  // min, max 값 계산
  const calculateXMinAndMax = (rawData) => {
    let xMin, xMax;
    if (rawData === undefined || rawData[0] === undefined ||rawData[0].data === undefined) return { xMin: 0, xMax: 1 };
    xMin = rawData[0].data.length === 0 ? 0 : rawData[0].data[0].x;
    xMax =
      rawData[0].data.length === 0
        ? 1
        : rawData[0].data[rawData[0].data.length - 1].x;

    return { xMin, xMax };
  };

  // chart option 적용
  const options = useMemo(() => {
    const { xMin, xMax } = calculateXMinAndMax(rawData);
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
      },
    };
  }, [rawData]);

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
      <Chart ref={chartRef} type='line' options={options} data={chartData} />
    </Container>
  );
};
