// src/context/UserContext.js
import axios from "axios";

import { createContext, useContext,  useEffect,  useState } from "react";

import { toast } from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  
  const [user, setUser] = useState(true);
  const [Data, setData] = useState();
  useEffect(()=>{
    getdata()
  })
  const getdata=async()=>{

    try {
      const { data } = await axios.get(
        ' http://localhost:4000/api/getdata' 
      )
 setData(data)
      
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Server error')
    }
    }
  return (
    <UserContext.Provider value={{ user, setUser,getdata,Data, setData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
