import { mapSupabaseAuthError } from '../utils/authValidation'
import { disableDevAuth } from './supabase'

const DEV_SESSION_KEY = 'onbrand_dev_session'

export function clearGuestAuthStorage() {
  disableDevAuth()
  try {
    localStorage.removeItem(DEV_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function hasAuthCallbackParams(location = window.location) {
  const search = new URLSearchParams(location.search)
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''))

  return (
    search.has('code') ||
    search.has('token_hash') ||
    search.has('type') ||
    search.has('error') ||
    search.has('error_description') ||
    hash.has('access_token') ||
    hash.has('error') ||
    hash.has('error_description')
  )
}

/** Si Supabase redirige a `/` u otra ruta con tokens, reenvía a `/auth/callback`. */
export function buildCallbackRedirectPath(location = window.location) {
  if (location.pathname === '/auth/callback') return null
  if (!hasAuthCallbackParams(location)) return null
  return `/auth/callback${location.search}${location.hash}`
}

function readAuthError(search, hash) {
  const raw =
    search.get('error_description') ||
    search.get('error') ||
    hash.get('error_description') ||
    hash.get('error')

  if (!raw) return null
  try {
    return decodeURIComponent(raw.replace(/\+/g, ' '))
  } catch {
    return raw
  }
}

/**
 * Completa el login tras magic link, confirmación de email u OAuth (PKCE).
 * Debe llamarse en `/auth/callback` antes de montar el estado guest.
 */
export async function completeAuthCallback(supabaseClient) {
  if (!supabaseClient) {
    throw new Error('Supabase no está configurado.')
  }

  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))

  const authError = readAuthError(search, hash)
  if (authError) throw new Error(mapSupabaseAuthError(authError, 'google'))

  const code = search.get('code')
  if (code) {
    const { error } = await supabaseClient.auth.exchangeCodeForSession(code)
    if (error) throw error
  }

  const tokenHash = search.get('token_hash')
  const type = search.get('type')
  if (tokenHash && type) {
    const { error } = await supabaseClient.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    if (error) throw error
  }

  if (!code && !(tokenHash && type) && hash.has('access_token')) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabaseClient.auth.getSession()

  if (sessionError) throw sessionError
  if (!session) {
    throw new Error(
      'No pudimos iniciar sesión. El enlace puede haber expirado o la URL de redirección no está configurada en Supabase.',
    )
  }

  return session
}
