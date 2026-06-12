const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email) {
  const trimmed = email?.trim() ?? ''
  if (!trimmed) return 'Ingresá tu correo electrónico'
  if (!EMAIL_RE.test(trimmed)) return 'El correo no tiene un formato válido'
  return null
}

export function validatePassword(password, { minLength = 6, required = true } = {}) {
  const value = password ?? ''
  if (!required) return null
  if (!value.trim()) return 'Ingresá tu contraseña'
  if (value.length < minLength) {
    return `La contraseña debe tener al menos ${minLength} caracteres`
  }
  return null
}

const PROVIDER_LABELS = {
  google: 'Google',
  facebook: 'Meta / Facebook (Instagram)',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  twitter: 'X (Twitter)',
  email: 'Email / Magic Link',
}

function normalizeAuthErrorMessage(message) {
  if (!message) return ''
  if (typeof message === 'object') {
    return message.msg ?? message.message ?? message.error_description ?? ''
  }
  const text = String(message)
  if (text.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(text)
      return parsed.msg ?? parsed.message ?? parsed.error_description ?? text
    } catch {
      return text
    }
  }
  return text
}

export function mapSupabaseAuthError(message, provider) {
  const normalized = normalizeAuthErrorMessage(message)
  if (!normalized) return 'No pudimos completar la operación. Intentá de nuevo.'
  const lower = normalized.toLowerCase()

  if (lower.includes('provider is not enabled') || lower.includes('unsupported provider')) {
    const label = PROVIDER_LABELS[provider] ?? 'ese proveedor'
    return `${label} no está habilitado en Supabase. Andá al Dashboard → Authentication → Providers y activalo (con sus credenciales si aplica).`
  }
  if (lower.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.'
  }
  if (lower.includes('user already registered')) {
    return 'Ya existe una cuenta con ese correo. Iniciá sesión.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Confirmá tu correo antes de ingresar. Revisá tu bandeja de entrada.'
  }
  if (lower.includes('password')) {
    return 'La contraseña no cumple los requisitos mínimos.'
  }
  return normalized
}
