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
    <div className="w-full p-4 text-center bg-stone-500/80 text-white rounded-lg">
        <div className="text-8xl tracking-widest">{time.toLocaleTimeString().slice(0,5)}</div>
        <div className="text-lg tracking-wider">{time.toDateString()}</div>
    </div>
  );
};

export default Clock;
