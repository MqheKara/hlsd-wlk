import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Banknote, Smartphone, Truck, Store, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getSubShopTheme } from '../../themes'
import api from '../../api/client'

export default function HWCheckout() {
  const { subShopCode } = useParams()
  const theme = getSubShopTheme(subShopCode)
  const { getCart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const cart = getCart('HW', subShopCode)
  const navigate = useNavigate()

  const [orderType, setOrderType] = useState('pickup')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [address, setAddress] = useState(user?.address || '')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [subShopId, setSubShopId] = useState(null)

  useEffect(() => {
    api
      .get(`/shops/HW/sub-shops/${subShopCode}`)
      .then(({ data }) => setSubShopId(data.id))
      .catch(() => {})
  }, [subShopCode])

  const subtotal = cartTotal('HW', subShopCode)
  const deliveryFee = orderType === 'delivery' ? 3.0 : 0
  const total = subtotal + deliveryFee

  const submit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) {
      toast.error('Your basket is empty')
      return
    }
    if (orderType === 'delivery' && !address.trim()) {
      toast.error('Add a delivery address')
      return
    }
    setBusy(true)
    try {
      const { data } = await api.post('/orders', {
        shop_code: 'HW',
        sub_shop_id: subShopId,
        order_type: orderType,
        payment_method: paymentMethod,
        delivery_address: orderType === 'delivery' ? address : null,
        notes,
        items: cart.map((c) => ({ menu_item_id: c.id, quantity: c.quantity })),
      })
      clearCart('HW', subShopCode)
      toast.success(`Order #${data.id} placed`)
      navigate('/hw/account')
    } catch (err) {
      toast.error(err.userMessage || 'Could not place order')
    } finally {
      setBusy(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen ${theme.bgGradient} ${theme.text} ${theme.fontBody} flex items-center justify-center px-5`}>
        <div className="text-center">
          <div className={`${theme.fontDisplay} text-3xl mb-2`}>Empty basket</div>
          <p className="opacity-70 mb-6">Pop back into the shop and add something.</p>
          <button
            onClick={() => navigate(`/hw/shop/${subShopCode}`)}
            className={`${theme.button} px-6 py-2.5 rounded-full`}
          >
            Back to {theme.name}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.bgGradient} ${theme.text} ${theme.fontBody}`}>
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 opacity-70 hover:opacity-100 mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className={`${theme.fontDisplay} text-4xl md:text-5xl mb-1`}>Checkout</h1>
        <p className="opacity-70 mb-8">{theme.name}</p>

        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            <Section theme={theme} title="Pickup or delivery?">
              <div className="grid grid-cols-2 gap-3">
                <Choice
                  theme={theme}
                  active={orderType === 'pickup'}
                  onClick={() => setOrderType('pickup')}
                  icon={<Store size={18} />}
                  title="Pickup"
                  sub="Ready in 15–20 min"
                />
                <Choice
                  theme={theme}
                  active={orderType === 'delivery'}
                  onClick={() => setOrderType('delivery')}
                  icon={<Truck size={18} />}
                  title="Delivery"
                  sub="In Hillside · $3 fee"
                />
              </div>
              {orderType === 'delivery' && (
                <motion.input
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Delivery address"
                  className="mt-4 w-full bg-white/70 border border-current/15 rounded-xl px-4 py-3 outline-none focus:border-current/40"
                />
              )}
            </Section>

            <Section theme={theme} title="Payment">
              <div className="grid sm:grid-cols-3 gap-3">
                <Choice theme={theme} active={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')} icon={<Banknote size={18} />} title="Cash" sub="On pickup / delivery" />
                <Choice theme={theme} active={paymentMethod === 'mock_card'} onClick={() => setPaymentMethod('mock_card')} icon={<CreditCard size={18} />} title="Card" sub="Visa / Mastercard" />
                <Choice theme={theme} active={paymentMethod === 'ecocash'} onClick={() => setPaymentMethod('ecocash')} icon={<Smartphone size={18} />} title="EcoCash" sub="Mobile wallet" />
              </div>
              {paymentMethod === 'mock_card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 grid grid-cols-2 gap-3"
                >
                  <input required placeholder="Cardholder name" className="col-span-2 bg-white/70 border border-current/15 rounded-xl px-4 py-2.5" />
                  <input required placeholder="Card number" className="col-span-2 bg-white/70 border border-current/15 rounded-xl px-4 py-2.5" />
                  <input required placeholder="MM/YY" className="bg-white/70 border border-current/15 rounded-xl px-4 py-2.5" />
                  <input required placeholder="CVC" className="bg-white/70 border border-current/15 rounded-xl px-4 py-2.5" />
                  <p className="col-span-2 text-xs opacity-60">Demo only — no real charge.</p>
                </motion.div>
              )}
            </Section>

            <Section theme={theme} title="Notes (optional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, requests…"
                className="w-full bg-white/70 border border-current/15 rounded-xl px-4 py-3 outline-none min-h-[80px]"
              />
            </Section>
          </div>

          <aside className={`lg:sticky lg:top-28 self-start ${theme.cardBg} border border-current/10 rounded-2xl p-5 h-fit`}>
            <div className={`${theme.fontDisplay} text-2xl mb-4`}>Summary</div>
            <ul className="divide-y divide-current/5 mb-4">
              {cart.map((c) => (
                <li key={c.id} className="py-2 flex justify-between text-sm">
                  <span className="opacity-80">
                    {c.name} <span className="opacity-60">×{c.quantity}</span>
                  </span>
                  <span>${(c.price * c.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="text-sm space-y-1">
              <div className="flex justify-between opacity-70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2 border-t border-current/10 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className={`mt-5 w-full ${theme.button} py-3 rounded-full font-medium disabled:opacity-60`}
            >
              {busy ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}
            </button>
          </aside>
        </form>
      </div>
    </div>
  )
}

function Section({ theme, title, children }) {
  return (
    <div className={`${theme.cardBg} border border-current/10 rounded-2xl p-5`}>
      <div className={`${theme.fontDisplay} text-lg mb-3`}>{title}</div>
      {children}
    </div>
  )
}

function Choice({ theme, active, onClick, icon, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-xl border-2 transition ${
        active
          ? `${theme.accentBorder} bg-black/5`
          : 'border-current/10 hover:border-current/40'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="text-xs opacity-70">{sub}</div>
    </button>
  )
}
