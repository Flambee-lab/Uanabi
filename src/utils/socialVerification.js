import { DEFAULT_HOST_PROFILE, SOCIAL_PLATFORMS } from '../data/hostProfile'

/** Plataformas con flujo de conexión OAuth (demo local hoy, APIs después). */
export const SOCIAL_CONNECT_PLATFORMS = ['instagram', 'tiktok']

export function platformSupportsConnect(platformKey) {
  return SOCIAL_CONNECT_PLATFORMS.includes(platformKey)
}

export function getSocialVerificationStatus({ handle, verified, originalHandle }) {
  const trimmed = handle?.trim() ?? ''
  if (!trimmed) return 'empty'
  const changed = trimmed !== (originalHandle?.trim() ?? '')
  if (verified && !changed) return 'verified'
  return 'pending'
}

export function clearPlatformVerification(validatedLinks, platformKey) {
  return { ...(validatedLinks ?? {}), [platformKey]: false }
}

export function applyDemoPlatformConnect(validatedLinks, platformKey) {
  return { ...(validatedLinks ?? {}), [platformKey]: true }
}

/** Simula el conteo que devolvería la API al conectar (solo demo local). */
export function getDemoPlatformFollowers(platformKey) {
  return DEFAULT_HOST_PROFILE.socialMetrics.platformFollowers[platformKey]?.trim() ?? ''
}

export function reconcileValidatedLinks(profile, form) {
  const validatedLinks = {
    ...(profile.validatedLinks ?? {}),
    ...(form.validatedLinks ?? {}),
  }

  for (const { key, field } of SOCIAL_PLATFORMS) {
    const prev = (profile[field] ?? '').trim()
    const next = (form[field] ?? '').trim()
    if (prev !== next) validatedLinks[key] = false
  }

  return validatedLinks
}
