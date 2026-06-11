/** Proveedores de auth compatibles con Supabase */
export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
}

export const DEFAULT_ACCOUNT_SETTINGS = {
  email: 'celeste@uanabi.app',
  authProvider: AUTH_PROVIDERS.GOOGLE,
  commercialContactEnabled: true,
  emailNotifications: {
    brandAcceptedProposal: true,
    caseClosureReminders: true,
  },
}

/**
 * Simula el proveedor de sesión (reemplazar por supabase.auth.getUser() + identities).
 * Cambiá authProvider a AUTH_PROVIDERS.EMAIL para probar el formulario de contraseña.
 */
export function getSimulatedAuthProvider(settings = DEFAULT_ACCOUNT_SETTINGS) {
  return settings.authProvider ?? AUTH_PROVIDERS.EMAIL
}

export function isGoogleAuth(settings) {
  return getSimulatedAuthProvider(settings) === AUTH_PROVIDERS.GOOGLE
}
