import React, { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import axios from "axios";

import  {toast} from 'react-toastify'
import { useNavigate } from "react-router";
import { useUser } from "../ContextApi";

const Login = () => {
  const navigate=useNavigate()
  const {user,setUser}=useUser()
  
  const [text, setText] = useState("login");
  const [Password_show, setPassword_show] = useState(false);
  const [name, setName] = useState("Happy");
  const [email, setEmail] = useState("hs0386118@gmail.com");
  const [password, setPasssword] = useState("12345678");
  const FormSubmit = async (e) => {
  e.preventDefault();

  axios.defaults.withCredentials = true
  ;

  const sends = {
    name,
    email,
    password,
  };

  if (text === "login") {
    try {
      const { data } = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });
      

      if (data.success) {
        toast.success(data.message || "Login successfully");
        setUser(!user)
        navigate('/otp')
        
      } else {
        toast.error(data.message || "Failed to login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  } else {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/register",
        sends
      );
     

      if (data.success) {
        toast.success(data.message || "Registered successfully");
       setUser(!user)
        navigate('/otp')

       
      
      } else {
        toast.error(data.message || "Failed to register");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  }
};


  return (
    <div className="max-w-[500px] m-auto relative top-20 p-10 rounded-2xl bg-pink-100 shadow">
      <div className=" text-center">
    {text === "login" ? <h2>Login</h2> : <h2>Signup</h2>}
 
        <form onSubmit={FormSubmit}>
          {text === "signup" && (
            <div className="m-4 rounded-full relative">
              <FaUserTie className="absolute top-4 left-2 text-pink-200 " />
              <input
                type="text"
                className="w-full rounded-full p-3 pl-8"
                placeholder="name "
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}

          <div className="m-4 rounded-full relative">
            <MdOutlineEmail className="absolute top-4 left-2 text-pink-200 " />
            <input
              type="email"
              className="w-full rounded-full p-3 pl-8  "
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="m-4 rounded-full relative">
            <FaLock
              className="absolute top-4  text-pink-200 left-2 cursor-pointer"
              onClick={() => setPassword_show(!Password_show)}
            />
            <input
              type={Password_show ? "text" : "password"}
              className="w-full rounded-full p-3 pl-8"
              placeholder="password "
              onChange={(e) => setPasssword(e.target.value)}
              value={password}
            />
          </div>
          <button className="mt-4 w-full btn p-2 rounded-full capitalize tracking-wider bg-black text-white">
            {text}
          </button>
        </form>
        <div className="mt-8">
          {text === "login" ? (
            <p>
              create an account{" "}
              <span
                className="underline text-blue-900 cursor-pointer"
                onClick={() => {
                  setText("signup");
                }}
              >
                signup
              </span>{" "}
            </p>
          ) : (
            <p>
              if already have an Account{" "}
              <span
                className="underline text-blue-900 cursor-pointer"
                onClick={() => {
                  setText("login");
                }}
              >
                login
              </span>{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
