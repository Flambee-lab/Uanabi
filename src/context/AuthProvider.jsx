import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { clearOnboardingSkip, createFreshHostProfile, resetOnboardingFlow } from '../data/appSession'
import {
  DEFAULT_HOST_PROFILE,
  loadStoredHostProfile,
  saveStoredHostProfile,
} from '../data/hostProfile'
import {
  getDevLoginCredentials,
  isLocalAuthMode,
  validateLocalCredentials,
} from '../lib/devLogin'
import {
  bootstrapLocalAuthSession,
  createLocalSession,
  loadDevSession,
  saveDevSession,
} from '../lib/localAuth'
import {
  disableDevAuth,
  enableDevAuth,
  isSupabaseConfigured,
} from '../lib/supabase'

const AuthContext = createContext(null)

function applyLocalSession(setters, { session, user, profile }) {
  enableDevAuth()
  setters.setIsDevAuth(true)
  setters.setSession(session)
  setters.setUser(user)
  setters.setProfile(profile)
  setters.setIsReady(true)
}

export function AuthProvider({ children }) {
  const localAuth = isLocalAuthMode()

  const [isDevAuth, setIsDevAuth] = useState(localAuth)
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [profileLoading] = useState(false)

  const setters = useMemo(
    () => ({ setIsDevAuth, setSession, setUser, setProfile, setIsReady }),
    [],
  )

  const loadLocalProfile = useCallback(() => {
    const stored = loadStoredHostProfile()
    setProfile(stored)
    return stored
  }, [])

  useEffect(() => {
    if (!localAuth) {
      setIsReady(true)
      return
    }

    // Restaurar sesión solo en la misma pestaña (sessionStorage) — abrir localhost siempre empieza sin sesión
    const existing = loadDevSession()
    if (existing) {
      enableDevAuth()
      setIsDevAuth(true)
      setSession(existing)
      setUser(existing.user)
      setProfile(loadStoredHostProfile())
    }

    setIsReady(true)
  }, [localAuth])

  const signInWithLocalCredentials = useCallback(
    async ({ email, password } = {}) => {
      const creds = getDevLoginCredentials()
      const resolvedEmail = email?.trim() || creds.email
      const resolvedPassword = password ?? creds.password

      if (!validateLocalCredentials(resolvedEmail, resolvedPassword)) {
        throw new Error('Correo o contraseña incorrectos.')
      }

      enableDevAuth()
      clearOnboardingSkip()

      const session = createLocalSession({ email: resolvedEmail })
      saveDevSession(session)

      // Tras login siempre va al wizard hasta completarlo en esta sesión
      const stored = loadStoredHostProfile()
      const profileForWizard = { ...stored, isConfigured: false }
      saveStoredHostProfile(profileForWizard)

      applyLocalSession(setters, {
        session,
        user: session.user,
        profile: profileForWizard,
      })
    },
    [setters],
  )

  const signInWithDevCredentials = useCallback(async () => {
    await signInWithLocalCredentials({})
  }, [signInWithLocalCredentials])

  const enterAsGuest = useCallback(async () => {
    const boot = bootstrapLocalAuthSession({ freshProfile: true })
    applyLocalSession(setters, boot)
  }, [setters])

  const signInWithPassword = useCallback(
    async ({ email, password }) => signInWithLocalCredentials({ email, password }),
    [signInWithLocalCredentials],
  )

  const signUpWithPassword = useCallback(
    async ({ email, password }) => {
      await signInWithLocalCredentials({ email, password })
      return { session: loadDevSession(), user: loadDevSession()?.user }
    },
    [signInWithLocalCredentials],
  )

  const signInWithMagicLink = useCallback(async () => {
    throw new Error('Magic Link deshabilitado en modo local. Usá milena@flambee.co y tu contraseña.')
  }, [])

  const signInWithGoogle = useCallback(async () => {
    throw new Error('Google login deshabilitado en modo local. Las redes se conectan desde tu perfil.')
  }, [])

  const logout = useCallback(async () => {
    saveDevSession(null)
    disableDevAuth()
    setIsDevAuth(false)
    setSession(null)
    setUser(null)
    setProfile(null)
  }, [])

  const saveProfile = useCallback(
    async (nextProfile) => {
      if (!user?.id) return { error: new Error('Sin sesión activa') }

      const saved = { ...nextProfile, isConfigured: true }
      saveStoredHostProfile(saved)
      setProfile(saved)
      return { data: saved, error: null }
    },
    [user?.id],
  )

  const refreshProfile = useCallback(() => {
    return Promise.resolve(loadLocalProfile())
  }, [loadLocalProfile])

  const restartOnboarding = useCallback(async () => {
    resetOnboardingFlow()
    const fresh = createFreshHostProfile()
    saveStoredHostProfile(fresh)
    setProfile(fresh)
    return fresh
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      profile: profile ?? DEFAULT_HOST_PROFILE,
      profileLoading,
      isReady,
      isSupabaseConfigured,
      profilesSchemaMissing: false,
      isLocalAuth: localAuth,
      isDevAuth: localAuth || isDevAuth,
      isLoggedIn: Boolean(session),
      isAuthenticated: Boolean(session),
      isGuest: false,
      signInWithPassword,
      signUpWithPassword,
      signInWithMagicLink,
      signInWithGoogle,
      logout,
      saveProfile,
      refreshProfile,
      restartOnboarding,
      loginWithEmail: signInWithPassword,
      loginWithGoogle: signInWithGoogle,
      enterAsGuest,
      signInWithDevCredentials,
      signInWithLocalCredentials,
      disableDevAuth: () => {
        disableDevAuth()
        saveDevSession(null)
        setIsDevAuth(false)
        setSession(null)
        setUser(null)
        setProfile(null)
      },
    }),
    [
      session,
      user,
      profile,
      profileLoading,
      isReady,
      localAuth,
      isDevAuth,
      signInWithPassword,
      signUpWithPassword,
      signInWithMagicLink,
      signInWithGoogle,
      logout,
      saveProfile,
      refreshProfile,
      restartOnboarding,
      enterAsGuest,
      signInWithDevCredentials,
      signInWithLocalCredentials,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
