// frontend/src/components/Sidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard',    label: 'Dashboard',    icon: 'dashboard'   },
  { path: '/companies',    label: 'Companies',    icon: 'business'    },
  { path: '/applications', label: 'Applications', icon: 'description' },
  { path: '/students',     label: 'Students',     icon: 'group'       },
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Generate initials avatar from name
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AU'

  return (
    <aside className="
      fixed left-0 top-0 h-screen w-72 z-40
      flex flex-col gap-2 p-4
      glass-panel
      border-r border-white/20
      shadow-2xl shadow-indigo-900/5
    ">

      {/* ── Logo ───────────────────────────────────── */}
      <div className="mb-8 px-4 py-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center flex-shrink-0">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
          >
            account_balance
          </span>
        </div>
        <span className="text-xl font-bold text-primary-container tracking-tighter">
          Placement Portal
        </span>
      </div>

      {/* ── Nav Links ──────────────────────────────── */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-4 py-3 rounded-lg text-primary-container bg-surface-container-lowest shadow-sm font-bold scale-[0.98] transition-all duration-200'
                : 'flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-200 font-semibold'
            }
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {icon}
            </span>
            <span className="font-['Inter'] tracking-tight">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User Profile (bottom) ───────────────────── */}
      <div className="mt-auto px-2">
        <div className="bg-surface-container-low rounded-xl p-4">

          {/* Avatar + name + role */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-on-surface leading-none truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5 uppercase tracking-wider">
                {user?.role || 'admin'}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              w-full py-2 text-xs font-bold
              text-error bg-error-container/30
              rounded-lg hover:bg-error-container/50
              transition-colors duration-200
              flex items-center justify-center gap-1.5
            "
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              logout
            </span>
            Logout
          </button>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar