import { useEffect, useState } from 'react'
import { Loader2, MailCheck } from 'lucide-react'
import AuthDivider from '../../../components/auth/AuthDivider'
import AuthMethodTabs from '../../../components/auth/AuthMethodTabs'
import AuthShell, { AuthFooterLink } from '../../../components/auth/AuthShell'
import GoogleSignInButton from '../../../components/auth/GoogleSignInButton'
import {
  AUTH_INPUT_CLASS,
  AUTH_PRIMARY_BTN,
  AUTH_TITLE_CLASS,
} from '../../../components/auth/authStyles'
import { useAuth } from '../../../context/AuthProvider'
import { isProfileConfigured } from '../../../lib/profiles'
import {
  mapSupabaseAuthError,
  validateEmail,
  validatePassword,
} from '../../../utils/authValidation'
import { useNavigate } from 'react-router-dom'

function SignupEmailSent({ email }) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
        <MailCheck className="h-5 w-5 text-emerald-600" strokeWidth={1.75} />
      </div>
      <p className="text-sm leading-relaxed text-neutral-700">
        Te enviamos un correo de confirmación a{' '}
        <span className="font-bold text-neutral-900">{email}</span>. Abrí el enlace para activar tu
        cuenta y después ingresá con tu contraseña.
      </p>
    </div>
  )
}

function MagicLinkSuccess({ email }) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm leading-relaxed text-neutral-700">
        📨 Te enviamos un enlace de acceso rápido a{' '}
        <span className="font-bold text-neutral-900">{email}</span>. Revisá tu bandeja de entrada y
        hacé clic en el link para ingresar.
      </p>
    </div>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const {
    isReady,
    session,
    profile,
    profileLoading,
    signUpWithPassword,
    signInWithMagicLink,
    signInWithGoogle,
  } = useAuth()

  const [method, setMethod] = useState('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(null)
  const [signupSent, setSignupSent] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  useEffect(() => {
    if (!isReady || !session || profileLoading) return
    navigate(isProfileConfigured(profile) ? '/dashboard' : '/profile', { replace: true })
  }, [isReady, session, profile, profileLoading, navigate])

  const run = async (key, fn) => {
    setError('')
    setLoading(key)
    try {
      await fn()
    } catch (err) {
      setError(mapSupabaseAuthError(err?.message))
    } finally {
      setLoading(null)
    }
  }

  const handleGoogle = () => run('google', signInWithGoogle)

  const handleSubmit = (e) => {
    e.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    if (method === 'magic') {
      run('magic', async () => {
        await signInWithMagicLink(email)
        setMagicSent(true)
      })
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    run('signup', async () => {
      const { session } = await signUpWithPassword({ email, password })
      if (!session) setSignupSent(true)
    })
  }

  const busy = Boolean(loading)

  if (!isReady) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#fafafa]">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <AuthShell
      footer={
        <AuthFooterLink to="/auth/login">
          ¿Ya tenés cuenta?
        </AuthFooterLink>
      }
    >
      <div className="space-y-2">
        <h1 className={AUTH_TITLE_CLASS}>Crear tu cuenta en Onbrand</h1>
        <p className="text-center text-xs leading-relaxed text-neutral-500">
          Registrate para publicar eventos y conectar con marcas en Capital Federal.
        </p>
      </div>

      {signupSent ? (
        <SignupEmailSent email={email.trim()} />
      ) : magicSent ? (
        <MagicLinkSuccess email={email.trim()} />
      ) : (
        <>
          <GoogleSignInButton
            onClick={handleGoogle}
            loading={loading === 'google'}
            disabled={busy}
            label="Registrarse con Google"
          />

          <AuthDivider />

          <AuthMethodTabs value={method} onChange={setMethod} disabled={busy} />

          <form onSubmit={handleSubmit} className="space-y-1">
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-xs font-bold text-neutral-800">
                Correo electrónico
              </label>
              <input
                id="signup-email"
                type="email"
                className={AUTH_INPUT_CLASS}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                disabled={busy}
              />
            </div>

            {method === 'password' && (
              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-2 block text-xs font-bold text-neutral-800"
                >
                  Contraseña
                </label>
                <input
                  id="signup-password"
                  type="password"
                  className={AUTH_INPUT_CLASS}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  disabled={busy}
                />
              </div>
            )}

            {error && (
              <p className="mb-2 text-xs font-medium text-red-600" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className={AUTH_PRIMARY_BTN}>
              {loading === 'signup' || loading === 'magic' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                method === 'magic' ? 'Enviar enlace mágico' : 'Crear cuenta'
              )}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  )
}
