import React from 'react'
import './App.css'
import Router from './router/Router'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Router/>
    </div>
  )
}

export default App