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

export default function VibrationChart({
  rawData,
  selectedFile,
  defaultDataCnt,
  onChartPopup,
  type,
  spotData,
  calcedFiles,
}) {
  const chartRef = React.useRef(null);
  const chartData = {
    datasets: rawData,
  };
  const defaultOptions = {
    maintainAspectRatio: false,
    spanGaps: true,
    responsive: true,
    parsing: false,
    normalized: true,
    animation: false,
    interaction: {
      enabled: true,
      mode: 'point',
      axis: 'r',
      includeInvisible: false,
    },
    onClick: (evt, item) => {
      if (type !== 'Statistics') return;
      onChartPopup(evt, item);
    },
    plugins: {
      autocolors: true,
      tooltip: {
        intersect: false, // 툴팁 영역 확장 설정
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: false,
          padding: 10,
        },
        title: {
          display: true,
        },
      },
      annotation: {
        annotations: {},
      },
      decimation: {
        enabled: true,
        samples: 500,
        threshold: 1000,
        algorithm: 'lttb',
      },
      zoom: {
        //zoom 기능
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          minScaleLimit: 0.5,
          wheel: {
            enabled: true,
          },
          drag: {
            modifierKey: 'ctrl',
            enabled: true,
          },
          pinch: {
            enabled: false,
          },
          mode: 'x',
        },
        limits: {
          x: {
            min: 0,
            max: 1,
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 50,
        left: 10,
        right: 10,
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 1,
        title: {
          display: true,
          text: type== 'Statistics' ? 'Time (s)' : 'Frequency (Hz)',
        },
      },
      y: {
        title: {
          display: false,
          text: 'Amplitude',
        },
      },
    },
  };

  // min, max 값 계산
  const calculateXMinAndMax = (rawData) => {
    let xMin, xMax;
    if (
      rawData === undefined ||
      rawData[0] === undefined ||
      rawData[0].data === undefined
    )
      return { xMin: 0, xMax: 1 };
    xMin = rawData[0].data.length === 0 ? 0 : rawData[0].data[0].x;
    xMax =
      rawData[0].data.length === 0 || rawData[0].data.length === 1
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
}
