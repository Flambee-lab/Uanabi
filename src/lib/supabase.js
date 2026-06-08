import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const PLACEHOLDER_MARKERS = ['tu-proyecto', 'tu-anon-key', 'your-project', 'your-anon-key']

function looksLikePlaceholder(value) {
  if (!value) return true
  const lower = value.toLowerCase()
  return PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker))
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !looksLikePlaceholder(supabaseUrl) && !looksLikePlaceholder(supabaseAnonKey),
)

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

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function getAuthRedirectUrl() {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/auth/callback`
}
