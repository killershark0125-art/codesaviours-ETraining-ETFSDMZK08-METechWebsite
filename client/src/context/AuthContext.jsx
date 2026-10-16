/* eslint react-refresh/only-export-components: off */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('me_admin_token')))

  useEffect(() => {
    let active = true
    if (!localStorage.getItem('me_admin_token')) { return undefined }
    apiRequest('/auth/me')
      .then((response) => { if (active) setUser(response.data) })
      .catch(() => { localStorage.removeItem('me_admin_token'); if (active) setUser(null) })
      .finally(() => { if (active) setChecking(false) })
    return () => { active = false }
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
    localStorage.setItem('me_admin_token', response.data.token)
    setUser(response.data.user)
    return response.data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('me_admin_token')
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, checking, login, logout, isAuthenticated: Boolean(user) }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
