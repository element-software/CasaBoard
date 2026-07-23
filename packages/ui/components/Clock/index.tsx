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
    <div className="w-full p-4 pt-0 text-center text-theme-text">
        <div className="text-6xl tracking-widest">{hours}:{minutes}</div>
        <div className="text-md text-theme-text-secondary tracking-wider">{time.toDateString()}</div>
    </div>
  );
};

export default Clock;