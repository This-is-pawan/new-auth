import React, { useEffect, useRef } from 'react';

const Testing = () => {
  const timerRef = useRef(null);

  useEffect(() => {
    const targetTime = new Date("2025-07-15T04:19:13.448Z").getTime(); // UTC time
    const getRemainingSeconds = () => Math.max(0, Math.floor((targetTime - new Date().getTime()) / 1000));

    let duration = getRemainingSeconds();

    const intervalId = setInterval(() => {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      if (timerRef.current) {
        timerRef.current.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }

      if (duration === 0) {
        clearInterval(intervalId);
        if (timerRef.current) {
          timerRef.current.textContent = "OTP expired";
        }
      }

      duration--;
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='relative top-[20rem]'>
      <p id="otp-timer" className='text-3xl' ref={timerRef}></p>
    </div>
  );
};

export default Testing;
