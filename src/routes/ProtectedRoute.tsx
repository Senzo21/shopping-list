import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import type { RootState } from '../store'

export default function ProtectedRoute({ children }: { children: JSX.Element }){
  const auth = useSelector((s: RootState) => s.auth)
  const location = useLocation()
  if (!auth.user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
