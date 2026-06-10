import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const DEV_AUTH_STORAGE_KEY = 'onbrand_dev_auth'

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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

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
