import React from 'react' 
import './App.css'
import Navbar from './Pages/Auth/navigation'
import { Outlet } from "react-router-dom";

import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <>
    <ToastContainer />
    <Navbar />
    <Outlet />
    </>
  )
}

export default App
