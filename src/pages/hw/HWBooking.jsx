import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Users,
  Sun,
  Home,
  Waves,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/client'

// Quick-pick time presets that fill in both Start and End in one tap
const presets = [
  { label: 'Brunch', start: '10:00', end: '13:00' },
  { label: 'Lunch', start: '12:00', end: '15:00' },
  { label: 'Sunset', start: '17:00', end: '20:00' },
  { label: 'Evening', start: '18:30', end: '22:00' },
  { label: 'Late', start: '20:00', end: '23:30' },
]

const venueOptions = [
  { value: 'indoor', label: 'Indoor', icon: <Home size={16} /> },
  { value: 'outdoor', label: 'Garden patio', icon: <Sun size={16} /> },
  { value: 'pool', label: 'Pool deck', icon: <Waves size={16} /> },
]

export default function HWBooking() {
  const navigate = useNavigate()

  // Mode: 'table' (a normal seating reservation) or 'event' (a private hire with time range)
  const [mode, setMode] = useState('table')

  // Shared
  const [partySize, setPartySize] = useState(2)
  const [tableType, setTableType] = useState('outdoor')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  // Table-mode (single datetime)
  const [tableDateTime, setTableDateTime] = useState('')

  // Event-mode (date + start time + end time)
  const [eventDate, setEventDate] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')

  // Helpful min values
  const now = new Date()
  now.setHours(now.getHours() + 1)
  const minDateTime = now.toISOString().slice(0, 16)
  const today = new Date().toISOString().slice(0, 10)

  const switchMode = (m) => {
    setMode(m)
    if (m === 'event') {
      if (partySize < 10) setPartySize(20)
      setTableType('pool')
    } else {
      if (partySize > 10) setPartySize(2)
      setTableType('outdoor')
    }
  }

  const applyPreset = (p) => {
    setEventStartTime(p.start)
    setEventEndTime(p.end)
  }

  // Live duration in hours for the event-mode time range
  const duration = useMemo(() => {
    if (mode !== 'event' || !eventDate || !eventStartTime || !eventEndTime) return 0
    const start = new Date(`${eventDate}T${eventStartTime}`)
    const end = new Date(`${eventDate}T${eventEndTime}`)
    if (end <= start) end.setDate(end.getDate() + 1) // overnight
    return (end - start) / (1000 * 60 * 60)
  }, [mode, eventDate, eventStartTime, eventEndTime])

  // Smart suggestion based on party size
  const venueHint = useMemo(() => {
    if (partySize <= 6) return 'Fits any of our tables.'
    if (partySize <= 18) return 'Garden patio is best for this size.'
    if (partySize <= 40) return 'Pool deck recommended.'
    return "We'll need to coordinate a full-venue booking — please add a note."
  }, [partySize])

  const submit = async (e) => {
    e.preventDefault()

    let booking_date, duration_hours
    if (mode === 'table') {
      if (!tableDateTime) {
        toast.error('Pick a date and time')
        return
      }
      booking_date = tableDateTime
      duration_hours = 2
    } else {
      if (!eventDate) {
        toast.error('Pick a date')
        return
      }
      if (!eventStartTime || !eventEndTime) {
        toast.error('Pick a start and end time')
        return
      }
      if (duration <= 0) {
        toast.error('End time must be after start time')
        return
      }
      booking_date = `${eventDate}T${eventStartTime}`
      duration_hours = duration
    }

    setBusy(true)
    try {
      await api.post('/bookings', {
        shop_code: 'HW',
        booking_type: mode,
        party_size: partySize,
        booking_date,
        duration_hours,
        table_type: tableType,
        notes,
      })
      toast.success(mode === 'event' ? 'Event booked' : 'Table booked')
      navigate('/hw/account')
    } catch (err) {
      toast.error(err.userMessage || 'Could not book')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="text-hw-terracotta uppercase tracking-[0.4em] text-xs">
            Reserve at
          </div>
          <h1 className="font-hw_display text-5xl md:text-6xl text-hw-forest leading-tight mt-2 font-light">
            Hillside <span className="italic">Walk</span>
          </h1>
          <p className="text-hw-stone mt-3 max-w-md">
            Whether it's dinner for two or a poolside party for forty — we'll
            set the table.
          </p>

          {/* Mode toggle */}
          <div className="mt-6 inline-grid grid-cols-2 bg-white/70 p-1 rounded-full text-sm border border-hw-forest/15">
            {[
              ['table', 'Table reservation'],
              ['event', 'Event booking'],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => switchMode(k)}
                className={`relative px-5 py-2.5 rounded-full transition ${
                  mode === k ? '' : 'text-hw-stone hover:text-hw-forest'
                }`}
              >
                {mode === k && (
                  <motion.div
                    layoutId="hw-bk-tab"
                    className="absolute inset-0 bg-hw-forest rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative ${mode === k ? 'text-hw-cream' : ''}`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            className="mt-6 bg-white border border-hw-forest/10 rounded-2xl p-6 space-y-5"
          >
            {/* Party size */}
            <div>
              <label className="text-sm text-hw-stone mb-1.5 flex items-center gap-2">
                <Users size={14} />{' '}
                {mode === 'event' ? 'Number of guests' : 'Party size'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                  className="w-10 h-10 rounded-full border border-hw-forest/15 flex items-center justify-center hover:bg-hw-sand"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={mode === 'event' ? 100 : 40}
                  value={partySize}
                  onChange={(e) =>
                    setPartySize(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 text-center text-lg font-medium border border-hw-forest/15 rounded-xl px-3 py-2 outline-none focus:border-hw-terracotta"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPartySize((n) =>
                      Math.min(mode === 'event' ? 100 : 40, n + 1),
                    )
                  }
                  className="w-10 h-10 rounded-full border border-hw-forest/15 flex items-center justify-center hover:bg-hw-sand"
                >
                  +
                </button>
                {mode === 'event' && (
                  <div className="flex gap-1.5 ml-1 flex-wrap">
                    {[20, 40, 60].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setPartySize(n)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition ${
                          partySize === n
                            ? 'bg-hw-terracotta text-hw-cream border-hw-terracotta'
                            : 'border-hw-forest/15 text-hw-stone hover:border-hw-terracotta/40'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-hw-stone mt-1.5">{venueHint}</p>
            </div>

            {/* Venue */}
            <div>
              <label className="text-sm text-hw-stone mb-1.5 block">
                {mode === 'event' ? 'Venue' : 'Where would you like to sit?'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {venueOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setTableType(opt.value)}
                    className={`p-3 rounded-xl border-2 text-sm flex flex-col items-center gap-1 transition ${
                      tableType === opt.value
                        ? 'border-hw-terracotta bg-hw-sand/40 text-hw-forest'
                        : 'border-hw-forest/10 text-hw-stone hover:border-hw-terracotta/40'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* When — different controls per mode */}
            <AnimatePresence mode="wait">
              {mode === 'table' ? (
                <motion.div
                  key="table-when"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-sm text-hw-stone mb-1.5 flex items-center gap-2">
                    <Calendar size={14} /> Date and time
                  </label>
                  <input
                    type="datetime-local"
                    value={tableDateTime}
                    min={minDateTime}
                    onChange={(e) => setTableDateTime(e.target.value)}
                    className="w-full border border-hw-forest/15 rounded-xl px-4 py-3 outline-none focus:border-hw-terracotta"
                    required
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="event-when"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Date */}
                  <div>
                    <label className="text-sm text-hw-stone mb-1.5 flex items-center gap-2">
                      <Calendar size={14} /> Event date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      min={today}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full border border-hw-forest/15 rounded-xl px-4 py-3 outline-none focus:border-hw-terracotta"
                      required
                    />
                  </div>

                  {/* Quick-pick presets */}
                  <div>
                    <label className="text-sm text-hw-stone mb-1.5 flex items-center gap-2">
                      <Sparkles size={14} /> Quick pick
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((p) => {
                        const active =
                          eventStartTime === p.start && eventEndTime === p.end
                        return (
                          <button
                            type="button"
                            key={p.label}
                            onClick={() => applyPreset(p)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition ${
                              active
                                ? 'bg-hw-forest text-hw-cream border-hw-forest'
                                : 'border-hw-forest/15 text-hw-stone hover:border-hw-terracotta/40 bg-white'
                            }`}
                          >
                            <span className="font-medium">{p.label}</span>{' '}
                            <span className="opacity-70">
                              · {fmtTime(p.start)}–{fmtTime(p.end)}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Start / end times */}
                  <div>
                    <label className="text-sm text-hw-stone mb-1.5 flex items-center gap-2">
                      <Clock size={14} /> Start and end time
                    </label>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <input
                        type="time"
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        step={900}
                        className="border border-hw-forest/15 rounded-xl px-3 py-3 outline-none focus:border-hw-terracotta text-center"
                        required
                      />
                      <ArrowRight size={16} className="text-hw-stone" />
                      <input
                        type="time"
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        step={900}
                        className="border border-hw-forest/15 rounded-xl px-3 py-3 outline-none focus:border-hw-terracotta text-center"
                        required
                      />
                    </div>
                    <AnimatePresence>
                      {duration > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 inline-flex items-center gap-2 text-xs bg-hw-terracotta/10 text-hw-terracotta px-3 py-1 rounded-full"
                        >
                          <Clock size={12} /> Duration:{' '}
                          {duration % 1 === 0
                            ? duration
                            : duration.toFixed(2).replace(/\.?0+$/, '')}{' '}
                          hours
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notes */}
            <div>
              <label className="text-sm text-hw-stone mb-1.5 block">
                {mode === 'event'
                  ? 'Tell us about the event (occasion, decor, food preferences)'
                  : 'Notes (optional)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  mode === 'event'
                    ? "Birthday, baby shower, corporate dinner…"
                    : 'Allergies, special requests…'
                }
                className="w-full border border-hw-forest/15 rounded-xl px-4 py-3 outline-none focus:border-hw-terracotta min-h-[80px]"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-hw-terracotta text-hw-cream py-3 rounded-full font-medium hover:bg-hw-forest transition disabled:opacity-60"
            >
              {busy
                ? 'Booking…'
                : mode === 'event'
                  ? 'Request event booking'
                  : 'Reserve table'}
            </button>

            {mode === 'event' && (
              <p className="text-xs text-hw-stone text-center">
                Our events team will reach out shortly to confirm details.
              </p>
            )}
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden lg:block sticky top-28"
        >
          <div className="rounded-3xl h-[560px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${
                    mode === 'event'
                      ? 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&auto=format&fit=crop'
                      : 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop'
                  })`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-hw-forest/70 via-hw-forest/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-hw-cream">
              <div className="text-hw-terracotta uppercase text-xs tracking-[0.4em] mb-2">
                {mode === 'event' ? 'For your event' : 'A note from the team'}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-hw_display italic text-2xl"
                >
                  {mode === 'event'
                    ? '"Our pool deck holds 40, the garden patio 18 — and the kitchen plates an entire menu just for you."'
                    : '"Our garden patio is open to sunset, the pool deck for warm evenings."'}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function fmtTime(t) {
  // Convert "13:00" -> "1pm", "10:30" -> "10:30am"
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hh = ((h + 11) % 12) + 1
  return m === 0 ? `${hh}${suffix}` : `${hh}:${String(m).padStart(2, '0')}${suffix}`
}
