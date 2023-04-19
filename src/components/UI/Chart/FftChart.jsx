import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import styles from './FftChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const options = {
  maintainAspectRatio: false,
  spanGaps: true,
  responsive: true,
  parsing: false,
  normalized: true,
  animation: false,
  interaction: {
    enabled: true, 
    mode: 'nearest',
    axis: 'r',
    includeInvisible: true,
  },
  plugins: {
    decimation: {
      enabled: true,
      samples: 1000,
      threshold: 900,
      algorithm: "lttb",
    },
    legend: {
      display: false,
      position: 'top',
      labels: {
        usePointStyle: false,
      },
      title: {
        display: false,
      },
    },
    zoom: {
      //zoom 기능
      pan: {
        enabled: true,
        mode: "x",
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
        mode: "x",
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
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  scales: {
    x: {
      type: "linear",
      min: 0,
      max: 1,
      title: {
        display: false,
        text: "Frequency (Hz)",
      },
    },
    y: {
      title: {
        display: false,
        text: "dbv",
      },
    },
  },
};

export default function FftChart({ title, rawData }) {
  const [fftChartData, setFftChartData] = useState(() => {
    return {
      type: "Line",
      datasets: [],
    };
  });
  const chartRef = React.useRef(null);
  const [realOption, setRealOption] = useState(options);
  useEffect(() => {
    if (rawData.length === 0) return;
    const newChartData = {
      type: "Line",
      datasets: [
        {
          label: rawData.label,
          data: rawData.data,
          borderColor: rawData.borderColor,
          backgroundColor: rawData.backgroundColor,
          fill: rawData.fill,
          borderWidth: rawData.borderWidth,
          radius: rawData.radius,
        },
      ],
    };
    setFftChartData(newChartData);
    if (rawData.data.length === 0) return;
    setRealOption((prevOptions) => ({
      ...prevOptions,
      scales: {
        ...prevOptions.scales,
        x: {
          ...prevOptions.scales.x,
          min: rawData.data[0].x,
          max: rawData.data[rawData.data.length - 1].x,
        },
      },
    }));
    setRealOption((prevOptions) => ({
      ...prevOptions,
      plugins: {
        ...prevOptions.plugins,
        zoom: {
          ...prevOptions.plugins.zoom,
          limits: {
            ...prevOptions.plugins.zoom.limits,
            x: {
              ...prevOptions.plugins.zoom.limits.x,
              min: rawData.data[0].x,
              max: rawData.data[rawData.data.length - 1].x,
            },
          },
        },
      },
    }));
  }, [rawData]);

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className={styles.box}>
      <button className={styles.buttonReset} onClick={handleResetZoom}>
        Reset
      </button>
      <Line ref={chartRef} type="Line" options={realOption} data={fftChartData} />
    </div>
  );
}
