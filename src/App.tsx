import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Share from './pages/Share'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App(){
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/login') || location.pathname.startsWith('/register')
  return (
    <div>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/share/:listId" element={<Share />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
