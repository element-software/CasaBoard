"use client";
import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeLabel = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateLabel = time.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full pt-1 pb-2 text-left text-theme-text">
      <div className="text-5xl font-bold tracking-tight tabular-nums leading-none">
        {timeLabel}
      </div>
      <div className="text-base text-theme-text-secondary mt-1.5 font-medium">
        {dateLabel}
      </div>
    </div>
  );
};

export default Clock;
