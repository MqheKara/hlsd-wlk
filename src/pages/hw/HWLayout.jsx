import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trees, ShoppingBag, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'

export default function HWLayout() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()
  // Sum across all HW sub-shop carts
  const total =
    cartCount('HW', 'main') +
    cartCount('HW', 'sushi') +
    cartCount('HW', 'beauty') +
    cartCount('HW', 'bakery')

  return (
    <div className="min-h-screen bg-hw-cream text-hw-forest font-hw_sans flex flex-col">
      <header className="sticky top-0 z-40 bg-hw-cream/85 backdrop-blur border-b border-hw-forest/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center gap-6">
          <Link to="/hw" className="flex items-center gap-2.5">
            <Trees className="text-hw-forest" size={22} />
            <div className="leading-tight">
              <div className="font-hw_display text-2xl tracking-tight">
                Hillside <span className="italic font-medium">Walk</span>
              </div>
              <div className="text-hw-terracotta uppercase text-[10px] tracking-[0.3em] -mt-0.5">
                Hillside · Bulawayo
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 ml-6 text-sm">
            {[
              ['Sub-shops', '/hw'],
              ['Book a table', '/hw/book'],
              ['Account', '/hw/account'],
            ].map(([label, to]) => (
              <HWLink key={to} to={to} label={label} end={to === '/hw'} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:block text-xs text-hw-forest/60 hover:text-hw-forest transition uppercase tracking-wider"
            >
              Roasted Bean →
            </Link>
            <div className="relative">
              <span className="bg-hw-terracotta text-hw-cream px-3.5 py-2 rounded-full text-sm flex items-center gap-2">
                <ShoppingBag size={16} />
                <span>{total} item{total !== 1 ? 's' : ''}</span>
              </span>
            </div>
            {user ? (
              <button
                onClick={logout}
                className="text-xs text-hw-forest/70 hover:text-hw-forest uppercase tracking-wider hidden sm:block"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                state={{ from: location.pathname }}
                className="text-hw-forest hover:bg-hw-sand px-3 py-2 rounded-full text-sm flex items-center gap-1"
              >
                <LogIn size={16} /> Sign in
              </Link>
            )}
          </div>
        </div>
        <nav className="md:hidden flex items-center justify-around border-t border-hw-forest/10 text-xs">
          {[
            ['Sub-shops', '/hw'],
            ['Book', '/hw/book'],
            ['Account', '/hw/account'],
          ].map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/hw'}
              className={({ isActive }) =>
                `py-2.5 px-3 ${isActive ? 'text-hw-forest font-medium' : 'text-hw-forest/60'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-hw-forest text-hw-cream/80 mt-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="font-hw_display text-3xl text-hw-cream">
              Hillside <span className="italic">Walk</span>
            </div>
            <p className="text-hw-terracotta uppercase text-xs tracking-[0.3em] mt-1">
              a destination
            </p>
            <p className="mt-3 text-sm max-w-xs">
              Outdoor dining, poolside events, and a curated set of boutique
              shops in Bulawayo's Hillside.
            </p>
          </div>
          <div className="text-sm">
            <div className="text-hw-cream font-medium mb-2">Hours</div>
            <div>Restaurant · 11am–10pm</div>
            <div>Sub-shops · vary by venue</div>
          </div>
          <div className="text-sm">
            <div className="text-hw-cream font-medium mb-2">Visit</div>
            <div>42 Hillside Drive</div>
            <div>Bulawayo, Zimbabwe</div>
          </div>
        </div>
        <div className="border-t border-hw-cream/10 py-4 text-center text-xs text-hw-cream/50">
          © 2026 Hillside Walk. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function HWLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative tracking-wide uppercase text-xs ${
          isActive
            ? 'text-hw-forest font-medium'
            : 'text-hw-forest/60 hover:text-hw-forest'
        } transition`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <motion.div
              layoutId="hw-underline"
              className="absolute -bottom-1 left-0 right-0 h-px bg-hw-terracotta"
            />
          )}
        </>
      )}
    </NavLink>
  )
}
