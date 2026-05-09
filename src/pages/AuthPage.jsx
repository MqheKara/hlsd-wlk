import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, Lock, User as UserIcon, Phone, Home as HomeIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  })
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const user =
        mode === 'login'
          ? await login(form.email, form.password)
          : await register(form)
      toast.success(mode === 'login' ? 'Welcome back' : 'Account created')
      // Auto-redirect admins to admin
      if (
        ['rb_admin', 'hw_admin', 'superuser'].includes(user.role) &&
        from === '/'
      ) {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      toast.error(err.userMessage || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: visual */}
      <div
        className="hidden md:flex md:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(59,36,23,0.7), rgba(92,107,74,0.7)), url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="font-serif italic text-5xl leading-tight">
            Two doors.
            <br />
            One destination.
          </div>
          <p className="mt-4 max-w-sm text-white/80">
            Sign in to order, book a table, or pick up where you left off.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center bg-stone-50 p-6">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-8"
          >
            <ArrowLeft size={16} /> Back
          </Link>

          <h1 className="font-serif text-4xl text-stone-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-stone-500 mb-6">
            {mode === 'login'
              ? 'Sign in to continue.'
              : 'Order food. Book tables. Track everything.'}
          </p>

          <div className="grid grid-cols-2 mb-6 bg-stone-200/60 p-1 rounded-full text-sm">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative py-2 rounded-full transition ${
                  mode === m ? 'text-stone-900' : 'text-stone-500'
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 bg-white rounded-full shadow"
                  />
                )}
                <span className="relative">{m === 'login' ? 'Sign in' : 'Sign up'}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <Field
                    icon={<UserIcon size={16} />}
                    placeholder="Full name"
                    value={form.name}
                    onChange={update('name')}
                    required
                  />
                  <Field
                    icon={<Phone size={16} />}
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={update('phone')}
                  />
                  <Field
                    icon={<HomeIcon size={16} />}
                    placeholder="Default address (optional)"
                    value={form.address}
                    onChange={update('address')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Field
              icon={<Mail size={16} />}
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
              required
            />
            <Field
              icon={<Lock size={16} />}
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={update('password')}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-stone-900 text-white font-medium rounded-full py-3 hover:bg-stone-800 transition disabled:opacity-60"
            >
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-xs text-stone-400 border-t border-stone-200 pt-4">
            <div className="font-medium text-stone-500 mb-1">Demo accounts</div>
            <div>super@example.com · password</div>
            <div>rb@example.com · password (RB admin)</div>
            <div>hw@example.com · password (HW admin)</div>
            <div>alice@example.com · password (customer)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ icon, ...props }) {
  return (
    <label className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-stone-400 transition">
      <span className="text-stone-400">{icon}</span>
      <input
        {...props}
        className="flex-1 bg-transparent outline-none text-stone-900 placeholder-stone-400 text-sm"
      />
    </label>
  )
}
