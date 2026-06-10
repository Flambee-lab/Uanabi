import { AUTH_PROVIDERS, createAuthenticatedSession } from '../data/auth'
import { createFreshHostProfile, clearOnboardingSkip } from '../data/appSession'
import { loadStoredHostProfile, saveStoredHostProfile } from '../data/hostProfile'
import { getDevLoginCredentials } from './devLogin'
import { enableDevAuth } from './supabase'

export const DEV_SESSION_KEY = 'onbrand_dev_session'

export function loadDevSession() {
  try {
    // Migración: la sesión ya no persiste en localStorage entre visitas
    localStorage.removeItem(DEV_SESSION_KEY)
    const raw = sessionStorage.getItem(DEV_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDevSession(session) {
  if (session) {
    sessionStorage.setItem(DEV_SESSION_KEY, JSON.stringify(session))
  } else {
    sessionStorage.removeItem(DEV_SESSION_KEY)
  }
}

export function createLocalSession({ email, fullName = 'Milena Belén Miranda' } = {}) {
  const creds = getDevLoginCredentials()
  const resolvedEmail = email?.trim() || creds.email || 'milena@flambee.co'
  const authSession = createAuthenticatedSession({
    email: resolvedEmail,
    provider: AUTH_PROVIDERS.EMAIL,
    fullName,
  })

  return {
    mock: true,
    local: true,
    user: {
      id: 'local-milena-1',
      email: authSession.user.email,
      fullName: authSession.user.fullName || fullName,
      provider: authSession.user.provider,
    },
  }
}

export function bootstrapLocalAuthSession({ freshProfile = false } = {}) {
  enableDevAuth()

  const session = createLocalSession()
  saveDevSession(session)

  const profile = freshProfile
    ? createFreshHostProfile()
    : { ...createFreshHostProfile(), ...loadStoredHostProfile() }

  if (freshProfile) {
    clearOnboardingSkip()
  }

  saveStoredHostProfile(profile)

  return { session, user: session.user, profile }
}
