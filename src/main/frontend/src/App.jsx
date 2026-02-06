import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BasicLayout from './components/layout/BasicLayout'
import ManagerLayout from './components/layout/ManagerLayout'
import Join from './pages/member/Join'
import './reset.css'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<BasicLayout />} />
        <Route path='/manager' element={<ManagerLayout />} />
        <Route path='/join' element={<Join />} />
      </Routes>
    </>
  )
}

export default App
