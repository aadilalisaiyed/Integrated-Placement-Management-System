// frontend/src/pages/Apply.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { PROGRAMMES } from '../constants/programmes'

// ── Helpers ───────────────────────────────────────────────
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—'

const getInitials = (name) =>
  name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'

const AVATAR_COLORS = [
  'bg-primary-fixed/30 text-primary',
  'bg-secondary-container/30 text-secondary',
  'bg-tertiary-fixed/40 text-tertiary-container',
  'bg-error-container/30 text-error',
]
const getAvatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length]

// ── Empty form ────────────────────────────────────────────
const EMPTY_FORM = {
  roll_no:         '',
  name:            '',
  email:           '',
  branch:          '',
  cgpa:            '',
  graduation_year: '',
}

// ── Apply Modal ───────────────────────────────────────────
const ApplyModal = ({ company, onClose, onSuccess }) => {
  const [form, setForm]       = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (company) {
      setForm(EMPTY_FORM)
      setError('')
      setSuccess(false)
    }
  }, [company])

  if (!company) return null

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post(`/applications/apply/${company.id}`, form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(27,28,26,0.18)] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-surface-container-low flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-on-surface">
              Apply to {company.name}
            </h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {company.role || 'Open Role'} ·{' '}
              <span className="font-mono font-bold text-on-secondary-container">
                {company.ctc ? `${Number(company.ctc).toFixed(1)} LPA` : 'CTC N/A'}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant flex-shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center px-8 py-16 gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary-container/30 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-on-surface mb-2">
                Application Submitted!
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Your application to{' '}
                <span className="font-bold text-on-surface">{company.name}</span>{' '}
                has been received. The placement cell will be in touch.
              </p>
            </div>
            <button
              onClick={() => { onSuccess(); onClose() }}
              className="btn-gradient px-8 py-3 rounded-lg text-white font-bold text-sm shadow-primary hover:shadow-primary-hover hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
            >
              Back to Companies
            </button>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 px-8 py-6 overflow-y-auto"
          >
            {/* Eligibility info */}
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-wrap gap-4">
              {company.min_cgpa && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
                    school
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Min CGPA{' '}
                    <span className="font-mono font-bold text-on-surface">
                      {company.min_cgpa}
                    </span>
                  </span>
                </div>
              )}
              {company.eligible_branch && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
                    category
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Eligible:{' '}
                    <span className="font-bold text-on-surface">
                      {company.eligible_branch}
                    </span>
                  </span>
                </div>
              )}
              {company.drive_date && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
                    calendar_month
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Drive Date:{' '}
                    <span className="font-mono font-bold text-on-surface">
                      {formatDate(company.drive_date)}
                    </span>
                  </span>
                </div>
              )}
            </div>

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
                  placeholder="e.g. BTECH-CS-001"
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
                placeholder="your@email.com"
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

            {/* CGPA + Graduation Year */}
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
                  placeholder="e.g. 2025"
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

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="
                  flex-1 py-3 rounded-lg text-sm font-bold
                  bg-surface-container text-on-surface-variant
                  hover:bg-surface-container-high
                  transition-colors duration-200
                "
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="
                  flex-1 py-3 rounded-lg text-sm font-bold
                  btn-gradient text-white
                  shadow-primary hover:shadow-primary-hover
                  hover:scale-[1.01] active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                      send
                    </span>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Company Card ──────────────────────────────────────────
const CompanyCard = ({ company, onApply, applied }) => (
  <div className={`
    bg-surface-container-lowest rounded-xl p-6
    border border-white/50
    shadow-card
    hover:-translate-y-0.5 transition-all duration-200
    flex flex-col gap-4
    ${applied ? 'opacity-75' : ''}
  `}>

    {/* Top row */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`
          w-11 h-11 rounded-xl flex items-center justify-center
          text-sm font-bold flex-shrink-0
          ${getAvatarColor(company.name)}
        `}>
          {getInitials(company.name)}
        </div>
        <div>
          <h3 className="font-bold text-on-surface text-base leading-none mb-1">
            {company.name}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {company.role || 'Open Role'}
          </p>
        </div>
      </div>

      {/* CTC badge */}
      {company.ctc && (
        <span className="
          font-mono text-sm font-bold
          text-on-secondary-container
          bg-secondary-container/20
          px-2.5 py-1 rounded-lg
          flex-shrink-0
        ">
          {Number(company.ctc).toFixed(1)} LPA
        </span>
      )}
    </div>

    {/* Details row */}
    <div className="flex flex-wrap gap-3">
      {company.drive_date && (
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            calendar_month
          </span>
          {formatDate(company.drive_date)}
        </div>
      )}
      {company.min_cgpa && (
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            school
          </span>
          Min CGPA{' '}
          <span className="font-mono font-bold text-on-surface ml-0.5">
            {company.min_cgpa}
          </span>
        </div>
      )}
      {company.eligible_branch && (
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            category
          </span>
          {company.eligible_branch}
        </div>
      )}
    </div>

    {/* Apply button */}
    <button
      onClick={() => !applied && onApply(company)}
      disabled={applied}
      className={`
        w-full py-2.5 rounded-lg text-sm font-bold
        flex items-center justify-center gap-2
        transition-all duration-200
        ${applied
          ? 'bg-secondary-container/20 text-secondary cursor-not-allowed'
          : 'btn-gradient text-white shadow-primary hover:shadow-primary-hover hover:scale-[1.01] active:scale-[0.98]'
        }
      `}
    >
      {applied ? (
        <>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          Applied
        </>
      ) : (
        <>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            send
          </span>
          Apply Now
        </>
      )}
    </button>
  </div>
)

// ── Main Page ─────────────────────────────────────────────
const Apply = () => {
  const { user, logout } = useAuth()
  const [companies, setCompanies]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [selectedCompany, setSelected] = useState(null)
  const [appliedIds, setAppliedIds]   = useState(new Set())
  const [search, setSearch]           = useState('')

  useEffect(() => {
    api.get('/companies')
      .then(({ data }) => setCompanies(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSuccess = (companyId) => {
    setAppliedIds(prev => new Set([...prev, companyId]))
  }

  const filtered = companies.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">

      {/* ── Top Nav ───────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/20 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center flex-shrink-0">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
            </div>
            <span className="font-bold text-lg text-primary-container tracking-tight">
              Placement Portal
            </span>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-on-surface leading-none">
                {user?.name || 'Student'}
              </p>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5 uppercase">
                {user?.role}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'ST'}
            </div>
            <button
              onClick={logout}
              className="
                flex items-center gap-1.5 px-3 py-2 rounded-lg
                text-xs font-bold text-error
                bg-error-container/30 hover:bg-error-container/50
                transition-colors duration-200
              "
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="bg-surface-container-low border-b border-white/20 px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold text-on-background tracking-tight mb-2">
            Open Opportunities
          </h1>
          <p className="text-on-surface-variant text-base mb-6">
            Browse and apply to companies visiting your campus this placement season.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              style={{ fontSize: '20px' }}
            >
              search
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies or roles..."
              className="
                w-full pl-12 pr-4 py-3
                bg-surface-container-lowest rounded-xl
                text-on-surface text-sm
                outline-none border-2 border-transparent
                focus:border-primary/30
                shadow-level-1
                transition-all duration-200
                placeholder:text-outline/50
              "
            />
          </div>
        </div>
      </div>

      {/* ── Company Grid ──────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-8 py-8">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-surface-container-low rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined mb-3" style={{ fontSize: '48px' }}>
              business
            </span>
            <p className="text-base font-semibold">
              {search ? 'No companies match your search' : 'No companies listed yet'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-on-surface-variant font-medium mb-6">
              {filtered.length} compan{filtered.length !== 1 ? 'ies' : 'y'} available
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(company => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onApply={setSelected}
                  applied={appliedIds.has(company.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Apply Modal ───────────────────────────────── */}
      <ApplyModal
        company={selectedCompany}
        onClose={() => setSelected(null)}
        onSuccess={() => {
          if (selectedCompany) handleSuccess(selectedCompany.id)
        }}
      />
    </div>
  )
}

export default Apply