import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AUTH_PROVIDERS,
  createAuthenticatedSession,
  DEFAULT_AUTH_USER,
} from '../data/auth'
import {
  createFreshHostProfile,
  markOnboardingSkipped,
  resetOnboardingFlow,
} from '../data/appSession'
import {
  DEFAULT_HOST_PROFILE,
  loadStoredHostProfile,
  saveStoredHostProfile,
} from '../data/hostProfile'
import {
  fetchUserProfile,
  mapSupabaseProfileToHost,
  upsertUserProfile,
} from '../lib/profiles'
import {
  disableDevAuth,
  enableDevAuth,
  getAuthRedirectUrl,
  isDevAuthEnabled,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase'

const AuthContext = createContext(null)

const DEV_SESSION_KEY = 'onbrand_dev_session'
const DEV_AUTO_DASHBOARD = import.meta.env.DEV

function mapSupabaseUser(user) {
  if (!user) return null
  const meta = user.user_metadata ?? {}
  const provider =
    user.app_metadata?.provider === 'google'
      ? AUTH_PROVIDERS.GOOGLE
      : AUTH_PROVIDERS.EMAIL

  return {
    id: user.id,
    email: user.email ?? '',
    fullName:
      meta.full_name?.trim() ||
      meta.name?.trim() ||
      user.email?.split('@')[0]?.replace(/\./g, ' ') ||
      '',
    provider,
  }
}

function loadDevSession() {
  try {
    const raw = localStorage.getItem(DEV_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveDevSession(session) {
  if (session) {
    localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(DEV_SESSION_KEY)
  }
}

function createDevMockSession({ email, provider = AUTH_PROVIDERS.EMAIL, fullName }) {
  const authSession = createAuthenticatedSession({ email, provider, fullName })
  return {
    mock: true,
    user: {
      id: 'dev-user-1',
      email: authSession.user.email,
      fullName: authSession.user.fullName,
      provider: authSession.user.provider,
    },
  }
}

function ensureDevDemoSession() {
  let devSession = loadDevSession()
  if (!devSession) {
    devSession = createDevMockSession({
      email: DEFAULT_AUTH_USER.email,
      provider: DEFAULT_AUTH_USER.provider,
      fullName: DEFAULT_AUTH_USER.fullName,
    })
    saveDevSession(devSession)
    markOnboardingSkipped()
    const stored = loadStoredHostProfile()
    if (!stored?.isConfigured) {
      saveStoredHostProfile({ ...DEFAULT_HOST_PROFILE, isConfigured: true })
    }
  }
  return devSession
}

export function AuthProvider({ children }) {
  const [isDevAuth, setIsDevAuth] = useState(() => {
    if (DEV_AUTO_DASHBOARD && !isSupabaseConfigured) {
      enableDevAuth()
      return true
    }
    return isDevAuthEnabled()
  })
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  const useMockAuth = isDevAuth && !isSupabaseConfigured

  const loadProfile = useCallback(
    async (userId) => {
      if (!userId) {
        setProfile(null)
        return null
      }

      if (useMockAuth) {
        const stored = loadStoredHostProfile()
        setProfile(stored)
        return stored
      }

      setProfileLoading(true)
      try {
        const { data, error } = await fetchUserProfile(userId)
        if (error) throw error
        const mapped = mapSupabaseProfileToHost(data)
        setProfile(mapped)
        return mapped
      } catch {
        const fallback = mapSupabaseProfileToHost(null)
        setProfile(fallback)
        return fallback
      } finally {
        setProfileLoading(false)
      }
    },
    [useMockAuth],
  )

  useEffect(() => {
    if (useMockAuth) {
      const devSession =
        DEV_AUTO_DASHBOARD ? ensureDevDemoSession() : loadDevSession()
      if (DEV_AUTO_DASHBOARD) {
        markOnboardingSkipped()
        const stored = loadStoredHostProfile()
        if (!stored?.isConfigured) {
          saveStoredHostProfile({ ...DEFAULT_HOST_PROFILE, isConfigured: true })
        }
      }
      setSession(devSession)
      setUser(devSession?.user ?? null)
      if (devSession?.user?.id) {
        loadProfile(devSession.user.id)
      } else {
        setProfile(null)
      }
      setIsReady(true)
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      setIsReady(true)
      return
    }

    let active = true

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!active) return
      setSession(initialSession)
      setUser(mapSupabaseUser(initialSession?.user ?? null))
      if (initialSession?.user?.id) {
        loadProfile(initialSession.user.id)
      }
      setIsReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setUser(mapSupabaseUser(nextSession?.user ?? null))
      if (nextSession?.user?.id) {
        await loadProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [loadProfile, useMockAuth])

  const assertClient = () => {
    if (!supabase) {
      throw new Error(
        'Supabase no está configurado. Completá .env.local o usá el modo demo.',
      )
    }
    return supabase
  }

  const signInWithPassword = useCallback(
    async ({ email, password }) => {
      if (useMockAuth) {
        await new Promise((r) => setTimeout(r, 400))
        const trimmed = email.trim()
        const next = createDevMockSession({
          email: trimmed,
          provider: AUTH_PROVIDERS.EMAIL,
          fullName:
            trimmed === DEFAULT_AUTH_USER.email ? DEFAULT_AUTH_USER.fullName : undefined,
        })
        saveDevSession(next)
        setSession(next)
        setUser(next.user)
        await loadProfile(next.user.id)
        return
      }

      const client = assertClient()
      const { error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
    },
    [loadProfile, useMockAuth],
  )

  const signUpWithPassword = useCallback(
    async ({ email, password }) => {
      if (useMockAuth) {
        await signInWithPassword({ email, password })
        return { session: loadDevSession(), user: loadDevSession()?.user }
      }

      const client = assertClient()
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
        },
      })
      if (error) throw error
      return data
    },
    [signInWithPassword, useMockAuth],
  )

  const signInWithMagicLink = useCallback(
    async (email) => {
      if (useMockAuth) {
        throw new Error('Magic Link requiere Supabase. Configurá .env.local o usá contraseña en demo.')
      }

      const client = assertClient()
      const { error } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
        },
      })
      if (error) throw error
    },
    [useMockAuth],
  )

  const signInWithGoogle = useCallback(async () => {
    if (useMockAuth) {
      await new Promise((r) => setTimeout(r, 500))
      const next = createDevMockSession({
        email: DEFAULT_AUTH_USER.email,
        provider: AUTH_PROVIDERS.GOOGLE,
        fullName: DEFAULT_AUTH_USER.fullName,
      })
      saveDevSession(next)
      setSession(next)
      setUser(next.user)
      await loadProfile(next.user.id)
      return
    }

    const client = assertClient()
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthRedirectUrl(),
      },
    })
    if (error) throw error
  }, [loadProfile, useMockAuth])

  const logout = useCallback(async () => {
    if (useMockAuth) {
      saveDevSession(null)
      setSession(null)
      setUser(null)
      setProfile(null)
      return
    }

    if (supabase) {
      await supabase.auth.signOut()
    }
    setSession(null)
    setUser(null)
    setProfile(null)
  }, [useMockAuth])

  const saveProfile = useCallback(
    async (nextProfile) => {
      if (!user?.id) return { error: new Error('Sin sesión activa') }

      if (useMockAuth) {
        const saved = { ...nextProfile, isConfigured: true }
        saveStoredHostProfile(saved)
        setProfile(saved)
        return { data: saved, error: null }
      }

      const { data, error } = await upsertUserProfile(nextProfile, user.id)
      if (error) throw error
      const mapped = mapSupabaseProfileToHost(data)
      setProfile(mapped)
      return { data: mapped, error: null }
    },
    [user?.id, useMockAuth],
  )

  const refreshProfile = useCallback(() => {
    if (!user?.id) return Promise.resolve(null)
    return loadProfile(user.id)
  }, [loadProfile, user?.id])

  const restartOnboarding = useCallback(async () => {
    resetOnboardingFlow()
    const fresh = createFreshHostProfile()

    if (useMockAuth) {
      saveStoredHostProfile(fresh)
      setProfile(fresh)
      return fresh
    }

    if (!user?.id) {
      setProfile(fresh)
      return fresh
    }

    const { data, error } = await upsertUserProfile(fresh, user.id)
    if (error) throw error
    const mapped = mapSupabaseProfileToHost(data)
    setProfile(mapped)
    return mapped
  }, [user, useMockAuth])

  const value = useMemo(
    () => ({
      session,
      user,
      profile: profile ?? DEFAULT_HOST_PROFILE,
      profileLoading,
      isReady,
      isSupabaseConfigured,
      isDevAuth: useMockAuth,
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
      enterAsGuest: async () => {
        throw new Error('El modo invitado fue deshabilitado. Creá una cuenta para continuar.')
      },
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
      useMockAuth,
      signInWithPassword,
      signUpWithPassword,
      signInWithMagicLink,
      signInWithGoogle,
      logout,
      saveProfile,
      refreshProfile,
      restartOnboarding,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
