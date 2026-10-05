import { useState } from 'react'
import { api } from '../services/api'
import { AuthContext } from './authContext'

const STORAGE_KEY = 'chatapp.session'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  async function authenticate(method, details) {
    const result = await api[method](details)
    const nextSession = { token: result.token, user: result.user }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
    return result
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{
      token: session?.token,
      user: session?.user,
      login: (credentials) => authenticate('login', credentials),
      register: (details) => authenticate('register', details),
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}