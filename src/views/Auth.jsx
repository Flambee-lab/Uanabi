import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import {
  AUTH_INPUT_CLASS,
  AUTH_PRIMARY_BTN,
  AUTH_TITLE_CLASS,
} from '../components/auth/authStyles'
import { useAuth } from '../context/AuthProvider'
import { getDevLoginCredentials, isLocalAuthMode } from '../lib/devLogin'
import { isProfileConfigured } from '../lib/profiles'

const FLOW_STEPS = [
  { n: 1, label: 'Login', desc: 'Ingresá con tu mail y contraseña' },
  { n: 2, label: 'Wizard', desc: 'Completá tu perfil de Host' },
  { n: 3, label: 'Plataforma', desc: 'Gestioná eventos y marcas' },
]

export default function Auth() {
  const navigate = useNavigate()
  const localAuth = isLocalAuthMode()
  const devCreds = getDevLoginCredentials()

  const { isReady, session, profile, signInWithLocalCredentials, enterAsGuest } = useAuth()

  const [email, setEmail] = useState(devCreds.email ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(null)

  // Tras login siempre al wizard (paso 2); la plataforma viene después de completarlo
  useEffect(() => {
    if (!isReady || !session) return
    if (localAuth) {
      navigate('/profile', { replace: true })
      return
    }
    navigate(isProfileConfigured(profile) ? '/dashboard' : '/profile', { replace: true })
  }, [isReady, session, profile, navigate, localAuth])

  const run = async (key, fn) => {
    setError('')
    setLoading(key)
    try {
      await fn()
    } catch (err) {
      setError(err?.message ?? 'No pudimos ingresar.')
    } finally {
      setLoading(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Ingresá tu contraseña.')
      return
    }
    run('login', () => signInWithLocalCredentials({ email, password }))
  }

  const handleSkip = () => run('skip', enterAsGuest)

  const busy = Boolean(loading)

  if (!isReady) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa]">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (session && loading !== 'login') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa]">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        <p className="mt-3 text-xs text-neutral-500">Redirigiendo…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa] px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm">
        <p className="text-center font-display text-lg font-black text-neutral-900">Onbrand</p>
        <h1 className={`mt-4 ${AUTH_TITLE_CLASS}`}>Paso 1 — Iniciá sesión</h1>
        <p className="mt-2 text-center text-xs leading-relaxed text-neutral-500">
          {localAuth
            ? 'Acceso local de desarrollo. Después vas al wizard y recién ahí a la plataforma.'
            : 'Ingresá para continuar.'}
        </p>

        <div className="mt-6 flex justify-center gap-2">
          {FLOW_STEPS.map((step) => (
            <div
              key={step.n}
              className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                step.n === 1
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {step.n}. {step.label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="dev-email" className="mb-2 block text-xs font-bold text-neutral-800">
              Email
            </label>
            <input
              id="dev-email"
              type="email"
              className={AUTH_INPUT_CLASS}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              disabled={busy}
            />
          </div>
          <div>
            <label htmlFor="dev-password" className="mb-2 block text-xs font-bold text-neutral-800">
              Contraseña
            </label>
            <input
              id="dev-password"
              type="password"
              className={AUTH_INPUT_CLASS}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña de desarrollo"
              autoComplete="current-password"
              disabled={busy}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className={AUTH_PRIMARY_BTN}>
            {loading === 'login' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Ingresar y continuar al wizard
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={handleSkip}
          disabled={busy}
          className="mt-4 w-full text-center text-xs font-semibold text-neutral-500 hover:text-neutral-900 disabled:opacity-60"
        >
          {loading === 'skip' ? 'Entrando…' : 'Entrar como invitado nuevo (sin contraseña) →'}
        </button>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-neutral-400">
          Si ya completaste el wizard antes, al ingresar vas directo a la plataforma. Para repetir
          el wizard, cerrá sesión desde Configuración.
        </p>
      </div>
    </div>
  )
}
