import { loadStoredHostProfile, saveStoredHostProfile } from '../data/hostProfile'
import {
  mapHostProfileToSupabase,
  mapSupabaseProfileToHost,
  upsertProfilePartial,
} from './profiles'
import { isLocalAuthMode } from './devLogin'
import { mapSupabaseAuthError } from '../utils/authValidation'
import { getProfileOAuthRedirectUrl, isSupabaseConfigured, supabase } from './supabase'

export const PENDING_SOCIAL_VERIFY_KEY = 'onbrand_pending_social_verify'
export const PRESERVE_LOCAL_AUTH_KEY = 'onbrand_preserve_local_auth'

// Supabase no tiene proveedor "instagram" — Instagram Login de Meta usa el slot Facebook
const SUPABASE_OAUTH_PROVIDERS = {
  twitter: 'twitter',
  instagram: 'facebook',
}

const NETWORK_LABELS = {
  twitter: 'X (Twitter)',
  instagram: 'Instagram (OAuth vía Facebook en Supabase)',
  tiktok: 'TikTok',
}

export function getSocialOAuthProvider(network) {
  return SUPABASE_OAUTH_PROVIDERS[network] ?? null
}

export function isSocialOAuthAvailable(network) {
  return Boolean(getSocialOAuthProvider(network)) && isSupabaseConfigured
}

export function setPendingSocialVerify(network) {
  try {
    sessionStorage.setItem(PENDING_SOCIAL_VERIFY_KEY, network)
    sessionStorage.setItem(PRESERVE_LOCAL_AUTH_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function consumePendingSocialVerify() {
  try {
    const value = sessionStorage.getItem(PENDING_SOCIAL_VERIFY_KEY)
    sessionStorage.removeItem(PENDING_SOCIAL_VERIFY_KEY)
    return value
  } catch {
    return null
  }
}

export function shouldPreserveLocalAuth() {
  try {
    return sessionStorage.getItem(PRESERVE_LOCAL_AUTH_KEY) === '1'
  } catch {
    return false
  }
}

export function clearPreserveLocalAuth() {
  try {
    sessionStorage.removeItem(PRESERVE_LOCAL_AUTH_KEY)
  } catch {
    /* ignore */
  }
}

/** Instagram Login (Meta) — en Supabase se configura y llama como proveedor `facebook`. */
export async function signInWithInstagramOAuth() {
  return signInWithSocialProvider('instagram')
}

export async function signInWithSocialProvider(network) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no está configurado para OAuth de redes.')
  }

  const provider = getSocialOAuthProvider(network)
  if (!provider) {
    throw new Error(
      `${NETWORK_LABELS[network] ?? network} no tiene OAuth en Supabase. Guardá tu @ manualmente.`,
    )
  }

  setPendingSocialVerify(network)

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getProfileOAuthRedirectUrl(),
      scopes: network === 'instagram' ? 'email,public_profile' : undefined,
      queryParams:
        network === 'instagram'
          ? undefined
          : {
              access_type: 'offline',
              prompt: 'consent',
            },
    },
  })

  if (error) {
    throw new Error(mapSupabaseAuthError(error.message, provider))
  }
}

function extractUsername(network, metadata = {}) {
  const direct =
    metadata[`${network}_username`] ??
    metadata[`${network}_handle`] ??
    metadata.preferred_username ??
    metadata.user_name ??
    metadata.username

  if (direct) return String(direct).replace(/^@/, '')

  if (network === 'twitter') {
    return metadata.user_name?.replace(/^@/, '') ?? null
  }

  if (network === 'instagram') {
    return metadata.name?.replace(/^@/, '') ?? null
  }

  return null
}

function mergeSocialIntoProfile(currentProfile, network, user) {
  const meta = user?.user_metadata ?? {}
  const username = extractUsername(network, meta)
  const avatarUrl = meta.avatar_url ?? meta.picture ?? meta.profile_image_url ?? null

  const merged = {
    ...(currentProfile ?? loadStoredHostProfile()),
    avatarUrl: avatarUrl ?? currentProfile?.avatarUrl ?? null,
    [network]: username ?? currentProfile?.[network] ?? '',
    validatedLinks: {
      ...(currentProfile?.validatedLinks ?? {}),
      [network]: true,
    },
  }

  saveStoredHostProfile({ ...merged, isConfigured: merged.isConfigured ?? true })
  return merged
}

export async function reconcileSocialOAuthFromSession(user, currentProfile) {
  const pending = consumePendingSocialVerify()
  const preserveLocal = shouldPreserveLocalAuth() || isLocalAuthMode()

  const provider = user?.app_metadata?.provider
  const network =
    pending ??
    (provider === 'twitter'
      ? 'twitter'
      : provider === 'instagram' || provider === 'facebook'
        ? 'instagram'
        : null)

  if (!network || !user) {
    clearPreserveLocalAuth()
    return { data: currentProfile, error: null }
  }

  const mergedHost = mergeSocialIntoProfile(currentProfile, network, user)

  if (preserveLocal) {
    if (supabase) {
      await supabase.auth.signOut()
    }
    clearPreserveLocalAuth()
    return { data: mergedHost, error: null }
  }

  if (!user.id) {
    clearPreserveLocalAuth()
    return { data: mergedHost, error: null }
  }

  const username = extractUsername(network, user.user_metadata ?? {})
  const avatarUrl =
    user.user_metadata?.avatar_url ??
    user.user_metadata?.picture ??
    mergedHost.avatarUrl

  const patch = {
    avatar_url: avatarUrl,
    [`is_${network}_verified`]: true,
    [`${network}_username`]: username,
    [network]: username,
  }

  try {
    const { data, error } = await upsertProfilePartial(user.id, {
      ...mapHostProfileToSupabase(mergedHost, user.id),
      ...patch,
    })
    if (error) throw error
    clearPreserveLocalAuth()
    return { data: mapSupabaseProfileToHost(data), error: null }
  } catch {
    clearPreserveLocalAuth()
    return { data: mergedHost, error: null }
  }
}
