import { v4 as uuidv4 } from 'uuid';
export const enTitle = 'AllChart';
export const ENUM_FFT_DC_IGNORE = { TRUE: 'TRUE', FALSE: 'FALSE' };
export const ENUM_STATISTICS_IGNORE = { TRUE: 'TRUE', FALSE: 'FALSE' };
export const ENUM_FFT_SAMPLE_NUM = {
  _1024: 1024,
  _2048: 2048,
  _4096: 4096,
  _8192: 8192,
  _16384: 16384,
};
export const ENUM_WINDOWS_INDEX = {
  RECTANGLE: 'rectangle',
  HANN: 'Hann',
  HAMMING: 'Hamming',
  BLACKMAN: 'Blackman',
  FLAT_TOP: 'Flat_top',
};
export const ENUM_FFT_VIEW_MODE = { LINEAR: 'Linear', DBV: 'DBV' };
export const ENUM_FFT_DBV_RANGE = { _100: 100, _200: 200, _300: 300 };

export const generateColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
};

//나중에 json으로부터 불러올 예정
export const chartDatas = [
  {
    id: uuidv4(),
    hidden: false,
    label: 'X',
    borderColor: 'rgba(255, 99, 132, 1)',
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    fill: false,
    borderWidth: 0.7,
    radius: 0,
    pointRaduis: 0,
    data: [],
  },
  {
    id: uuidv4(),
    hidden: false,
    label: 'Y',
    borderColor: 'rgba(54, 162, 235, 1)',
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    fill: false,
    borderWidth: 0.7,
    radius: 0,
    pointRaduis: 0,
    data: [],
  },
  {
    id: uuidv4(),
    hidden: false,
    label: 'Z',
    borderColor: 'rgba(255, 206, 86, 1)',
    backgroundColor: 'rgba(255, 206, 86, 0.2)',
    fill: false,
    borderWidth: 0.7,
    radius: 0,
    pointRaduis: 0,
    data: [],
  },
];

export const defaultOptions = {
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
    autocolors: true,
    legend: {
      display: false,
      position: 'top',
      labels: {
        usePointStyle: false,
        padding: 10,
      },
      title: {
        display: false,
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
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  scales: {
    x: {
      type: 'linear',
      min: 0,
      max: 1,
      title: {
        display: false,
        text: 'Time (s)',
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
