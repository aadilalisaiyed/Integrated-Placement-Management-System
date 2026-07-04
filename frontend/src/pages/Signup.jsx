// frontend/src/pages/Signup.jsx

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { PROGRAMMES } from '../constants/programmes'

const EMPTY_FORM = {
  name:            '',
  email:           '',
  password:        '',
  confirmPassword: '',
  roll_no:         '',
  branch:          '',
  cgpa:            '',
  graduation_year: '',
}

const Signup = () => {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]       = useState(EMPTY_FORM)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data } = await api.post('/auth/register', {
        name:            form.name,
        email:           form.email,
        password:        form.password,
        roll_no:         form.roll_no,
        branch:          form.branch,
        cgpa:            form.cgpa,
        graduation_year: form.graduation_year,
      })

      login({ token: data.token, role: data.role, name: data.name })
      navigate('/apply')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">

      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-2xl shadow-card p-10 flex flex-col gap-6">

        {/* Header */}
        <header className="flex flex-col gap-1">
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
              Student Registration
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            Create your account to access placement opportunities
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name + Roll No */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="
                  w-full bg-surface-container-low text-on-surface
                  px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40
                "
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Roll Number <span className="text-error">*</span>
              </label>
              <input
                name="roll_no"
                required
                value={form.roll_no}
                onChange={handleChange}
                placeholder="BTECH-CSE-001"
                className="
                  w-full bg-surface-container-low text-on-surface
                  font-mono px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40 placeholder:font-sans
                "
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
              Email Address <span className="text-error">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="your@college.edu"
              className="
                w-full bg-surface-container-low text-on-surface
                font-mono px-4 py-3 rounded-lg text-sm
                outline-none border-2 border-transparent
                focus:border-primary/40 focus:bg-white
                transition-all duration-200
                placeholder:text-outline/40 placeholder:font-sans
              "
            />
          </div>

          {/* Programme */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
              Programme <span className="text-error">*</span>
            </label>
            <select
              name="branch"
              required
              value={form.branch}
              onChange={handleChange}
              className="
                w-full bg-surface-container-low text-on-surface
                px-4 py-3 rounded-lg text-sm
                outline-none border-2 border-transparent
                focus:border-primary/40 focus:bg-white
                transition-all duration-200
              "
            >
              <option value="">Select your programme</option>
              {PROGRAMMES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* CGPA + Grad Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                CGPA <span className="text-error">*</span>
              </label>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={form.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.50"
                className="
                  w-full bg-surface-container-low text-on-surface
                  font-mono px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40 placeholder:font-sans
                "
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Graduation Year <span className="text-error">*</span>
              </label>
              <input
                name="graduation_year"
                type="number"
                min="2024"
                max="2030"
                required
                value={form.graduation_year}
                onChange={handleChange}
                placeholder="2025"
                className="
                  w-full bg-surface-container-low text-on-surface
                  font-mono px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40 placeholder:font-sans
                "
              />
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Password <span className="text-error">*</span>
              </label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="
                  w-full bg-surface-container-low text-on-surface
                  font-mono px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40 placeholder:font-sans
                "
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Confirm Password <span className="text-error">*</span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="
                  w-full bg-surface-container-low text-on-surface
                  font-mono px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40 placeholder:font-sans
                "
              />
            </div>
          </div>

          {/* Error */}
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
              btn-gradient w-full py-4 rounded-lg
              text-white font-bold tracking-tight
              shadow-primary hover:shadow-primary-hover
              hover:scale-[1.01] active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
              mt-2
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating account...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  person_add
                </span>
                Create Account
              </>
            )}
          </button>

        </form>

        {/* Login link */}
        <p className="text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Signup