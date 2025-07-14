import React, { useRef, useState } from 'react';

const Testing = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
     // allow only numbers
     // console.log(value);
     
    if (!value) return;
    const newOtp = [...otp];
  
    newOtp[index] = value;
    
    setOtp(newOtp);


    // Move focus to next input
    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);


      // Move to previous input
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 6);
    const pasteArray = pasteData.split('');
    const newOtp = [...otp];

    pasteArray.forEach((char, index) => {
      if (index < 6 && /^[0-9]$/.test(char)) {
        newOtp[index] = char;
        inputsRef.current[index].value = char;
      }
    });
  
    setOtp(newOtp);

    // Focus next empty input
    const nextIndex = pasteArray.length < 6 ? pasteArray.length : 5;
    inputsRef.current[nextIndex].focus();
  };

  return (
   <div className='shadow w-full h-[200px] bg-pink-200 '>

    <form className="flex gap-2 justify-center relative top-20 " onPaste={handlePaste}>
      {otp.map((_, index) => (
       <input
       key={index}
       type="text"
       maxLength={1}
       className="w-10 h-10 text-center border rounded"
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputsRef.current[index] = el)}
        />
      ))}
    </form>
          </div>
  );
};

export default Testing;
