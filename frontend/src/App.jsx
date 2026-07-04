// frontend/src/App.jsx — replace entire file

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import Login        from './pages/Login'
import Signup       from './pages/Signup'
import Dashboard    from './pages/Dashboard'
import Companies    from './pages/Companies'
import Applications from './pages/Applications'
import Students     from './pages/Students'
import Apply        from './pages/Apply'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Admin + Coordinator */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['admin', 'coordinator']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/companies" element={
          <ProtectedRoute roles={['admin', 'coordinator']}>
            <Companies />
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute roles={['admin', 'coordinator']}>
            <Applications />
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute roles={['admin', 'coordinator']}>
            <Students />
          </ProtectedRoute>
        } />

        {/* Student */}
        <Route path="/apply" element={
          <ProtectedRoute roles={['student']}>
            <Apply />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App