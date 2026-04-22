// frontend/src/pages/Login.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Login = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await api.post('/auth/login', form)

      // data = { token, role, name }
      login({ token: data.token, role: data.role, name: data.name })

      // Route by role
      if (data.role === 'student') {
        navigate('/apply')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">

      {/* ── Decorative background blobs ───────────────────── */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
      </div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/2 pointer-events-none">
        <div className="absolute bottom-0 -left-12 w-80 h-80 bg-tertiary-container/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Login Card ────────────────────────────────────── */}
      <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl shadow-card p-10 flex flex-col gap-8">

        {/* Branding */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center flex-shrink-0">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
            </div>
            <h1 className="text-on-surface font-bold text-2xl tracking-tight">
              Placement Portal
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            Placement Cell Portal — Authorized access only
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-on-surface text-[0.8rem] font-semibold tracking-wide ml-0.5"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@university.edu"
              className="
                w-full bg-surface-container-low text-on-surface
                font-mono text-sm
                px-4 py-3.5 rounded-lg
                outline-none border-2 border-transparent
                focus:border-primary/40 focus:bg-white
                transition-all duration-200
                placeholder:text-outline/50 placeholder:font-sans
              "
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center ml-0.5">
              <label
                htmlFor="password"
                className="text-on-surface text-[0.8rem] font-semibold tracking-wide"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="
                w-full bg-surface-container-low text-on-surface
                font-mono text-sm
                px-4 py-3.5 rounded-lg
                outline-none border-2 border-transparent
                focus:border-primary/40 focus:bg-white
                transition-all duration-200
                placeholder:text-outline/50 placeholder:font-sans
              "
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-error-container/40 text-on-error-container px-4 py-3 rounded-lg">
              <span className="material-symbols-outlined text-error" style={{ fontSize: '16px' }}>
                error
              </span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              btn-gradient
              w-full py-4 px-6 rounded-lg
              text-white font-bold tracking-tight
              shadow-primary hover:shadow-primary-hover
              hover:scale-[1.01] active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  login
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <footer className="pt-4 border-t border-surface-container-high">
          <div className="flex flex-col items-center gap-3">
            <p className="text-on-surface-variant text-[0.72rem] text-center leading-relaxed">
              By signing in you agree to the{' '}
              <span className="text-on-surface font-bold">Security Protocol</span>
              {' '}and{' '}
              <span className="font-mono">Privacy Terms</span>
            </p>
            <span className="text-on-surface-variant font-mono text-[0.7rem] uppercase tracking-widest opacity-60">
              System v1.0.0
            </span>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default Login