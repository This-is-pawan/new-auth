import React from 'react'
import {Routes,Route} from 'react-router'
import './index.css'
import Home from './components/Home'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login'
import OTP from './components/OTP'
// import Testing from './components/Testing'
import Dashboard from './components/Dashboard'
const App = () => {
  return (
    <div>
      <ToastContainer  position='top-center' autoClose={2000}/>
      <Navbar />
      
      <Routes>
<Route path='/' element={<Home/>}/>
<Route path='/login' element={<Login/>}/>
<Route path='/otp' element={<OTP/>}/>
<Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
  

    </div>
  )
}

export default App
