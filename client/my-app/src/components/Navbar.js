// import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "../ContextApi";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { data } = await axios.post("http://localhost:4000/api/logout");
      if (data.success) {
toast.success('Logout success')
        navigate("/");
        setUser(!user);
      } else {
        toast.error(data.message || "failed to :Logout ");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || " failed Logout ");
    }finally{
setUser(!user)
    }
  };

  return (
    <div className="w-full h-11 bg-yellow-100 fixed top-0 right-0 left-0">
      <nav className="max-w-f-98 flex  justify-around items-center leading-[3rem]">
        <h3 className="tracking-wider font-bold ">
          <Link to="/">Home</Link>
        </h3>
        {user ? (
          <h3 className="tracking-wider font-bold ">
            <Link to="/login">Login/signup</Link>
          </h3>
        ) : (
          <h3 className="tracking-wider font-bold ">
            <Link to="/login" onClick={logout}>
              Logout
            </Link>
          </h3>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
