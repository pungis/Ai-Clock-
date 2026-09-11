import { useEffect, useState } from "react";

export type ElapsedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getElapsedTime(since: string): ElapsedTime {
  const elapsedMs = Math.max(0, Date.now() - new Date(since).getTime());
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function useElapsedTime(since?: string): ElapsedTime {
  const [elapsedTime, setElapsedTime] = useState(() =>
    since ? getElapsedTime(since) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
  );

  useEffect(() => {
    if (!since) {
      setElapsedTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setElapsedTime(getElapsedTime(since));

    const intervalId = window.setInterval(() => {
      setElapsedTime(getElapsedTime(since));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [since]);

  return elapsedTime;
}
