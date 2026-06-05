import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

const INPUT_CLASS =
  'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-0'

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function Login({ onLogin, onGoogleLogin, onSkip }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(null)

  const run = async (key, fn) => {
    setError('')
    setLoading(key)
    try {
      await fn()
    } catch (err) {
      setError(err?.message ?? 'No pudimos iniciar sesión. Intentá de nuevo.')
    } finally {
      setLoading(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    run('email', () => onLogin?.({ email, password }))
  }

  const handleGoogle = () => run('google', () => onGoogleLogin?.())

  const handleSkip = () => {
    setError('')
    onSkip?.()
  }

  const busy = Boolean(loading)

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#fafafa]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-10 text-center">
          <p className="font-display text-2xl font-black tracking-tight text-neutral-900">Uanabi</p>
          <h1 className="mt-6 font-display text-3xl font-black tracking-tight text-neutral-900">
            Iniciá sesión
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            Conectá tu cuenta para guardar eventos, propuestas y tu perfil de Host.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-bold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-60"
          >
            {loading === 'google' ? (
              <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
            ) : (
              <GoogleMark />
            )}
            Continuar con Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-100" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">
              o con email
            </span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-neutral-800">
                Correo electrónico
              </label>
              <input
                type="email"
                className={INPUT_CLASS}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                disabled={busy}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-neutral-800">Contraseña</label>
              <input
                type="password"
                className={INPUT_CLASS}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={busy}
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading === 'email' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleSkip}
            disabled={busy}
            className="text-xs font-semibold text-neutral-400 transition hover:text-neutral-900 disabled:opacity-60"
          >
            Continuar sin cuenta
          </button>
          <p className="mt-2 text-[11px] text-neutral-400">
            Explorá la plataforma como invitado. Podés iniciar sesión cuando quieras.
          </p>
        </div>
      </div>
    </div>
  )
}
