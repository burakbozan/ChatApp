const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const CHAT_PATH = '/api/chat'

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE}${CHAT_PATH}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong. Please try again.')
  return data
}

export const api = {
  login: (credentials) => request('/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (details) => request('/register', { method: 'POST', body: JSON.stringify(details) }),
  getMessages: (roomId, token) => request(`/messages?roomId=${encodeURIComponent(roomId)}&limit=100`, { token }),
}

export const socketUrl = API_BASE
