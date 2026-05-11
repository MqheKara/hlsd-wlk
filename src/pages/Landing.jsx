import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, Trees, ArrowRight, LogIn, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'

export default function Landing() {
  const { user, logout } = useAuth()
  const [hovered, setHovered] = useState(null) // 'rb' | 'hw' | null

  return (
    <div className="min-h-screen w-full overflow-hidden bg-stone-900 relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 md:px-10 py-5 flex items-center justify-between text-white">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-lg tracking-[0.3em]"
        >
          BULAWAYO · 2026
        </motion.div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-white/70">
                Hi, {user.name.split(' ')[0]}
              </span>
              {(user.role === 'rb_admin' ||
                user.role === 'hw_admin' ||
                user.role === 'superuser') && (
                <Link
                  to="/admin"
                  className="text-xs uppercase tracking-widest border border-white/30 px-3 py-1.5 rounded-full hover:bg-white hover:text-stone-900 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs uppercase tracking-widest text-white/70 hover:text-white transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 text-xs uppercase tracking-widest border border-white/30 px-3 py-1.5 rounded-full hover:bg-white hover:text-stone-900 transition"
            >
              <LogIn size={14} /> Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* RB side */}
        <motion.div
          onHoverStart={() => setHovered('rb')}
          onHoverEnd={() => setHovered(null)}
          animate={{
            flex: hovered === 'rb' ? 1.4 : hovered === 'hw' ? 0.6 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative flex-1 min-h-[60vh] md:min-h-screen overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(59,36,23,0.85), rgba(92,58,33,0.7)), url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* steam particles */}
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute w-2 h-12 rounded-full bg-white/20 blur-sm"
                style={{
                  left: `${(i - 1.5) * 14}px`,
                  animation: `steam 3s ease-in-out ${i * 0.5}s infinite`,
                }}
              />
            ))}
          </div>

          {/* "Two doors." anchored to RB's outer (left) edge
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-20 md:top-[18%] left-6 md:left-12 lg:left-20 z-10 pointer-events-none"
          >
            <div className="text-rb-cream/50 text-[10px] uppercase tracking-[0.4em] mb-2">
              door one
            </div>
            <div className="text-rb-cream font-rb_serif italic text-3xl md:text-5xl lg:text-6xl drop-shadow-md leading-none">
              Two doors.
            </div>
          </motion.div> */}

          <div className="relative h-full flex flex-col justify-end p-8 md:p-8 lg:p-10 text-rb-cream">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Coffee className="w-10 h-10 mb-4 opacity-80" />
              <div className="font-rb_script text-3xl md:text-4xl text-rb-caramel">
                est. in town
              </div>
              <h1 className="font-rb_serif text-5xl md:text-7xl lg:text-8xl leading-none mt-2">
                Roasted
                <br />
                <em className="not-italic font-light">Bean</em>
              </h1>
              <p className="font-rb_sans text-base md:text-lg max-w-md mt-6 text-rb-cream/80">
                Freshly roasted coffee, intimate tables, and seasonal lunch in
                Bulawayo's CBD. Cozy. Quiet. Quality.
              </p>
              <Link
                to="/rb"
                className="group mt-8 inline-flex items-center gap-3 bg-rb-cream text-rb-coffee px-7 py-3.5 rounded-full font-rb_sans font-medium tracking-wide hover:bg-white transition-all duration-300 hover:gap-5"
              >
                Step inside
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-white/20 self-stretch" />

        {/* HW side */}
        <motion.div
          onHoverStart={() => setHovered('hw')}
          onHoverEnd={() => setHovered(null)}
          animate={{
            flex: hovered === 'hw' ? 1.4 : hovered === 'rb' ? 0.6 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative flex-1 min-h-[60vh] md:min-h-screen overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(47,62,42,0.7), rgba(92,107,74,0.6)), url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* leaf particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl opacity-60"
                style={{
                  left: `${(i * 13) % 100}%`,
                  top: '-5%',
                  animation: `fall ${10 + (i % 4) * 2}s linear ${i * 1.5}s infinite`,
                }}
              >
                🍃
              </span>
            ))}
          </div>

          {/* "One destination." anchored to HW's outer (right) edge */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-20 md:top-[18%] right-6 md:right-12 lg:right-20 z-10 pointer-events-none text-right"
          >
            <div className="text-hw-cream/60 text-[10px] uppercase tracking-[0.4em] mb-2">
              door two
            </div>
            <div className="text-hw-cream font-hw_display italic text-3xl md:text-5xl lg:text-6xl drop-shadow-md leading-none">
              One destination.
            </div>
          </motion.div> */}

          <div className="relative h-full flex flex-col justify-end p-8 md:p-8lg:p-10 text-hw-cream">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Trees className="w-10 h-10 mb-4 opacity-80" />
              <div className="font-hw_sans uppercase text-sm tracking-[0.4em] text-hw-terracotta">
                Hillside · Bulawayo
              </div>
              <h1 className="font-hw_display text-5xl md:text-7xl lg:text-8xl leading-none mt-2 font-light">
                Hillside
                <br />
                <span className="italic font-medium">Walk</span>
              </h1>
              <p className="font-hw_sans text-base md:text-lg max-w-md mt-6 text-hw-cream/85">
                A gathering destination. Outdoor dining, poolside events, and a
                handful of intimate boutiques tucked inside.
              </p>
              <Link
                to="/hw"
                className="group mt-8 inline-flex items-center gap-3 bg-hw-terracotta text-hw-cream px-7 py-3.5 rounded-full font-hw_sans font-medium tracking-wide hover:bg-hw-cream hover:text-hw-forest transition-all duration-300 hover:gap-2"
              >
                Take a walk
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0.7; }
          50% { transform: translateY(-30px) scaleX(1.4); opacity: 0.4; }
          100% { transform: translateY(-60px) scaleX(2); opacity: 0; }
        }
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
