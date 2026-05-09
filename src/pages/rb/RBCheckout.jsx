import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Banknote, Smartphone, Truck, Store, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../api/client'

export default function RBCheckout() {
  const { getCart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const cart = getCart('RB')
  const navigate = useNavigate()

  const [orderType, setOrderType] = useState('pickup')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [address, setAddress] = useState(user?.address || '')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })

  const subtotal = cartTotal('RB')
  const deliveryFee = orderType === 'delivery' ? 3.0 : 0
  const total = subtotal + deliveryFee

  const submit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    if (orderType === 'delivery' && !address.trim()) {
      toast.error('Add a delivery address')
      return
    }
    setBusy(true)
    try {
      const { data } = await api.post('/orders', {
        shop_code: 'RB',
        order_type: orderType,
        payment_method: paymentMethod,
        delivery_address: orderType === 'delivery' ? address : null,
        notes,
        items: cart.map((c) => ({ menu_item_id: c.id, quantity: c.quantity })),
      })
      clearCart('RB')
      toast.success(`Order #${data.id} placed`)
      navigate('/rb/account')
    } catch (err) {
      toast.error(err.userMessage || 'Could not place order')
    } finally {
      setBusy(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-20 text-center">
        <div className="font-rb_serif text-3xl text-rb-coffee mb-2">
          Your cart is empty
        </div>
        <p className="text-rb-mocha mb-6">Browse the menu to start an order.</p>
        <button
          onClick={() => navigate('/rb/menu')}
          className="bg-rb-coffee text-rb-cream px-6 py-2.5 rounded-full hover:bg-rb-espresso transition"
        >
          See menu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-rb-mocha hover:text-rb-coffee mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-rb_serif text-4xl text-rb-coffee mb-1">Checkout</h1>
      <p className="text-rb-mocha mb-8">Almost there. Choose how you'd like it served.</p>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-6">
          {/* Order type */}
          <Section title="How would you like it?">
            <div className="grid grid-cols-2 gap-3">
              <Choice
                active={orderType === 'pickup'}
                onClick={() => setOrderType('pickup')}
                icon={<Store size={18} />}
                title="Pickup"
                sub="Ready in 15–20 min"
              />
              <Choice
                active={orderType === 'delivery'}
                onClick={() => setOrderType('delivery')}
                icon={<Truck size={18} />}
                title="Delivery"
                sub="In Bulawayo CBD · $3 fee"
              />
            </div>
            {orderType === 'delivery' && (
              <motion.input
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                className="mt-4 w-full border border-rb-coffee/15 rounded-xl px-4 py-3 outline-none focus:border-rb-caramel"
              />
            )}
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <div className="grid sm:grid-cols-3 gap-3">
              <Choice
                active={paymentMethod === 'cash'}
                onClick={() => setPaymentMethod('cash')}
                icon={<Banknote size={18} />}
                title="Cash"
                sub="On pickup / delivery"
              />
              <Choice
                active={paymentMethod === 'mock_card'}
                onClick={() => setPaymentMethod('mock_card')}
                icon={<CreditCard size={18} />}
                title="Card"
                sub="Visa / Mastercard"
              />
              <Choice
                active={paymentMethod === 'ecocash'}
                onClick={() => setPaymentMethod('ecocash')}
                icon={<Smartphone size={18} />}
                title="EcoCash"
                sub="Mobile wallet"
              />
            </div>

            {paymentMethod === 'mock_card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 grid grid-cols-2 gap-3"
              >
                <input
                  required
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  placeholder="Cardholder name"
                  className="col-span-2 border border-rb-coffee/15 rounded-xl px-4 py-2.5"
                />
                <input
                  required
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  placeholder="Card number (any 16 digits)"
                  className="col-span-2 border border-rb-coffee/15 rounded-xl px-4 py-2.5"
                />
                <input
                  required
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="border border-rb-coffee/15 rounded-xl px-4 py-2.5"
                />
                <input
                  required
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                  placeholder="CVC"
                  className="border border-rb-coffee/15 rounded-xl px-4 py-2.5"
                />
                <p className="col-span-2 text-xs text-rb-mocha">
                  This is a demo — no card is charged.
                </p>
              </motion.div>
            )}
          </Section>

          {/* Notes */}
          <Section title="Notes for the kitchen (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, requests…"
              className="w-full border border-rb-coffee/15 rounded-xl px-4 py-3 outline-none focus:border-rb-caramel min-h-[80px]"
            />
          </Section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 self-start bg-white border border-rb-coffee/10 rounded-2xl p-5 h-fit">
          <div className="font-rb_serif text-2xl mb-4 text-rb-coffee">Summary</div>
          <ul className="divide-y divide-rb-coffee/5 mb-4">
            {cart.map((c) => (
              <li key={c.id} className="py-2 flex justify-between text-sm">
                <span className="text-rb-mocha">
                  {c.name} <span className="text-rb-mocha/60">×{c.quantity}</span>
                </span>
                <span className="text-rb-coffee">
                  ${(c.price * c.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="text-sm space-y-1">
            <div className="flex justify-between text-rb-mocha">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-rb-mocha">
              <span>Delivery</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-rb-coffee text-base pt-2 border-t border-rb-coffee/10 mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full bg-rb-coffee text-rb-cream py-3 rounded-full font-medium hover:bg-rb-espresso transition disabled:opacity-60"
          >
            {busy ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}
          </button>
        </aside>
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-rb-coffee/10 rounded-2xl p-5">
      <div className="font-rb_serif text-lg mb-3 text-rb-coffee">{title}</div>
      {children}
    </div>
  )
}

function Choice({ active, onClick, icon, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-xl border-2 transition ${
        active
          ? 'border-rb-coffee bg-rb-cream/40'
          : 'border-rb-coffee/10 hover:border-rb-caramel/50'
      }`}
    >
      <div className="text-rb-coffee mb-1">{icon}</div>
      <div className="font-medium text-rb-coffee">{title}</div>
      <div className="text-xs text-rb-mocha">{sub}</div>
    </button>
  )
}
