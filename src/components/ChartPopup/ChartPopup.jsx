import React from 'react';
import styles from './ChartPopup.module.css';
import { Chart } from 'react-chartjs-2';
function ChartPopup(data1, data2) {
  const chartRef = React.useRef(null);
  const options = {
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
  };
  const chartData1 = {
    datasets: data1,
  };
  return (
    <div className={styles.chartPopup}>
      <div>
        {' '}
        {/* <Chart ref={chartRef} type='line' options={options} data={chartData1} /> */}
      </div>
      차트1 차트2 차트3{' '}
    </div>
  );
}

export default ChartPopup;
