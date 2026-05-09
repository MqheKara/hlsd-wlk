import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../api/client'

const roles = ['customer', 'rb_admin', 'hw_admin', 'superuser']

const roleLabel = {
  customer: 'Customer',
  rb_admin: 'Roasted Bean admin',
  hw_admin: 'Hillside Walk admin',
  superuser: 'Superuser',
}

const roleBadge = {
  customer: 'bg-stone-100 text-stone-700',
  rb_admin: 'bg-amber-100 text-amber-800',
  hw_admin: 'bg-emerald-100 text-emerald-800',
  superuser: 'bg-violet-100 text-violet-800',
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api
      .get('/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Could not load users'))
      .finally(() => setLoading(false))
  }, [])

  const updateRole = async (id, role) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/role`, { role })
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
      toast.success('Role updated')
    } catch (err) {
      toast.error(err.userMessage || 'Could not update')
    }
  }

  const filtered = users.filter(
    (u) =>
      !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-3xl font-semibold text-stone-900">Users</h1>
      <p className="text-stone-500 mb-6">All accounts and their roles.</p>

      <input
        type="search"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm mb-5 border border-stone-200 rounded-full px-4 py-2 outline-none focus:border-stone-400"
      />

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-stone-100"
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-stone-900">{u.name}</div>
                    {u.phone && <div className="text-xs text-stone-500">{u.phone}</div>}
                  </td>
                  <td className="px-5 py-3 text-stone-700">{u.email}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[u.role]}`}>
                        {roleLabel[u.role]}
                      </span>
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className="text-xs border border-stone-200 rounded-md px-2 py-1 bg-white"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {roleLabel[r]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-stone-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-stone-400">No users match.</div>
          )}
        </div>
      )}
    </div>
  )
}
