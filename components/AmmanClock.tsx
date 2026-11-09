"use client";
import { useEffect, useState } from "react";

const fmt = () =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Amman" }).format(new Date());

/**
 * The current time in Amman (Asia/Amman), refreshed once a minute on the minute.
 * The server renders a fixed-width placeholder and the browser fills in the real time after hydration,
 * so the two never disagree and nothing shifts.
 */
export function AmmanClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    const tick = () => setTime(fmt());
    tick();
    const toNextMinute = 60_000 - (Date.now() % 60_000);
    const first = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, toNextMinute);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <span className="inline-block min-w-[4.6rem] tabular-nums" aria-label={time ? `Current time in Amman: ${time}` : undefined}>
      {time ?? "––:––"}
    </span>
  );
}
