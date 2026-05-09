import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, ArrowRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/client'

export default function RBBooking() {
  const navigate = useNavigate()
  const [partySize, setPartySize] = useState(2)
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  const tooLarge = partySize > 6

  const submit = async (e) => {
    e.preventDefault()
    if (!date) {
      toast.error('Pick a date and time')
      return
    }
    if (tooLarge) {
      toast.error('Tables at Roasted Bean seat up to 6')
      return
    }
    setBusy(true)
    try {
      await api.post('/bookings', {
        shop_code: 'RB',
        party_size: partySize,
        booking_date: date,
        notes,
      })
      toast.success('Table booked')
      navigate('/rb/account')
    } catch (err) {
      toast.error(err.userMessage || 'Could not book')
    } finally {
      setBusy(false)
    }
  }

  // Compute min datetime as now + 1 hour
  const now = new Date()
  now.setHours(now.getHours() + 1)
  const minDate = now.toISOString().slice(0, 16)

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="font-rb_script text-3xl text-rb-mocha">come visit</div>
          <h1 className="font-rb_serif text-5xl text-rb-coffee leading-tight">
            Reserve a quiet table
          </h1>
          <p className="text-rb-mocha mt-3 max-w-md">
            We have a small dining room — tables of 2 to 6. Booking ahead
            guarantees a corner during peak hours.
          </p>

          <form onSubmit={submit} className="mt-8 bg-white border border-rb-coffee/10 rounded-2xl p-6 space-y-5">
            <div>
              <label className="text-sm text-rb-mocha mb-1.5 block flex items-center gap-2">
                <Users size={14} /> Party size
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setPartySize(n)}
                    className={`w-11 h-11 rounded-full border-2 font-medium transition ${
                      partySize === n
                        ? n > 6
                          ? 'border-rb-accent bg-rb-accent text-rb-cream'
                          : 'border-rb-coffee bg-rb-coffee text-rb-cream'
                        : 'border-rb-coffee/15 text-rb-coffee hover:border-rb-caramel'
                    }`}
                  >
                    {n === 7 ? '7+' : n}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {tooLarge && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-rb-cream/50 border border-rb-accent/30 rounded-xl p-4 text-sm"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-rb-accent shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-medium text-rb-coffee">
                        That's a bit big for our cafe.
                      </div>
                      <p className="text-rb-mocha mt-1">
                        We seat up to 6. For larger groups, our sister venue at
                        Hillside Walk has outdoor tables and a poolside area
                        ready for you.
                      </p>
                      <Link
                        to="/hw/book"
                        className="inline-flex items-center gap-2 mt-3 text-rb-accent hover:underline text-sm"
                      >
                        Book at Hillside Walk
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-sm text-rb-mocha mb-1.5 block flex items-center gap-2">
                <Calendar size={14} /> Date and time
              </label>
              <input
                type="datetime-local"
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-rb-coffee/15 rounded-xl px-4 py-3 outline-none focus:border-rb-caramel"
                required
              />
            </div>

            <div>
              <label className="text-sm text-rb-mocha mb-1.5 block">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Birthday? Allergies? A request?"
                className="w-full border border-rb-coffee/15 rounded-xl px-4 py-3 outline-none focus:border-rb-caramel min-h-[80px]"
              />
            </div>

            <button
              type="submit"
              disabled={busy || tooLarge}
              className="w-full bg-rb-coffee text-rb-cream py-3 rounded-full font-medium hover:bg-rb-espresso transition disabled:opacity-60"
            >
              {busy ? 'Booking…' : 'Reserve table'}
            </button>
          </form>
        </div>

        <div className="hidden lg:block">
          <div
            className="rounded-3xl h-[520px] relative overflow-hidden"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-rb-coffee/70 via-rb-coffee/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-rb-cream">
              <div className="font-rb_script text-2xl text-rb-caramel">small enough to know you</div>
              <div className="font-rb_serif text-2xl mt-1">
                "The corner table by the window — that one's mine."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
