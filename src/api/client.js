import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // surface error message
    const msg = err?.response?.data?.error || err.message
    err.userMessage = msg
    return Promise.reject(err)
  },
)

export default api
