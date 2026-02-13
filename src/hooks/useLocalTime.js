import { useState, useEffect, useCallback } from 'react';
import { TIME_UPDATE_INTERVAL } from '../utils/constants';

export const useLocalTime = (timezone = 'Europe/Berlin', updateInterval = TIME_UPDATE_INTERVAL) => {
  const getTimeWithOffset = useCallback(() => {
    const now = new Date();
    const time = now.toLocaleTimeString('de-DE', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit'
    });
    const offset = -now.toLocaleString('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    }).split('GMT')[1];
    return { time, offset: `UTC${offset}` };
  }, [timezone]);

  const [timeData, setTimeData] = useState(getTimeWithOffset);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(getTimeWithOffset());
    }, updateInterval);
    return () => clearInterval(timer);
  }, [getTimeWithOffset, updateInterval]);

  return timeData;
};
