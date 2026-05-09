import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ShoppingBag, Trash2, ArrowLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useCart } from '../../context/CartContext.jsx'
import { getSubShopTheme } from '../../themes'

export default function HWSubShop() {
  const { subShopCode } = useParams()
  const navigate = useNavigate()
  const theme = getSubShopTheme(subShopCode)
  const [items, setItems] = useState([])
  const [subShop, setSubShop] = useState(null)
  const [categories, setCategories] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const { getCart, addItem, updateQuantity, removeItem, cartTotal } = useCart()
  const cart = getCart('HW', subShopCode)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/shops/HW/menu?sub_shop=${subShopCode}`),
      api.get(`/shops/HW/sub-shops/${subShopCode}`),
    ])
      .then(([menuRes, shopRes]) => {
        setItems(menuRes.data)
        setSubShop(shopRes.data)
        const cats = ['All', ...new Set(menuRes.data.map((i) => i.category).filter(Boolean))]
        setCategories(cats)
        setActive('All')
      })
      .catch(() => toast.error('Failed to load shop'))
      .finally(() => setLoading(false))
  }, [subShopCode])

  if (!loading && !subShop) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <p>Shop not found.</p>
        <Link to="/hw" className="text-hw-terracotta hover:underline">
          ← Back to Hillside Walk
        </Link>
      </div>
    )
  }

  const filtered = active === 'All' ? items : items.filter((i) => i.category === active)
  const inCart = (id) => cart.find((c) => c.id === id)

  return (
    <div className={`min-h-screen ${theme.bgGradient} ${theme.text} ${theme.fontBody}`}>
      {/* Sub-shop hero */}
      <section className="relative overflow-hidden">
        <div className={`${theme.decorClass} absolute inset-0 opacity-40`} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <button
            onClick={() => navigate('/hw')}
            className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-6"
          >
            <ArrowLeft size={16} /> All sub-shops
          </button>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {subShop && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`uppercase tracking-[0.4em] text-xs ${theme.accent}`}>
                    Sub-shop · Hillside Walk
                  </div>
                  <h1 className={`${theme.fontDisplay} text-5xl md:text-7xl mt-2 leading-tight`}>
                    {subShop.name}
                  </h1>
                  <p className="text-lg mt-4 opacity-80 max-w-md">
                    {subShop.tagline}
                  </p>
                  <p className="opacity-70 max-w-md mt-2">
                    {subShop.description}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Theme-specific decorative panel */}
            <div className="hidden md:block">
              {subShopCode === 'sushi' && <SushiArt />}
              {subShopCode === 'beauty' && <BeautyArt />}
              {subShopCode === 'bakery' && <BakeryArt />}
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`relative px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                active === c ? '' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {active === c && (
                <motion.div
                  layoutId="hw-cat-pill"
                  className={`absolute inset-0 ${theme.accentBg} rounded-full`}
                />
              )}
              <span className={`relative ${active === c ? 'text-white' : ''}`}>
                {c}
              </span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
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
                    className={`${theme.cardBg} border ${theme.accentBorder}/20 rounded-2xl overflow-hidden hover:shadow-xl transition group`}
                  >
                    <div
                      className="h-44 relative overflow-hidden"
                      style={{
                        backgroundImage: `url(${item.image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                      {item.category && (
                        <div className={`absolute top-3 left-3 ${theme.chip} text-xs px-2 py-1 rounded-full font-medium`}>
                          {item.category}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className={`${theme.fontDisplay} text-xl ${theme.text}`}>
                          {item.name}
                        </h3>
                        <div className="font-medium whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <p className="text-sm opacity-70 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      {inCart(item.id) ? (
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity('HW', subShopCode, item.id, inCart(item.id).quantity - 1)
                            }
                            className={`w-8 h-8 rounded-full border ${theme.accentBorder}/30 flex items-center justify-center hover:bg-black/5`}
                          >
                            <Minus size={14} />
                          </button>
                          <div className="font-medium w-6 text-center">
                            {inCart(item.id).quantity}
                          </div>
                          <button
                            onClick={() => addItem('HW', subShopCode, item)}
                            className={`w-8 h-8 rounded-full ${theme.button} flex items-center justify-center`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            addItem('HW', subShopCode, item)
                            toast.success(`${item.name} added`, { duration: 1200 })
                          }}
                          className={`mt-4 w-full ${theme.button} py-2 rounded-full text-sm flex items-center justify-center gap-2`}
                        >
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
          </div>

          {/* Cart sidebar */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className={`${theme.cardBg} border ${theme.accentBorder}/20 rounded-2xl overflow-hidden`}>
              <div className={`px-5 py-4 border-b border-current/10 flex items-center gap-2`}>
                <ShoppingBag size={18} />
                <div className={`${theme.fontDisplay} text-xl`}>Your basket</div>
              </div>
              {cart.length === 0 ? (
                <div className="p-6 text-sm opacity-70">
                  Empty for now. Tap any item to add.
                </div>
              ) : (
                <>
                  <ul className="max-h-72 overflow-auto divide-y divide-current/5">
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
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs opacity-70">
                              ${c.price.toFixed(2)} × {c.quantity}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateQuantity('HW', subShopCode, c.id, c.quantity - 1)
                              }
                              className={`w-7 h-7 rounded-full border ${theme.accentBorder}/30 flex items-center justify-center hover:bg-black/5`}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center text-xs">{c.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity('HW', subShopCode, c.id, c.quantity + 1)
                              }
                              className={`w-7 h-7 rounded-full border ${theme.accentBorder}/30 flex items-center justify-center hover:bg-black/5`}
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              onClick={() => removeItem('HW', subShopCode, c.id)}
                              className="ml-1 w-7 h-7 rounded-full opacity-50 hover:opacity-100 flex items-center justify-center"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <div className="px-5 py-4 border-t border-current/10 bg-black/5">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="opacity-70">Subtotal</span>
                      <span className="font-medium">
                        ${cartTotal('HW', subShopCode).toFixed(2)}
                      </span>
                    </div>
                    <Link
                      to={`/hw/checkout/${subShopCode}`}
                      className={`block text-center ${theme.button} py-2.5 rounded-full font-medium`}
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

// Decorative theme-specific art panels
function SushiArt() {
  return (
    <div className="relative h-64 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-[3px] border-sushi-vermillion" />
      </div>
      <div className="relative font-sushi_serif text-8xl text-sushi-ink">寿司</div>
      {/* Brush stroke */}
      <svg className="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0,30 Q100,10 200,30 T400,30" stroke="#0E0E0E" strokeWidth="3" fill="none" opacity="0.6" />
      </svg>
    </div>
  )
}

function BeautyArt() {
  return (
    <div className="relative h-64 flex items-center justify-center beauty-iridescent rounded-3xl">
      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <Sparkles
          key={i}
          size={16 + (i % 3) * 6}
          className="absolute text-beauty-gold"
          style={{
            top: `${(i * 17) % 90}%`,
            left: `${(i * 23) % 90}%`,
            animation: `sparkle 2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <div className="font-beauty_display italic text-7xl text-beauty-plum z-10">
        bloom
      </div>
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function BakeryArt() {
  return (
    <div className="relative h-64 bakery-sprinkles rounded-3xl flex items-center justify-center">
      {/* Floating circles representing icing */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${20 + (i % 3) * 10}px`,
            height: `${20 + (i % 3) * 10}px`,
            background: i % 2 ? '#F4A6A6' : '#B6E3D4',
            top: `${(i * 17) % 70 + 10}%`,
            left: `${(i * 19) % 70 + 10}%`,
            animation: `float 6s ease-in-out ${i * 0.5}s infinite`,
            opacity: 0.8,
          }}
        />
      ))}
      <div className="font-bakery_display text-7xl text-bakery-chocolate z-10">
        baked
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
