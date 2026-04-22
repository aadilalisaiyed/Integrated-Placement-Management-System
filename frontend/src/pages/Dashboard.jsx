// frontend/src/pages/Dashboard.jsx

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { PROGRAMME_SHORT } from '../constants/programmes'

// ── Metric Card ──────────────────────────────────────────
const MetricCard = ({ icon, label, value, sub, subColor = 'text-on-surface-variant', iconBg, iconColor }) => (
  <div className="
    bg-surface-container-lowest rounded-xl p-6
    shadow-card border border-white/50
    hover:-translate-y-0.5 transition-transform duration-200
    flex flex-col gap-4
  ">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: '22px' }}>
          {icon}
        </span>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full bg-surface-container ${subColor}`}>
        {sub}
      </span>
    </div>
    <div>
      <p className="text-sm font-semibold text-on-surface-variant mb-1">{label}</p>
      <h3 className="text-3xl font-extrabold text-on-background tracking-tight">{value}</h3>
    </div>
  </div>
)

// ── Branch Bar ───────────────────────────────────────────

const BranchBar = ({ branch, placed, total }) => {
  const pct         = total > 0 ? Math.round((placed / total) * 100) : 0
  const displayName = PROGRAMME_SHORT[branch] || branch

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm font-bold gap-4">
        <span className="text-on-surface truncate">{displayName}</span>
        <span className="font-mono text-on-surface-variant flex-shrink-0">
          {placed}/{total} · {pct}%
        </span>
      </div>
      <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width:      `${pct}%`,
            background: 'linear-gradient(90deg, #001bd0 0%, #2d3fe7 100%)',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────
const Dashboard = () => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: res } = await api.get('/dashboard/analytics')
        setData(res)
      } catch (err) {
        setError('Failed to load analytics. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // ── Loading skeleton ─────────────────────────────────
  if (loading) return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl p-6 h-36 animate-pulse">
            <div className="h-4 bg-surface-container-high rounded w-1/2 mb-3" />
            <div className="h-8 bg-surface-container-high rounded w-3/4" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-low rounded-xl h-80 animate-pulse" />
        <div className="bg-surface-container-low rounded-xl h-80 animate-pulse" />
      </div>
    </Layout>
  )

  // ── Error state ──────────────────────────────────────
  if (error) return (
    <Layout title="Dashboard">
      <div className="flex items-center gap-3 bg-error-container/40 text-on-error-container px-6 py-4 rounded-xl">
        <span className="material-symbols-outlined text-error">error</span>
        <p className="font-medium">{error}</p>
      </div>
    </Layout>
  )

  const {
    totalStudents,
    totalPlaced,
    placementPercentage,
    totalCompanies,
    averageCtc,
    branchStats = [],
  } = data

  return (
    <Layout title="Dashboard">

      {/* ── Metric Cards ──────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon="group"
          label="Total Students"
          value={totalStudents.toLocaleString()}
          sub="Registered"
          iconBg="bg-primary-fixed-dim/20"
          iconColor="text-primary"
        />
        <MetricCard
          icon="work"
          label="Placed Students"
          value={totalPlaced.toLocaleString()}
          sub={`${placementPercentage}% Rate`}
          subColor="text-on-secondary-container"
          iconBg="bg-secondary-container/20"
          iconColor="text-secondary"
        />
        <MetricCard
          icon="business"
          label="Companies Visiting"
          value={totalCompanies.toLocaleString()}
          sub="Active"
          iconBg="bg-primary-container/10"
          iconColor="text-primary-container"
        />
        <MetricCard
          icon="payments"
          label="Avg. CTC"
          value={
            <span>
              {Number(averageCtc).toFixed(1)}
              <span className="text-lg font-bold ml-1">LPA</span>
            </span>
          }
          sub="Offered"
          iconBg="bg-tertiary-fixed/30"
          iconColor="text-tertiary-container"
        />
      </section>

      {/* ── Bento: Chart + Activity ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Branch-wise chart */}
        <section className="lg:col-span-2 bg-surface-container-low p-8 rounded-xl border border-white/20">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight mb-1">
              Branch-wise Placement
            </h2>
            <p className="text-sm text-on-surface-variant">
              Percentage of students placed per academic department
            </p>
          </div>

          {branchStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: '40px' }}>
                bar_chart
              </span>
              <p className="text-sm font-medium">No branch data yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {branchStats.map((b) => (
                <BranchBar
                  key={b.branch}
                  branch={b.branch}
                  placed={Number(b.placed_students)}
                  total={Number(b.total_students)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Activity feed */}
        <section className="bg-surface-container-low p-8 rounded-xl border border-white/20">
          <h2 className="text-xl font-bold tracking-tight mb-6">
            Quick Stats
          </h2>
          <div className="space-y-4">

            {/* Placement rate ring-less stat */}
            <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '22px' }}>
                  trending_up
                </span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                  Placement Rate
                </p>
                <p className="text-2xl font-extrabold text-on-background tracking-tight">
                  {placementPercentage}%
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>
                  school
                </span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                  Unplaced Students
                </p>
                <p className="text-2xl font-extrabold text-on-background tracking-tight">
                  {(totalStudents - totalPlaced).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-tertiary-container" style={{ fontSize: '22px' }}>
                  payments
                </span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                  Avg. Package
                </p>
                <p className="text-2xl font-extrabold text-on-background tracking-tight">
                  {Number(averageCtc).toFixed(1)}
                  <span className="text-sm font-bold ml-1">LPA</span>
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '22px' }}>
                  business
                </span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                  Total Companies
                </p>
                <p className="text-2xl font-extrabold text-on-background tracking-tight">
                  {totalCompanies}
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ── Branch Stats Table ─────────────────────────── */}
      {branchStats.length > 0 && (
        <section className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
          <div className="px-8 py-5 border-b border-surface-container-low">
            <h2 className="text-lg font-bold tracking-tight">Programme-wise Summary</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Detailed breakdown by branch
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Programme
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Total
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Placed
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {branchStats.map((b, idx) => {
                  const pct = Number(b.total_students) > 0
                    ? Math.round((Number(b.placed_students) / Number(b.total_students)) * 100)
                    : 0
                  return (
                    <tr
                      key={b.branch}
                      className={`
                        border-t border-surface-container-low
                        hover:bg-surface-container-low transition-colors duration-150
                        ${idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'}
                      `}
                    >
                      <td className="px-8 py-4 font-semibold text-on-surface">
                        {b.branch}
                      </td>
                      <td className="px-8 py-4 font-mono text-sm text-right text-on-surface-variant">
                        {b.total_students}
                      </td>
                      <td className="px-8 py-4 font-mono text-sm text-right text-secondary font-bold">
                        {b.placed_students}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className={`badge ${pct >= 75 ? 'badge-selected' : pct >= 50 ? 'badge-pending' : 'badge-rejected'}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </Layout>
  )
}

export default Dashboard