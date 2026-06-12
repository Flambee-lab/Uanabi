import { clearAuthSession } from './auth'
import { DEFAULT_HOST_PROFILE, HOST_PROFILE_STORAGE_KEY } from './hostProfile'
import { ONBOARDING_STORAGE_KEY } from './onboarding'

export const GUEST_BANNER_KEY = 'uanabi_guest_banner_dismissed'
export const ONBOARDING_SKIP_KEY = 'uanabi_skip_onboarding'

export function markOnboardingSkipped() {
  try {
    sessionStorage.setItem(ONBOARDING_SKIP_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function isOnboardingSkipped() {
  try {
    return sessionStorage.getItem(ONBOARDING_SKIP_KEY) === '1'
  } catch {
    return false
  }
}

export function clearOnboardingSkip() {
  try {
    sessionStorage.removeItem(ONBOARDING_SKIP_KEY)
  } catch {
    /* ignore */
  }
}

export function createFreshHostProfile() {
  return {
    ...DEFAULT_HOST_PROFILE,
    fullName: 'Celeste Salas',
    displayName: '',
    bio: '',
    avatarUrl: null,
    location: DEFAULT_HOST_PROFILE.location,
    categories: [],
    instagram: '',
    tiktok: '',
    youtube: '',
    twitch: '',
    twitter: '',
    facebook: '',
    whatsapp: '',
    pastBrandNames: [],
    socialMetrics: {
      totalFollowers: '',
      engagementPercent: '',
    },
    successStories: [],
    joinedAt: null,
    isConfigured: false,
  }
}

/** Borra progreso de onboarding para volver a recorrer el wizard. */
export function resetOnboardingFlow() {
  clearOnboardingSkip()
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    localStorage.removeItem(HOST_PROFILE_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * MVP/demo: cada recarga de página reinicia login + registro de Host.
 * Reemplazar por persistencia real (Supabase + perfil) en producción.
 */
export function resetAppSessionOnReload() {
  clearAuthSession()
  clearOnboardingSkip()
  try {
    localStorage.removeItem(HOST_PROFILE_STORAGE_KEY)
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    localStorage.removeItem(GUEST_BANNER_KEY)
  } catch {
    /* ignore */
  }
}
