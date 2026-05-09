import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Sun, Waves } from 'lucide-react'

const subShopMeta = [
  {
    code: 'sushi',
    name: 'Kazu Sushi Bar',
    tagline: 'Hand-rolled. Hillside-fresh.',
    bg: 'bg-sushi-paper',
    accent: 'text-sushi-vermillion',
    border: 'border-sushi-ink/20',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&auto=format&fit=crop',
    fontDisplay: 'font-sushi_serif',
  },
  {
    code: 'beauty',
    name: 'Petal & Polish',
    tagline: 'Beauty rituals, reimagined.',
    bg: 'bg-beauty-cream',
    accent: 'text-beauty-gold',
    border: 'border-beauty-gold/30',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&auto=format&fit=crop',
    fontDisplay: 'font-beauty_display italic',
  },
  {
    code: 'bakery',
    name: 'Sugar Hill Bakery',
    tagline: 'Sweet things made by hand.',
    bg: 'bg-bakery-buttercream',
    accent: 'text-bakery-strawberry',
    border: 'border-bakery-strawberry/30',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&auto=format&fit=crop',
    fontDisplay: 'font-bakery_display',
  },
]

export default function HWHome() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(120deg, rgba(47,62,42,0.65), rgba(92,107,74,0.45) 60%, rgba(232,213,183,0.2)), url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Floating leaves */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-50"
              style={{
                left: `${(i * 11) % 100}%`,
                top: '-5%',
                animation: `fall ${12 + (i % 4) * 2}s linear ${i * 1.3}s infinite`,
              }}
            >
              🍃
            </span>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-36 text-hw-cream">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-hw-terracotta uppercase tracking-[0.4em] text-xs mb-4">
              The Hillside · Est. 2024
            </div>
            <h1 className="font-hw_display text-5xl md:text-7xl lg:text-8xl leading-[0.95] font-light max-w-3xl">
              A place to{' '}
              <span className="italic font-medium">linger.</span>
            </h1>
            <p className="max-w-xl mt-6 text-hw-cream/85 text-lg">
              An open courtyard restaurant, a poolside event garden, and three
              boutique shops sharing one roof. Make a day of it.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/hw/book"
                className="group bg-hw-terracotta text-hw-cream px-6 py-3 rounded-full font-medium hover:bg-hw-cream hover:text-hw-forest transition flex items-center gap-2"
              >
                Book a table
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </Link>
              <a
                href="#sub-shops"
                className="border border-hw-cream/40 text-hw-cream px-6 py-3 rounded-full hover:bg-hw-cream/10 transition"
              >
                Browse the shops
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features ribbon */}
      <section className="bg-hw-sand">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-hw-forest/10">
          {[
            {
              icon: <Sun size={20} />,
              title: 'Outdoor dining',
              body: 'Shaded patio with views over the gardens.',
            },
            {
              icon: <Waves size={20} />,
              title: 'Poolside events',
              body: 'A heated pool deck for parties up to 40 guests.',
            },
            {
              icon: <MapPin size={20} />,
              title: 'Three boutiques',
              body: 'Sushi bar, beauty parlor, and patisserie all on-site.',
            },
          ].map((f) => (
            <div key={f.title} className="px-2 md:px-6 py-4 md:py-2">
              <div className="text-hw-terracotta mb-2">{f.icon}</div>
              <div className="font-hw_display text-xl text-hw-forest">{f.title}</div>
              <div className="text-sm text-hw-stone mt-1">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-shops */}
      <section id="sub-shops" className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="mb-10">
          <div className="text-hw-terracotta uppercase tracking-[0.4em] text-xs mb-2">
            Inside the walk
          </div>
          <h2 className="font-hw_display text-4xl md:text-5xl text-hw-forest font-light">
            Three small worlds.
          </h2>
          <p className="text-hw-stone mt-2 max-w-xl">
            Each with its own kitchen, atmosphere, and order book — but all
            under one roof. Pick where you want to start.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {subShopMeta.map((s, i) => (
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/hw/shop/${s.code}`}
                className={`block ${s.bg} ${s.border} border rounded-3xl overflow-hidden hover:shadow-xl transition group`}
              >
                <div
                  className="h-56 relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${s.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                </div>
                <div className="p-6">
                  <h3 className={`${s.fontDisplay} text-3xl text-hw-forest`}>
                    {s.name}
                  </h3>
                  <p className={`${s.accent} mt-1 text-sm uppercase tracking-widest`}>
                    {s.tagline}
                  </p>
                  <div className="flex items-center gap-2 mt-5 text-hw-forest text-sm group-hover:gap-3 transition-all">
                    Step inside
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing image */}
      <section className="px-5 md:px-8 pb-20">
        <div
          className="max-w-7xl mx-auto rounded-3xl h-72 md:h-96 relative overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(47,62,42,0.5), rgba(0,0,0,0.1)), url(https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1600&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-hw-cream text-center">
            <div>
              <div className="font-hw_display italic text-3xl md:text-5xl">
                Stay a while.
              </div>
              <Link
                to="/hw/book"
                className="inline-flex items-center gap-2 mt-5 bg-hw-terracotta text-hw-cream px-6 py-2.5 rounded-full hover:bg-hw-cream hover:text-hw-forest transition"
              >
                Reserve a table
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
