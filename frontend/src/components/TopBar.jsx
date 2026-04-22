// frontend/src/components/TopBar.jsx

import { useAuth } from '../context/AuthContext'

const TopBar = ({ title }) => {
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AU'

  // Format today's date  e.g. "Monday, 18 April 2026"
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })

  return (
    <header className="
      sticky top-0 z-30
      flex justify-between items-center
      px-8 py-5
      glass-panel
      border-b border-white/20
    ">

      {/* ── Left: Page title + date ─────────────────── */}
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl tracking-tight text-primary-container">
          {title}
        </h1>
        <p className="text-sm text-on-surface-variant font-medium mt-0.5">
          {today}
        </p>
      </div>

      {/* ── Right: Actions + Avatar ─────────────────── */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <button className="
          p-2 rounded-full
          hover:bg-surface-container
          transition-colors duration-200
          text-on-surface-variant hover:text-on-surface
        ">
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
            search
          </span>
        </button>

        {/* Notifications */}
        <button className="
          relative p-2 rounded-full
          hover:bg-surface-container
          transition-colors duration-200
          text-on-surface-variant hover:text-on-surface
        ">
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
            notifications
          </span>
          {/* Red dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-container-high mx-1" />

        {/* Avatar */}
        <div className="
          w-9 h-9 rounded-full
          bg-primary-container
          flex items-center justify-center
          text-white text-sm font-bold
          ring-2 ring-white shadow-sm
          cursor-pointer
        ">
          {initials}
        </div>

      </div>
    </header>
  )
}

export default TopBar