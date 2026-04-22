// frontend/src/pages/Students.jsx

import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
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

// ── Status Badge ──────────────────────────────────────────
const PlacementBadge = ({ isPlaced }) =>
  isPlaced ? (
    <span className="badge badge-placed">Placed</span>
  ) : (
    <span className="badge badge-not-placed">Not Placed</span>
  )

// ── Application Status Badge ──────────────────────────────
const AppStatusBadge = ({ status }) => {
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

// ── Student Detail Drawer ─────────────────────────────────
const StudentDrawer = ({ student, onClose }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (!student) return
    setLoading(true)
    api.get(`/applications?page=1&limit=50`)
      .then(({ data }) => {
        // Filter to only this student's applications
        const mine = (data.data || []).filter(
          a => a.roll_no === student.roll_no
        )
        setApplications(mine)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [student])

  if (!student) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-inverse-surface/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="
        fixed right-0 top-0 h-full z-50
        w-full max-w-md
        bg-surface-container-lowest
        shadow-[−20px_0_60px_rgba(27,28,26,0.12)]
        flex flex-col
        overflow-hidden
      ">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-container-low flex-shrink-0">
          <h2 className="text-lg font-bold tracking-tight text-on-surface">
            Student Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              text-xl font-bold flex-shrink-0
              ${getAvatarColor(student.name)}
            `}>
              {getInitials(student.name)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface tracking-tight">
                {student.name}
              </h3>
              <p className="text-sm text-on-surface-variant font-mono mt-0.5">
                {student.roll_no}
              </p>
              <div className="mt-2">
                <PlacementBadge isPlaced={student.is_placed} />
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="bg-surface-container-low rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Academic Details
            </h4>

            {[
              { label: 'Email',           value: student.email,           mono: true  },
              { label: 'Programme',        value: student.branch,          mono: false },
              { label: 'CGPA',            value: student.cgpa,            mono: true  },
              { label: 'Graduation Year', value: student.graduation_year, mono: true  },
              { label: 'Registered On',   value: formatDate(student.created_at), mono: true },
              {
                label: 'Placed At',
                value: student.is_placed ? formatDate(student.placed_at) : '—',
                mono: true
              },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide flex-shrink-0">
                  {label}
                </span>
                <span className={`text-sm text-on-surface text-right ${mono ? 'font-mono' : 'font-medium'}`}>
                  {value || '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Applications list */}
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              Applications ({applications.length})
            </h4>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-surface-container-low rounded-xl animate-pulse" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined mb-2" style={{ fontSize: '32px' }}>
                  description
                </span>
                <p className="text-sm font-medium">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div
                    key={app.application_id}
                    className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">
                        {app.company_name}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {app.role || '—'} · {formatDate(app.applied_at)}
                      </p>
                    </div>
                    <AppStatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────
const Students = () => {
  const [students, setStudents]     = useState([])
  const [filtered, setFiltered]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [programme, setProgramme]   = useState('')
  const [placedFilter, setPlacedFilter] = useState('')
  const [selected, setSelected]     = useState(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/students')
      setStudents(data.students || [])
      setFiltered(data.students || [])
    } catch {
      /* axios interceptor handles auth errors */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  // Filter logic
  useEffect(() => {
    let result = [...students]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.roll_no?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      )
    }

    if (programme) {
      result = result.filter(s => s.branch === programme)
    }

    if (placedFilter === 'placed') {
      result = result.filter(s => s.is_placed)
    } else if (placedFilter === 'not_placed') {
      result = result.filter(s => !s.is_placed)
    }

    setFiltered(result)
  }, [search, programme, placedFilter, students])

  const clearFilters = () => {
    setSearch('')
    setProgramme('')
    setPlacedFilter('')
  }

  const hasFilters = search || programme || placedFilter

  // Stats
  const totalPlaced    = students.filter(s => s.is_placed).length
  const totalUnplaced  = students.length - totalPlaced
  const placementRate  = students.length > 0
    ? Math.round((totalPlaced / students.length) * 100)
    : 0

  return (
    <Layout title="Students">

      {/* ── Summary Strip ───────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Students',
            value: students.length,
            icon:  'group',
            bg:    'bg-primary-fixed/20',
            color: 'text-primary',
          },
          {
            label: 'Placed',
            value: totalPlaced,
            icon:  'work',
            bg:    'bg-secondary-container/20',
            color: 'text-secondary',
          },
          {
            label: 'Placement Rate',
            value: `${placementRate}%`,
            icon:  'trending_up',
            bg:    'bg-tertiary-fixed/30',
            color: 'text-tertiary-container',
          },
        ].map(({ label, value, icon, bg, color }) => (
          <div
            key={label}
            className="bg-surface-container-lowest rounded-xl p-5 shadow-card flex items-center gap-4 border border-white/50"
          >
            <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
              <span className={`material-symbols-outlined ${color}`} style={{ fontSize: '20px' }}>
                {icon}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                {label}
              </p>
              <p className="text-2xl font-extrabold text-on-background tracking-tight">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6">

        {/* Search */}
        <div className="flex-grow relative min-w-[200px]">
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
            style={{ fontSize: '18px' }}
          >
            search
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, roll number, email..."
            className="
              w-full pl-11 pr-4 py-2.5
              bg-surface-container-highest rounded-lg
              text-on-surface text-sm
              outline-none border-2 border-transparent
              focus:border-primary/30 focus:bg-white
              transition-all duration-200
              placeholder:text-outline/50
            "
          />
        </div>

        {/* Programme filter */}
        <select
          value={programme}
          onChange={e => setProgramme(e.target.value)}
          className="
            px-4 py-2.5 rounded-lg text-sm font-medium
            bg-surface-container-highest text-on-surface
            outline-none border-2 border-transparent
            focus:border-primary/30 focus:bg-white
            transition-all duration-200
          "
        >
          <option value="">All Programmes</option>
          {PROGRAMMES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Placement filter */}
        <select
          value={placedFilter}
          onChange={e => setPlacedFilter(e.target.value)}
          className="
            px-4 py-2.5 rounded-lg text-sm font-medium
            bg-surface-container-highest text-on-surface
            outline-none border-2 border-transparent
            focus:border-primary/30 focus:bg-white
            transition-all duration-200
          "
        >
          <option value="">All Students</option>
          <option value="placed">Placed Only</option>
          <option value="not_placed">Not Placed Only</option>
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="
              flex items-center gap-1.5 px-4 py-2.5 rounded-lg
              text-sm font-medium text-error
              bg-error-container/30 hover:bg-error-container/50
              transition-colors duration-200
            "
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              filter_list_off
            </span>
            Clear
          </button>
        )}

        {/* Count */}
        <div className="ml-auto flex items-center">
          <span className="text-sm text-on-surface-variant font-medium">
            {loading ? '...' : `${filtered.length} student${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">

        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined mb-3" style={{ fontSize: '48px' }}>
              group
            </span>
            <p className="text-base font-semibold">
              {hasFilters ? 'No students match your filters' : 'No students registered yet'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm font-bold text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              {/* Head */}
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container">
                  {[
                    'Student', 'Roll No', 'Programme',
                    'CGPA', 'Grad. Year', 'Status', 'Registered', 'Profile'
                  ].map(h => (
                    <th
                      key={h}
                      className={`
                        px-6 py-4 text-xs font-bold text-on-surface-variant
                        uppercase tracking-wider whitespace-nowrap
                        ${h === 'Profile' ? 'text-right' : ''}
                      `}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filtered.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`
                      hover:bg-surface-container-low
                      transition-colors duration-150 cursor-pointer
                      ${idx !== filtered.length - 1
                        ? 'border-b border-surface-container-low'
                        : ''}
                    `}
                    onClick={() => setSelected(student)}
                  >
                    {/* Name + email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-9 h-9 rounded-full flex items-center justify-center
                          text-xs font-bold flex-shrink-0
                          ${getAvatarColor(student.name)}
                        `}>
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm leading-none mb-1">
                            {student.name}
                          </p>
                          <p className="text-xs text-outline font-mono">
                            {student.email || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                        {student.roll_no}
                      </span>
                    </td>

                    {/* Programme */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-on-surface-variant">
                        {student.branch || '—'}
                      </span>
                    </td>

                    {/* CGPA */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-on-surface">
                        {student.cgpa || '—'}
                      </span>
                    </td>

                    {/* Grad year */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-on-surface-variant">
                        {student.graduation_year || '—'}
                      </span>
                    </td>

                    {/* Placement status */}
                    <td className="px-6 py-4">
                      <PlacementBadge isPlaced={student.is_placed} />
                    </td>

                    {/* Registered on */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-on-surface-variant">
                        {formatDate(student.created_at)}
                      </span>
                    </td>

                    {/* View profile button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(student) }}
                        className="
                          p-2 rounded-lg
                          hover:bg-surface-container
                          text-on-surface-variant hover:text-primary
                          transition-all duration-150
                        "
                        title="View profile"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          open_in_new
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Student Detail Drawer ────────────────────────── */}
      <StudentDrawer
        student={selected}
        onClose={() => setSelected(null)}
      />

    </Layout>
  )
}

export default Students