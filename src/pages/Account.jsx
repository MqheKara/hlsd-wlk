import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ShoppingBag, User as UserIcon, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const themesByShop = {
  RB: {
    bg: 'bg-rb-milk',
    text: 'text-rb-coffee',
    muted: 'text-rb-mocha',
    accent: 'text-rb-accent',
    accentBg: 'bg-rb-coffee',
    cardBorder: 'border-rb-coffee/10',
    button: 'bg-rb-coffee text-rb-cream hover:bg-rb-espresso',
    activeTab: 'bg-rb-coffee text-rb-cream',
    inactiveTab: 'text-rb-mocha hover:text-rb-coffee',
    fontDisplay: 'font-rb_serif',
  },
  HW: {
    bg: 'bg-hw-cream',
    text: 'text-hw-forest',
    muted: 'text-hw-stone',
    accent: 'text-hw-terracotta',
    accentBg: 'bg-hw-terracotta',
    cardBorder: 'border-hw-forest/10',
    button: 'bg-hw-terracotta text-hw-cream hover:bg-hw-forest',
    activeTab: 'bg-hw-forest text-hw-cream',
    inactiveTab: 'text-hw-stone hover:text-hw-forest',
    fontDisplay: 'font-hw_display',
  },
}

const orderStatusColor = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-indigo-100 text-indigo-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function Account({ shopCode = 'RB' }) {
  const t = themesByShop[shopCode] || themesByShop.RB
  const { user, updateProfile } = useAuth()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/orders/mine'), api.get('/bookings/mine')])
      .then(([o, b]) => {
        setOrders(o.data)
        setBookings(b.data)
      })
      .catch(() => toast.error('Could not load account'))
      .finally(() => setLoading(false))
  }, [])

  const filteredOrders = orders.filter((o) => {
    // For RB account view, show RB orders (shop_id 1 typically); but we filter by joining shop info would be ideal
    // Since we have user-scoped orders only, we just show all and label by shop.
    return true
  })

  const saveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile(profile)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.userMessage || 'Could not update')
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className={`max-w-5xl mx-auto px-5 md:px-8 py-12`}>
      <h1 className={`${t.fontDisplay} text-4xl mb-1`}>Your account</h1>
      <p className={`${t.muted} mb-8`}>
        Hi {user?.name?.split(' ')[0]} — track your orders and bookings here.
      </p>

      <div className="flex gap-2 mb-6 bg-black/5 p-1 rounded-full text-sm w-fit">
        {[
          ['orders', 'Orders', <ShoppingBag size={14} key="o" />],
          ['bookings', 'Bookings', <Calendar size={14} key="b" />],
          ['profile', 'Profile', <UserIcon size={14} key="p" />],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition ${
              tab === key ? '' : t.inactiveTab
            }`}
          >
            {tab === key && (
              <motion.div
                layoutId="account-tab"
                className={`absolute inset-0 ${t.activeTab.split(' ')[0]} rounded-full`}
              />
            )}
            <span className={`relative flex items-center gap-2 ${tab === key ? t.activeTab.split(' ')[1] : ''}`}>
              {icon} {label}
            </span>
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-black/5 h-28 shimmer" />
            ))
          ) : orders.length === 0 ? (
            <Empty icon={<ShoppingBag size={40} />} title="No orders yet" sub="Your orders will appear here." />
          ) : (
            orders.map((o) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white border ${t.cardBorder} rounded-2xl p-5`}
              >
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <div className={`${t.fontDisplay} text-xl ${t.text}`}>
                      Order #{o.id}
                    </div>
                    <div className={`text-xs ${t.muted} flex items-center gap-1`}>
                      <Clock size={12} /> {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColor[o.status] || 'bg-gray-100'}`}>
                    {o.status}
                  </span>
                </div>
                <ul className={`mt-3 text-sm ${t.muted} space-y-0.5`}>
                  {o.items.map((it) => (
                    <li key={it.id}>
                      {it.item_name} ×{it.quantity} — ${(it.unit_price * it.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between text-sm">
                  <span className={`uppercase ${t.muted}`}>
                    {o.order_type} · {o.payment_method}
                  </span>
                  <span className={`font-medium ${t.text}`}>${o.total.toFixed(2)}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="space-y-3">
          {loading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-black/5 h-24 shimmer" />
            ))
          ) : bookings.length === 0 ? (
            <Empty icon={<Calendar size={40} />} title="No bookings yet" sub="Reserved tables will appear here." />
          ) : (
            bookings.map((b) => {
              const start = new Date(b.booking_date)
              const end = new Date(start.getTime() + (b.duration_hours || 0) * 3600 * 1000)
              const isEvent = b.booking_type === 'event'
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border ${t.cardBorder} rounded-2xl p-5`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`${t.fontDisplay} text-xl ${t.text}`}>
                          {isEvent ? `Event for ${b.party_size}` : `Table for ${b.party_size}`}
                        </div>
                        {isEvent && (
                          <span className="text-[10px] uppercase tracking-widest bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Event
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${t.muted}`}>
                        {start.toLocaleString()}
                        {isEvent && ` — ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                        {' · '}
                        {b.table_type}
                      </div>
                      {b.notes && (
                        <div className={`text-sm ${t.muted} mt-1 italic`}>"{b.notes}"</div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColor[b.status] || 'bg-gray-100'}`}>
                      {b.status}
                    </span>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={saveProfile} className={`bg-white border ${t.cardBorder} rounded-2xl p-6 max-w-lg space-y-4`}>
          <div>
            <label className={`block text-sm ${t.muted} mb-1`}>Name</label>
            <input
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-current/15 rounded-xl px-4 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className={`block text-sm ${t.muted} mb-1`}>Email</label>
            <input
              disabled
              value={user?.email || ''}
              className="w-full border border-current/10 rounded-xl px-4 py-2.5 bg-black/5"
            />
          </div>
          <div>
            <label className={`block text-sm ${t.muted} mb-1`}>Phone</label>
            <input
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full border border-current/15 rounded-xl px-4 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className={`block text-sm ${t.muted} mb-1`}>Default delivery address</label>
            <input
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full border border-current/15 rounded-xl px-4 py-2.5 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className={`${t.button} px-6 py-2.5 rounded-full font-medium transition disabled:opacity-60`}
          >
            {savingProfile ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      )}
    </div>
  )
}

function Empty({ icon, title, sub }) {
  return (
    <div className="text-center py-16 opacity-60">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="font-medium text-lg">{title}</div>
      <div className="text-sm">{sub}</div>
    </div>
  )
}
