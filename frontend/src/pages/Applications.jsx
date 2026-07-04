// frontend/src/pages/Applications.jsx

import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { PROGRAMMES } from '../constants/programmes'

// ── Helpers ───────────────────────────────────────────────
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—'

const StatusBadge = ({ status }) => {
  const map = {
    pending:  'badge-pending',
    selected: 'badge-selected',
    rejected: 'badge-rejected',
  }
  return (
    <span className={`badge ${map[status] || 'badge-pending'}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}

// ── Main Component ────────────────────────────────────────
const Applications = () => {
  const [applications, setApplications] = useState([])
  const [companies, setCompanies]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  // Filters
  const [filters, setFilters] = useState({
    status:     '',
    company_id: '',
    branch:     '',
  })

  // Pagination
  const [page, setPage]   = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 10

  useEffect(() => {
    api.get('/companies')
      .then(({ data }) => setCompanies(data))
      .catch(() => {})
  }, [])

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(filters.status     && { status:     filters.status }),
        ...(filters.company_id && { company_id: filters.company_id }),
        ...(filters.branch     && { branch:     filters.branch }),
      })
      const { data } = await api.get(`/applications?${params}`)
      setApplications(data.data || [])
      setTotal(data.count || 0)
    } catch {
      setError('Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <Layout title="Applications">

      {/* ── Filter Bar ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-8">

        <select
          value={filters.status}
          onChange={e => handleFilterChange('status', e.target.value)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-surface-container-highest text-on-surface outline-none border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.company_id}
          onChange={e => handleFilterChange('company_id', e.target.value)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-surface-container-highest text-on-surface outline-none border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200"
        >
          <option value="">All Companies</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filters.branch}
          onChange={e => handleFilterChange('branch', e.target.value)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-surface-container-highest text-on-surface outline-none border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200"
        >
          <option value="">All Programmes</option>
          {PROGRAMMES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() => {
              setFilters({ status: '', company_id: '', branch: '' })
              setPage(1)
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-error bg-error-container/30 hover:bg-error-container/50 transition-colors duration-200"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              filter_list_off
            </span>
            Clear filters
          </button>
        )}

        <div className="ml-auto flex items-center">
          <span className="text-sm text-on-surface-variant font-medium">
            {loading ? '...' : `${total} application${total !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden mb-6">

        {error && (
          <div className="flex items-center gap-2 m-6 bg-error-container/40 text-on-error-container px-4 py-3 rounded-lg">
            <span className="material-symbols-outlined text-error" style={{ fontSize: '16px' }}>error</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-lg animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined mb-3" style={{ fontSize: '48px' }}>
              description
            </span>
            <p className="text-base font-semibold">No applications found</p>
            <p className="text-sm mt-1">
              {Object.values(filters).some(Boolean)
                ? 'Try clearing your filters'
                : 'Applications will appear here once students apply'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container">
                  {[
                    'Applicant', 'Roll No', 'Programme',
                    'CGPA', 'Company', 'Applied On', 'Status'
                  ].map(h => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr
                    key={app.application_id}
                    className={`
                      hover:bg-surface-container-low transition-colors duration-150
                      ${idx !== applications.length - 1
                        ? 'border-b border-surface-container-low' : ''}
                    `}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-on-surface text-sm leading-none mb-1">
                        {app.student_name}
                      </p>
                      <p className="text-xs text-outline font-mono">
                        {app.email || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                        {app.roll_no}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-on-surface-variant">
                        {app.branch || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-on-surface">
                        {app.cgpa || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-on-surface leading-none mb-1">
                        {app.company_name}
                      </p>
                      <p className="text-xs text-outline">
                        {app.role || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-on-surface-variant">
                        {formatDate(app.applied_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-on-surface-variant font-medium">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                chevron_left
              </span>
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1
              if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all duration-200 ${
                      p === page
                        ? 'btn-gradient text-white shadow-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {p}
                  </button>
                )
              }
              if (Math.abs(p - page) === 2) {
                return <span key={p} className="text-on-surface-variant px-1">…</span>
              }
              return null
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                chevron_right
              </span>
            </button>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default Applications