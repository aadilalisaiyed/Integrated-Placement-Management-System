// frontend/src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session from localStorage on first load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role  = localStorage.getItem('role')
    const name  = localStorage.getItem('name')
    if (token && role) {
      setUser({ token, role, name })
    }
    setLoading(false)
  }, [])

  const login = ({ token, role, name }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('name', name)
    setUser({ token, role, name })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hook — import this instead of useContext(AuthContext) everywhere
export const useAuth = () => useContext(AuthContext)