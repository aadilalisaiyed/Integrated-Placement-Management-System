// frontend/src/components/ProtectedRoute.jsx — replace entire file

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    // Student hitting admin route → send to apply
    if (user.role === 'student') return <Navigate to="/apply" replace />
    // Admin/coordinator hitting student route → send to dashboard
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute