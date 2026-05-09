import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, ShoppingBag, User, LogIn, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'

export default function RBLayout() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()
  const count = cartCount('RB')

  return (
    <div className="min-h-screen bg-rb-milk text-rb-coffee font-rb_sans flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-rb-milk/85 backdrop-blur border-b border-rb-coffee/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center gap-6">
          <Link to="/rb" className="flex items-center gap-2">
            <Coffee className="text-rb-coffee" size={22} />
            <div className="leading-tight">
              <div className="font-rb_serif text-2xl">Roasted Bean</div>
              <div className="font-rb_script text-rb-mocha -mt-1 text-sm">
                in town
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 ml-6 text-sm">
            {[
              ['Menu', '/rb/menu'],
              ['Book a table', '/rb/book'],
              ['Account', '/rb/account'],
            ].map(([label, to]) => (
              <RBLink key={to} to={to} label={label} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:block text-xs text-rb-coffee/60 hover:text-rb-coffee transition uppercase tracking-wider"
            >
              ← Hillside Walk
            </Link>
            <Link
              to="/rb/checkout"
              className="relative bg-rb-coffee text-rb-cream px-3.5 py-2 rounded-full text-sm hover:bg-rb-espresso transition flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>Cart</span>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-rb-caramel text-rb-coffee text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </Link>
            {user ? (
              <button
                onClick={logout}
                className="text-xs text-rb-coffee/70 hover:text-rb-coffee uppercase tracking-wider hidden sm:block"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                state={{ from: location.pathname }}
                className="text-rb-coffee hover:bg-rb-cream px-3 py-2 rounded-full text-sm flex items-center gap-1"
              >
                <LogIn size={16} /> Sign in
              </Link>
            )}
          </div>
        </div>
        {/* mobile sub-nav */}
        <nav className="md:hidden flex items-center justify-around border-t border-rb-coffee/10 text-xs">
          {[
            ['Menu', '/rb/menu', null],
            ['Book', '/rb/book', null],
            ['Account', '/rb/account', null],
          ].map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `py-2.5 px-3 ${isActive ? 'text-rb-coffee font-medium' : 'text-rb-coffee/60'}`
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

      <footer className="bg-rb-coffee text-rb-cream/80 mt-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <div className="font-rb_serif text-3xl text-rb-cream">Roasted Bean</div>
            <p className="font-rb_script text-rb-caramel text-lg">
              from bean to cup, with care
            </p>
            <p className="mt-3 text-sm max-w-xs">
              Bulawayo CBD · Mon–Sat 7am–6pm · Sun 8am–2pm
            </p>
          </div>
          <div className="text-sm">
            <div className="text-rb-cream font-medium mb-2">Visit</div>
            <div>123 Main Street</div>
            <div>Bulawayo CBD, Zimbabwe</div>
          </div>
        </div>
        <div className="border-t border-rb-cream/10 py-4 text-center text-xs text-rb-cream/50">
          © 2026 Roasted Bean. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function RBLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative tracking-wide uppercase text-xs ${
          isActive
            ? 'text-rb-coffee font-medium'
            : 'text-rb-coffee/60 hover:text-rb-coffee'
        } transition`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <motion.div
              layoutId="rb-underline"
              className="absolute -bottom-1 left-0 right-0 h-px bg-rb-caramel"
            />
          )}
        </>
      )}
    </NavLink>
  )
}
