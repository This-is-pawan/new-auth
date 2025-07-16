import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../ContextApi";

const OTP = () => {
  const navigate = useNavigate();
  const { getdata, Data } = useUser();

  const userReference = useRef(null);

  const expireTime = Data?.user;
  const [timerText, setTimerText] = useState("");

  useEffect(() => {
    if (!expireTime) {
      setTimerText("Invalid OTP time");
      return;
    }

    const targetTime = new Date(expireTime).getTime();

    if (isNaN(targetTime)) {
      setTimerText("Invalid OTP time");
      return;
    }

    const updateTimer = () => {
      const remainingSeconds = Math.max(
        0,
        Math.floor((targetTime - Date.now()) / 1000)
      );
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      if (remainingSeconds === 0) {
        clearInterval(intervalId);
        setTimerText("OTP expired");
      } else {
        setTimerText(
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`
        );
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [expireTime]);

  const [otp, setOtp] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
  });

  const handleChange = (e, field) => {
    setOtp((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    const allFilled = Object.values(otp).every((val) => val !== "");
    console.log(allFilled);
    
    if (allFilled) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleSubmit = async () => {
    const finalOtp = Object.values(otp).join("");
    // console.log(finalOtp);
    
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/verifyuser",
        { otp: finalOtp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        toast.success(data.message || "Verified successfully");
        getdata();
        navigate("/");
      } else {
        toast.error(data.message || "Not verified");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="w-full max-w-[400px] m-auto relative top-20">
      <div className="shadow bg-pink-100 text-center p-20 rounded-full">
        <h1 className="text-2xl font-bold">Verify User</h1>
        <form className="flex justify-center">
          {["one", "two", "three", "four", "five", "six"].map((key, index) => (
            <input
              key={index}
              maxLength={1}
              type="text"
              className="m-2 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 text-center to-pink-400"
              onChange={(e) => handleChange(e, key)}
              value={otp[key]}
            />
          ))}
        </form>
        <div className="timer">
          <p className="otp-expire" ref={userReference}>
            {timerText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;
