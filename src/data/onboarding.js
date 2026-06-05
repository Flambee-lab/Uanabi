export const ONBOARDING_STORAGE_KEY = 'uanabi_welcome_complete'

export function isWelcomeComplete() {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function markWelcomeComplete() {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function resetWelcomeComplete() {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
