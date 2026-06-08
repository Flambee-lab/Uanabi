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

export function mapSupabaseAuthError(message) {
  if (!message) return 'No pudimos completar la operación. Intentá de nuevo.'
  const lower = message.toLowerCase()
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
  return message
}
