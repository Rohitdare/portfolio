'use client';

import { useLiveISTClock } from '@/hooks/useLiveISTClock';

export default function TimeBeacon() {
  const timeString = useLiveISTClock();

  return (
    <div className="time-beacon">
      <span className="beacon-dot" />
      <span id="ist-clock">{timeString}</span>
    </div>
  );
}
