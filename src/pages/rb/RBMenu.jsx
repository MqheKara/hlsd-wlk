import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useCart } from '../../context/CartContext.jsx'

export default function RBMenu() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const { getCart, addItem, updateQuantity, removeItem, cartTotal } = useCart()
  const cart = getCart('RB')

  useEffect(() => {
    api
      .get('/shops/RB/menu')
      .then(({ data }) => {
        setItems(data)
        const cats = ['All', ...new Set(data.map((i) => i.category))]
        setCategories(cats)
      })
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    active === 'All' ? items : items.filter((i) => i.category === active)

  const inCart = (id) => cart.find((c) => c.id === id)

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="font-rb_script text-3xl text-rb-mocha">today's menu</div>
        <h1 className="font-rb_serif text-5xl text-rb-coffee">All-day comfort</h1>
        <p className="text-rb-mocha mt-2">
          Pick up at our CBD shop or get it delivered around town.
        </p>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`relative px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              active === c
                ? 'text-rb-cream'
                : 'text-rb-coffee/70 hover:text-rb-coffee'
            }`}
          >
            {active === c && (
              <motion.div
                layoutId="rb-cat-pill"
                className="absolute inset-0 bg-rb-coffee rounded-full"
              />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Items */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-stone-100 h-72 shimmer" />
              ))
            : filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white border border-rb-coffee/10 rounded-2xl overflow-hidden hover:shadow-lg hover:border-rb-caramel/40 transition group"
                >
                  <div
                    className="h-44 bg-rb-cream relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-rb-coffee/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-rb-coffee text-xs px-2 py-1 rounded-full font-medium">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-rb_serif text-xl text-rb-coffee">
                        {item.name}
                      </h3>
                      <div className="font-medium text-rb-coffee whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-sm text-rb-mocha mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    {inCart(item.id) ? (
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              'RB',
                              null,
                              item.id,
                              inCart(item.id).quantity - 1,
                            )
                          }
                          className="w-8 h-8 rounded-full border border-rb-coffee/20 flex items-center justify-center hover:bg-rb-cream"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="font-medium w-6 text-center">
                          {inCart(item.id).quantity}
                        </div>
                        <button
                          onClick={() => addItem('RB', null, item)}
                          className="w-8 h-8 rounded-full bg-rb-coffee text-rb-cream flex items-center justify-center hover:bg-rb-espresso"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="ml-auto text-xs text-rb-mocha">In cart</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          addItem('RB', null, item)
                          toast.success(`${item.name} added`, { duration: 1200 })
                        }}
                        className="mt-4 w-full bg-rb-coffee text-rb-cream py-2 rounded-full text-sm hover:bg-rb-espresso transition flex items-center justify-center gap-2"
                      >
                        <Plus size={14} /> Add to cart
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Cart sidebar */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="bg-white border border-rb-coffee/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-rb-coffee/10 flex items-center gap-2">
              <ShoppingBag size={18} className="text-rb-coffee" />
              <div className="font-rb_serif text-xl">Your order</div>
            </div>
            {cart.length === 0 ? (
              <div className="p-6 text-sm text-rb-mocha">
                Your cart is empty. Add something to get started.
              </div>
            ) : (
              <>
                <ul className="max-h-72 overflow-auto divide-y divide-rb-coffee/5">
                  <AnimatePresence>
                    {cart.map((c) => (
                      <motion.li
                        key={c.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="px-5 py-3 flex items-center gap-3 text-sm"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-rb-coffee">
                            {c.name}
                          </div>
                          <div className="text-rb-mocha text-xs">
                            ${c.price.toFixed(2)} × {c.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity('RB', null, c.id, c.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full border border-rb-coffee/20 flex items-center justify-center hover:bg-rb-cream"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-5 text-center text-xs">
                            {c.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity('RB', null, c.id, c.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border border-rb-coffee/20 flex items-center justify-center hover:bg-rb-cream"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeItem('RB', null, c.id)}
                            className="ml-1 w-7 h-7 rounded-full text-rb-coffee/40 hover:text-rb-accent flex items-center justify-center"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="px-5 py-4 border-t border-rb-coffee/10 bg-rb-cream/30">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-rb-mocha">Subtotal</span>
                    <span className="font-medium text-rb-coffee">
                      ${cartTotal('RB').toFixed(2)}
                    </span>
                  </div>
                  <Link
                    to="/rb/checkout"
                    className="block text-center bg-rb-coffee text-rb-cream py-2.5 rounded-full font-medium hover:bg-rb-espresso transition"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
