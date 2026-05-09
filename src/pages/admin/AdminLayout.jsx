import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  Users as UsersIcon,
  LogOut,
  Home,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const scope =
    user?.role === 'rb_admin'
      ? 'Roasted Bean'
      : user?.role === 'hw_admin'
        ? 'Hillside Walk'
        : 'All shops'

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
    { to: '/admin/bookings', icon: <Calendar size={18} />, label: 'Bookings' },
    { to: '/admin/menu', icon: <UtensilsCrossed size={18} />, label: 'Menu' },
  ]
  if (user?.role === 'superuser') {
    navItems.push({ to: '/admin/users', icon: <UsersIcon size={18} />, label: 'Users' })
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-stone-900 text-stone-100 flex-col">
        <div className="p-6 border-b border-stone-800">
          <Link to="/admin" className="flex items-center gap-2">
            <Shield size={20} className="text-amber-400" />
            <div>
              <div className="font-semibold">Admin Console</div>
              <div className="text-xs text-stone-400">{scope}</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                }`
              }
            >
              {n.icon}
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-stone-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800/50"
          >
            <Home size={18} /> Back to site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800/50"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Admin · {scope}</div>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-wider text-stone-400 hover:text-white"
          >
            Sign out
          </button>
        </header>
        {/* Mobile pills */}
        <nav className="md:hidden flex gap-2 overflow-x-auto p-3 bg-stone-900/95 text-sm">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-stone-900'
                    : 'text-stone-300 bg-stone-800'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-auto p-5 md:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
