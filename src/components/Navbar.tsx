import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import type { RootState } from '../store'

export default function Navbar(){
  const { user } = useSelector((s: RootState)=>s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="container row" role="navigation" aria-label="Main">
        <div className="row" style={{gap:16}}>
          <NavLink to="/" className={({isActive})=> isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/profile" className={({isActive})=> isActive ? 'active' : ''}>Profile</NavLink>
        </div>
        <div style={{marginLeft:'auto'}} className="row">
          <span className="muted" aria-live="polite">Hi, {user?.name}</span>
          <button className="btn" onClick={()=>{dispatch(logout() as any); navigate('/login')}}>Logout</button>
        </div>
      </div>
    </nav>
  )
}
