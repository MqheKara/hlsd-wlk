import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminMenu() {
  const { user } = useAuth()
  const [shopCode, setShopCode] = useState(
    user?.role === 'rb_admin' ? 'RB' : user?.role === 'hw_admin' ? 'HW' : 'RB'
  )
  const [items, setItems] = useState([])
  const [subShops, setSubShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {id...} = edit

  const load = (code) => {
    setLoading(true)
    Promise.all([
      api.get(`/shops/${code}/menu`),
      api.get(`/shops/${code}/sub-shops`),
    ])
      .then(([m, s]) => {
        setItems(m.data)
        setSubShops(s.data)
      })
      .catch(() => toast.error('Could not load menu'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(shopCode)
  }, [shopCode])

  const save = async (form) => {
    try {
      if (form.id) {
        const { data } = await api.put(`/shops/${shopCode}/menu/${form.id}`, form)
        setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)))
        toast.success('Saved')
      } else {
        const { data } = await api.post(`/shops/${shopCode}/menu`, form)
        setItems((prev) => [...prev, data])
        toast.success('Added')
      }
      setEditing(null)
    } catch (err) {
      toast.error(err.userMessage || 'Could not save')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(`/shops/${shopCode}/menu/${id}`)
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success('Deleted')
    } catch (err) {
      toast.error(err.userMessage || 'Could not delete')
    }
  }

  const toggleAvail = async (item) => {
    try {
      const { data } = await api.put(`/shops/${shopCode}/menu/${item.id}`, {
        available: !item.available,
      })
      setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)))
    } catch (err) {
      toast.error(err.userMessage || 'Could not update')
    }
  }

  const getSubShopName = (id) =>
    id ? subShops.find((s) => s.id === id)?.name || `#${id}` : 'Main'

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">Menu</h1>
          <p className="text-stone-500">
            Manage what customers see and order.
          </p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-stone-700"
        >
          <Plus size={16} /> New item
        </button>
      </div>

      {user?.role === 'superuser' && (
        <div className="mb-5 bg-white rounded-full p-1 inline-flex text-sm border border-stone-200">
          {['RB', 'HW'].map((c) => (
            <button
              key={c}
              onClick={() => setShopCode(c)}
              className={`px-4 py-1.5 rounded-full transition ${
                shopCode === c ? 'bg-stone-900 text-white' : 'text-stone-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-2xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <motion.div
              key={it.id}
              layout
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col"
            >
              <div
                className="h-32 bg-stone-100 relative"
                style={{
                  backgroundImage: it.image_url ? `url(${it.image_url})` : '',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute top-3 left-3 flex gap-1">
                  <span className="bg-white/90 text-xs px-2 py-0.5 rounded-full text-stone-700">
                    {getSubShopName(it.sub_shop_id)}
                  </span>
                  {it.category && (
                    <span className="bg-white/90 text-xs px-2 py-0.5 rounded-full text-stone-700">
                      {it.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold text-stone-900">{it.name}</div>
                  <div className="font-medium text-stone-900">${it.price.toFixed(2)}</div>
                </div>
                {it.description && (
                  <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                    {it.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={it.available}
                      onChange={() => toggleAvail(it)}
                    />
                    Available
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(it)}
                      className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(it.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing !== null && (
          <ItemModal
            item={editing}
            subShops={subShops}
            onClose={() => setEditing(null)}
            onSave={save}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ItemModal({ item, subShops, onClose, onSave }) {
  const [form, setForm] = useState({
    id: item.id || null,
    name: item.name || '',
    description: item.description || '',
    price: item.price || 0,
    category: item.category || '',
    image_url: item.image_url || '',
    available: item.available ?? true,
    sub_shop_id: item.sub_shop_id || null,
  })

  const update = (k) => (e) => {
    const v = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e
    setForm((f) => ({ ...f, [k]: v }))
  }

  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      sub_shop_id: form.sub_shop_id ? parseInt(form.sub_shop_id) : null,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-stone-900">
            {form.id ? 'Edit item' : 'New item'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Name" required value={form.name} onChange={update('name')} />
          <Field label="Description" value={form.description} onChange={update('description')} textarea />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Price (USD)"
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={update('price')}
            />
            <Field label="Category" value={form.category} onChange={update('category')} />
          </div>
          <Field label="Image URL" value={form.image_url} onChange={update('image_url')} />
          <div>
            <label className="text-sm text-stone-600 mb-1 block">Sub-shop</label>
            <select
              value={form.sub_shop_id || ''}
              onChange={update('sub_shop_id')}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 bg-white"
            >
              <option value="">— Main —</option>
              {subShops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={form.available}
              onChange={update('available')}
            />
            Available for order
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-stone-900 text-white hover:bg-stone-700"
            >
              {form.id ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function Field({ label, textarea, ...props }) {
  return (
    <div>
      <label className="text-sm text-stone-600 mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          {...props}
          className="w-full border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-stone-400 min-h-[70px]"
        />
      ) : (
        <input
          {...props}
          className="w-full border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-stone-400"
        />
      )}
    </div>
  )
}
