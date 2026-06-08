import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Mail } from 'lucide-react'
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

function MagicLinkSuccess({ email }) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
        <Mail className="h-5 w-5 text-neutral-700" strokeWidth={1.75} />
      </div>
      <p className="text-sm leading-relaxed text-neutral-700">
        📨 Te enviamos un enlace de acceso rápido a{' '}
        <span className="font-bold text-neutral-900">{email}</span>. Revisá tu bandeja de entrada y
        hacé clic en el link para ingresar.
      </p>
      <Link
        to="/auth/login"
        className="inline-block text-xs font-bold text-neutral-900 underline-offset-2 hover:underline"
        onClick={(e) => e.preventDefault()}
      >
        ¿No llegó? Revisá spam o intentá de nuevo
      </Link>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const {
    isReady,
    session,
    profile,
    profileLoading,
    signInWithPassword,
    signInWithMagicLink,
    signInWithGoogle,
  } = useAuth()

  const [method, setMethod] = useState('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(null)
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

    run('password', () => signInWithPassword({ email, password }))
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
        <AuthFooterLink to="/auth/signup">
          ¿Todavía no tenés cuenta?
        </AuthFooterLink>
      }
    >
      <div className="space-y-2">
        <h1 className={AUTH_TITLE_CLASS}>Bienvenido de vuelta</h1>
        <p className="text-center text-xs leading-relaxed text-neutral-500">
          Ingresá a tu cuenta para gestionar eventos y propuestas de patrocinio.
        </p>
      </div>

      {magicSent ? (
        <MagicLinkSuccess email={email.trim()} />
      ) : (
        <>
          <GoogleSignInButton onClick={handleGoogle} loading={loading === 'google'} disabled={busy} />

          <AuthDivider />

          <AuthMethodTabs value={method} onChange={setMethod} disabled={busy} />

          <form onSubmit={handleSubmit} className="space-y-1">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-xs font-bold text-neutral-800">
                Correo electrónico
              </label>
              <input
                id="login-email"
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
                  htmlFor="login-password"
                  className="mb-2 block text-xs font-bold text-neutral-800"
                >
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  className={AUTH_INPUT_CLASS}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              {loading === 'password' || loading === 'magic' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {method === 'magic' ? 'Enviar enlace mágico' : 'Ingresar'}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  )
}
