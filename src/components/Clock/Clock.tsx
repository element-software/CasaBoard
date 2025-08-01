"use client";
import { useEffect, useState } from "react";

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full p-4 pt-0 text-center text-theme-text">
        <div className="text-6xl tracking-widest">{time.toLocaleTimeString().slice(0,5)}</div>
        <div className="text-md opacity-50 tracking-wider">{time.toDateString()}</div>
    </div>
  );
};
