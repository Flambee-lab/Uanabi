import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
  ''
).trim()

const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ''
).trim()

const PLACEHOLDER_MARKERS = ['tu-proyecto', 'tu-anon-key', 'your-project', 'your-anon-key']

function looksLikePlaceholder(value) {
  if (!value) return true
  const lower = value.toLowerCase()
  return PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker))
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !looksLikePlaceholder(supabaseUrl) &&
    !looksLikePlaceholder(supabaseAnonKey),
)

export const DEV_AUTH_STORAGE_KEY = 'uanabi_dev_auth'

export function isDevAuthEnabled() {
  try {
    return localStorage.getItem(DEV_AUTH_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function enableDevAuth() {
  localStorage.setItem(DEV_AUTH_STORAGE_KEY, '1')
}

export function disableDevAuth() {
  localStorage.removeItem(DEV_AUTH_STORAGE_KEY)
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null

export function getAuthRedirectUrl(path = '/auth/callback') {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${path}`
}

export function getProfileOAuthRedirectUrl() {
  return getAuthRedirectUrl('/profile?callback=true')
}

export function getInstagramClientId() {
  return (
    import.meta.env.VITE_INSTAGRAM_CLIENT_ID ??
    import.meta.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID ??
    ''
  )
}
