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
    <div className="w-full p-4 text-center">
        <div className="text-6xl">{time.toLocaleTimeString()}</div>
        <div className="text-lg">{time.toDateString()}</div>
    </div>
  );
};

export default Clock;
