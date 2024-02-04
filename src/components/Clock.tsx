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

  return (
    <div className="w-full p-6 text-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-lg shadow-neutral-800">
        <div className="text-4xl tracking-widest">{time.toLocaleTimeString().slice(0,5)}</div>
        <div className="text-xs opacity-50 tracking-wider">{time.toDateString()}</div>
    </div>
  );
};

export default Clock;
