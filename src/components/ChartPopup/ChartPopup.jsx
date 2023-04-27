import React from 'react';
import styles from './ChartPopup.module.css';
import { VscChromeClose } from 'react-icons/vsc';
import { Chart } from 'react-chartjs-2';
function ChartPopup({ spotData, closeChartPopup, fileNames }) {
  const chartRef1 = React.useRef(null);
  const chartRef2 = React.useRef(null);
  const chartData = {
    datasets: spotData,
  };
  const options1 = {
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
          text: 'File && Time (s)',
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
  const idx = spotData[0].index;
  return (
    <div className={styles.popup}>
      <div className={styles.popupTitle}>
        <button
          id='closeBtn'
          type='button'
          className='winBtn'
          onClick={closeChartPopup}
        >
          <VscChromeClose onClick={closeChartPopup} />
        </button>
      </div>
      인덱스 : {idx} , 파일명 : {fileNames}
      <div className={styles.chart1}>
        <Chart
          ref={chartRef1}
          type='line'
          options={options1}
          data={chartData}
        />
      </div>
      <div className={styles.chartBottom}>
        <div className={styles.chart2}>
          <Chart
            ref={chartRef2}
            type='line'
            options={options1}
            data={chartData}
          />
        </div>
      </div>
    </div>
  );
}

export default ChartPopup;
