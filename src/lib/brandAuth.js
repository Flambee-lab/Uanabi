import { AUTH_PROVIDERS } from '../data/auth'
import { loadStoredBrandProfile, saveStoredBrandProfile, DEFAULT_BRAND_PROFILE } from '../data/brandProfile'
import { getDevLoginCredentials } from './devLogin'
import { enableDevAuth } from './supabase'

export const BRAND_LOGIN_EMAIL = 'milena@flame.com'
export const BRAND_SESSION_KEY = 'onbrand_brand_session'

export function validateBrandCredentials(email, password) {
  const dev = getDevLoginCredentials()
  if (!dev.password) return false
  return (
    email.trim().toLowerCase() === BRAND_LOGIN_EMAIL.toLowerCase() &&
    password === dev.password
  )
}

export function loadBrandSession() {
  try {
    const raw = sessionStorage.getItem(BRAND_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveBrandSession(session) {
  if (session) {
    sessionStorage.setItem(BRAND_SESSION_KEY, JSON.stringify(session))
  } else {
    sessionStorage.removeItem(BRAND_SESSION_KEY)
  }
}

export function createBrandSession({ email = BRAND_LOGIN_EMAIL } = {}) {
  return {
    mock: true,
    local: true,
    role: 'brand',
    user: {
      id: 'local-brand-1',
      email,
      fullName: 'VitalSport',
      provider: AUTH_PROVIDERS.EMAIL,
      role: 'brand',
    },
  }
}

export function bootstrapBrandAuthSession({ freshProfile = false } = {}) {
  enableDevAuth()
  const session = createBrandSession()
  saveBrandSession(session)

  const profile = freshProfile
    ? { ...DEFAULT_BRAND_PROFILE, isVerified: false }
    : loadStoredBrandProfile()

  saveStoredBrandProfile(profile)
  return { session, user: session.user, profile }
}
