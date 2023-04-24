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

export default function VibrationChart({ rawData, selectedFile }) {
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
    plugins: {
      autocolors: true,
      tooltip: {
        intersect: false, // 툴팁 영역 확장 설정
        callbacks: {
          title: (items,data) => {
            // 첫 번째 툴팁 아이템의 레이블만 사용하여 툴팁 제목으로 설정
            console.log("items",data);
            return items[0].dataset.label;
          },
          label: (item, data) => {
            // 툴팁 값의 출력 형식 변경
            console.log("item",item);
            // const dataset = dataset.data[item.datasetIndex]; // 수정된 부분
            const valueX = item.dataset.data[item.datasetIndex].x;
            const valueY = item.dataset.data[item.datasetIndex].y.toFixed(2);
            return `X : ${valueX} Y : ${valueY}`;
          }
        }
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
        ticks: {
          callback: function (value, index, values) {
            // value 중간 없애기
            // console.log("values", value);
            const intValue = Math.floor(value);
            const fileItem= selectedFile.filter((file) => file.checked === true);
            const itemY = 5;
            const fileItemIndex = Math.floor(index / itemY);
            if (fileItemIndex < fileItem.length) {
              if (value % 1 === 0) { // x 값이 정수
                return fileItem[fileItemIndex].name + '_' + intValue;
              }
              // return fileItem[fileItemIndex].name + '_' + intValue;z
            }
          },
        },
        grid: {
          display: true,
          drawBorder: true,
          drawTicks: true,
          ticksLength: 5,
        },
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
  // const angle = -45;
  // const length = Math.sqrt(label.length) * 6;
  // const radian = (angle * Math.PI) / 180;
  // const dx = length * Math.cos(radian);
  // const dy = length * Math.sin(radian);
  // xAxes: [{
  //   ticks: {
  //     callback: function(value, index, values) {
  //       // x축 레이블 값 변경
  //       console.log("value",value);
  //       console.log("index",index);
  //       console.log("values",values);
  //       return 'file ' + value;
  //     }
  //   }
  // }],

  // afterTickToLabelConversion: function (data) {
  //   var xLabels = data.ticks;
  //   console.log("xLabels", xLabels);
  //   const newtick = xLabels.map((tick, index) => {
  //     return {tick : "file" + index};
  //   });
  //   data.ticks = newtick;
  // },

  // // min, max 값 계산
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
      <Chart
        ref={chartRef}
        type='line'
        options={options}
        data={chartData}
      />
    </Container>
  );
}
