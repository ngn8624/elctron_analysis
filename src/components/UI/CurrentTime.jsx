import { useEffect, useState } from 'react';
import moment from 'moment';

export default function CurrentTimeDisplay() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);
  const nowTime = moment().format('YYYY/MM/DD HH:mm:ss');
  return <div style={{ userSelect: 'none' ,display: 'inline-block',wordBreak:'break-word', width:'6rem',textAlign:'center'}}>{nowTime}</div>;
}
