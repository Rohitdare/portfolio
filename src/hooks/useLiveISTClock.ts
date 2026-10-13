'use client';

import { useState, useEffect } from 'react';

const istFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

export function useLiveISTClock() {
  const [timeString, setTimeString] = useState<string>('IST --:-- --');

  useEffect(() => {
    const updateTime = () => {
      setTimeString(`IST ${istFormatter.format(new Date())}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeString;
}
