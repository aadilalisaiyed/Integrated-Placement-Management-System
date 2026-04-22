// frontend/src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()

  // Still reading localStorage — don't flash login screen
  if (loading) return null

  // Not logged in at all
  if (!user) return <Navigate to="/login" replace />

  // Logged in but wrong role (e.g. student hitting /dashboard)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute