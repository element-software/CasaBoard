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

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div className="w-full pt-1 pb-2 text-left text-theme-text">
      <div className="text-5xl font-semibold tracking-tight tabular-nums">
        {hours}:{minutes}
      </div>
      <div className="text-sm text-theme-text-secondary mt-1">
        {time.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
};

export default Clock;