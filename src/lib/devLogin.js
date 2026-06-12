/** Login local: no usa Supabase Auth. Supabase solo para OAuth de redes. */
export function isLocalAuthMode() {
  return import.meta.env.VITE_USE_LOCAL_AUTH !== '0'
}

export function getDevLoginCredentials() {
  return {
    email: import.meta.env.VITE_DEV_LOGIN_EMAIL?.trim() ?? '',
    password: import.meta.env.VITE_DEV_LOGIN_PASSWORD?.trim() ?? '',
  }
}

export function isDevLoginConfigured() {
  const { email, password } = getDevLoginCredentials()
  return Boolean(email && password)
}

export function isAutoSkipAuthEnabled() {
  return import.meta.env.VITE_AUTO_SKIP_AUTH === '1'
}

export function validateLocalCredentials(email, password) {
  const dev = getDevLoginCredentials()
  if (!dev.email || !dev.password) return false
  return email.trim().toLowerCase() === dev.email.toLowerCase() && password === dev.password
}
