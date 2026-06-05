export const AUTH_STORAGE_KEY = 'uanabi_auth_session'

export const AUTH_MODES = {
  AUTHENTICATED: 'authenticated',
  GUEST: 'guest',
}

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
}

export const DEFAULT_AUTH_USER = {
  email: 'milena.belén@onbrand.app',
  fullName: 'Milena Belén Miranda',
  provider: AUTH_PROVIDERS.GOOGLE,
}

export function loadAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.mode) return null
    return parsed
  } catch {
    return null
  }
}

export function saveAuthSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function createAuthenticatedSession({
  email,
  provider = AUTH_PROVIDERS.EMAIL,
  fullName,
}) {
  const normalizedEmail = email.trim().toLowerCase()
  return {
    mode: AUTH_MODES.AUTHENTICATED,
    user: {
      email: normalizedEmail,
      fullName:
        fullName?.trim() ||
        normalizedEmail.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      provider,
    },
    createdAt: new Date().toISOString(),
  }
}

export function createGuestSession() {
  return {
    mode: AUTH_MODES.GUEST,
    user: null,
    createdAt: new Date().toISOString(),
  }
}

export function hasActiveSession(session) {
  return session?.mode === AUTH_MODES.AUTHENTICATED || session?.mode === AUTH_MODES.GUEST
}

export function isAuthenticated(session) {
  return session?.mode === AUTH_MODES.AUTHENTICATED
}

export function isGuest(session) {
  return session?.mode === AUTH_MODES.GUEST
}
