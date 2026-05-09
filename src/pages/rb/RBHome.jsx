import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, Utensils, Truck, Users, ArrowRight } from 'lucide-react'

export default function RBHome() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(120deg, rgba(59,36,23,0.78), rgba(92,58,33,0.55) 60%, rgba(201,168,124,0.25)), url(https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1800&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32 text-rb-cream">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-rb_script text-3xl text-rb-caramel mb-3">
              hand-roasted, hand-poured
            </div>
            <h1 className="font-rb_serif text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              Slow coffee.
              <br />
              <em className="font-light">Quiet corners.</em>
            </h1>
            <p className="max-w-xl mt-6 text-rb-cream/80 text-lg">
              A small in-town cafe in Bulawayo CBD. We roast in-house, plate
              honest seasonal lunches, and keep the tables small enough for real
              conversation.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/rb/menu"
                className="group bg-rb-cream text-rb-coffee px-6 py-3 rounded-full font-medium hover:bg-white transition flex items-center gap-2"
              >
                Order online
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </Link>
              <Link
                to="/rb/book"
                className="border border-rb-cream/40 text-rb-cream px-6 py-3 rounded-full hover:bg-rb-cream/10 transition"
              >
                Reserve a table
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Steam decoration */}
        <div className="absolute right-10 bottom-10 hidden md:block opacity-50">
          <svg width="60" height="80" viewBox="0 0 60 80">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${10 + i * 18} 70 q-5 -15 5 -25 t-5 -25`}
                stroke="white"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
                style={{ animation: `steam 3s ease-in-out ${i * 0.7}s infinite` }}
              />
            ))}
          </svg>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center mb-12">
          <div className="font-rb_script text-2xl text-rb-mocha">what we do</div>
          <h2 className="font-rb_serif text-4xl md:text-5xl text-rb-coffee">
            Small cafe, full service
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: <Coffee />,
              title: 'House-roasted coffee',
              body: 'Single origin and seasonal blends roasted weekly in our kitchen.',
            },
            {
              icon: <Utensils />,
              title: 'Lunch menu',
              body: 'Pastries, sandwiches, salads, and a daily soup. Simple and honest.',
            },
            {
              icon: <Users />,
              title: 'Intimate tables',
              body: 'Tables of 2 to 6. Reserve ahead — it fills up at lunch.',
            },
            {
              icon: <Truck />,
              title: 'Delivery in town',
              body: 'We deliver across Bulawayo CBD. Order online for pickup or doorstep.',
            },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-rb-coffee/10 rounded-2xl p-6 hover:border-rb-caramel transition"
            >
              <div className="w-11 h-11 rounded-full bg-rb-cream flex items-center justify-center text-rb-coffee mb-4">
                {s.icon}
              </div>
              <div className="font-rb_serif text-xl text-rb-coffee mb-1">
                {s.title}
              </div>
              <div className="text-sm text-rb-mocha">{s.body}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote band */}
      <section className="bg-rb-cream rb-grain">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-20 text-center">
          <div className="font-rb_script text-3xl text-rb-mocha mb-2">— a regular</div>
          <div className="font-rb_serif text-2xl md:text-3xl italic text-rb-coffee leading-snug">
            "It's the kind of place where the barista
            <br />
            already knows your order on Tuesday."
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-8">
        <div
          className="rounded-3xl overflow-hidden relative h-72 md:h-96 group"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(59,36,23,0.6), rgba(0,0,0,0.1)), url(https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-rb-cream">
            <div className="font-rb_serif text-3xl mb-2">Order online</div>
            <div className="text-rb-cream/80 mb-4">Pickup or delivery in town.</div>
            <Link
              to="/rb/menu"
              className="self-start bg-rb-cream text-rb-coffee px-5 py-2 rounded-full text-sm group-hover:bg-white transition"
            >
              See the menu →
            </Link>
          </div>
        </div>
        <div
          className="rounded-3xl overflow-hidden relative h-72 md:h-96 group"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(59,36,23,0.6), rgba(0,0,0,0.1)), url(https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-rb-cream">
            <div className="font-rb_serif text-3xl mb-2">Reserve a table</div>
            <div className="text-rb-cream/80 mb-4">
              Tables for up to 6. Larger groups → Hillside Walk.
            </div>
            <Link
              to="/rb/book"
              className="self-start bg-rb-cream text-rb-coffee px-5 py-2 rounded-full text-sm group-hover:bg-white transition"
            >
              Book a table →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes steam {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
