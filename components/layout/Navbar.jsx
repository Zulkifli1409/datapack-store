import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Wifi, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

const navItems = [
  { to: '/dashboard', label: 'Beranda' },
  { to: '/packages', label: 'Paket Data' },
  { to: '/transactions', label: 'Riwayat' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    authService.logout()
    logout()
    toast.success('Berhasil logout')
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-base/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <span className="font-display font-bold text-base text-text-primary">DataPack</span>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label }) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-bg-elevated text-text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-elevated border border-border-subtle">
            <div className="w-6 h-6 rounded-lg bg-accent-primary flex items-center justify-center text-xs font-bold text-white">
              {user?.avatar || user?.name?.[0]}
            </div>
            <span className="text-sm text-text-secondary font-medium">{user?.name?.split(' ')[0]}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-text-muted hover:text-rose-accent hover:bg-rose-dim transition-all"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-border-subtle grid grid-cols-3">
        {navItems.map(({ to, label }) => {
          const active = location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-all',
                active ? 'text-text-primary' : 'text-text-muted'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
