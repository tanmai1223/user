import React from 'react'
import Home from './Pages/Home'
import {Routes,Route} from "react-router"
import Main from './Pages/Main'
import './Style/index.css'
import Final from './Pages/Final'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/next' element={<Main/>}/>
        <Route path='/final' element={<Final/>}/>
      </Routes>
    </div>
  )
}

export default App
