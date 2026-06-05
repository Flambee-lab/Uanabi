import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  AUTH_PROVIDERS,
  clearAuthSession,
  createAuthenticatedSession,
  createGuestSession,
  DEFAULT_AUTH_USER,
  hasActiveSession,
  isAuthenticated,
  isGuest,
  loadAuthSession,
  saveAuthSession,
} from '../data/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setSession(loadAuthSession())
    setIsReady(true)
  }, [])

  const persist = useCallback((next) => {
    setSession(next)
    if (next) saveAuthSession(next)
    else clearAuthSession()
  }, [])

  const loginWithEmail = useCallback(async ({ email, password }) => {
    const trimmed = email?.trim()
    if (!trimmed) throw new Error('Ingresá tu correo electrónico')
    if (!password?.trim()) throw new Error('Ingresá tu contraseña')

    // Simulación — reemplazar por supabase.auth.signInWithPassword()
    await new Promise((r) => setTimeout(r, 400))
    const next = createAuthenticatedSession({
      email: trimmed,
      provider: AUTH_PROVIDERS.EMAIL,
      fullName: trimmed === DEFAULT_AUTH_USER.email ? DEFAULT_AUTH_USER.fullName : undefined,
    })
    persist(next)
    return next
  }, [persist])

  const loginWithGoogle = useCallback(async () => {
    // Simulación — reemplazar por supabase.auth.signInWithOAuth({ provider: 'google' })
    await new Promise((r) => setTimeout(r, 500))
    const next = createAuthenticatedSession({
      email: DEFAULT_AUTH_USER.email,
      provider: AUTH_PROVIDERS.GOOGLE,
      fullName: DEFAULT_AUTH_USER.fullName,
    })
    persist(next)
    return next
  }, [persist])

  const enterAsGuest = useCallback(() => {
    const next = createGuestSession()
    persist(next)
    return next
  }, [persist])

  const logout = useCallback(() => {
    persist(null)
  }, [persist])

  const value = useMemo(
    () => ({
      session,
      isReady,
      isLoggedIn: hasActiveSession(session),
      isAuthenticated: isAuthenticated(session),
      isGuest: isGuest(session),
      user: session?.user ?? null,
      loginWithEmail,
      loginWithGoogle,
      enterAsGuest,
      logout,
    }),
    [session, isReady, loginWithEmail, loginWithGoogle, enterAsGuest, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
