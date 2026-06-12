import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../../context/AuthProvider'
import { BRAND_LOGIN_EMAIL } from '../../lib/brandAuth'
import { BRAND_INPUT_CLASS, BRAND_EMERALD, BRAND_SLATE } from '../../components/brands/BrandPanelShell'

export default function BrandLogin() {
  const navigate = useNavigate()
  const { signInAsBrand } = useAuth()
  const [email, setEmail] = useState(BRAND_LOGIN_EMAIL)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInAsBrand({ email, password })
      navigate('/brands/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message ?? 'No pudimos iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh">
      <aside
        className="hidden w-[44%] flex-col justify-between p-10 lg:flex xl:p-14"
        style={{ backgroundColor: BRAND_SLATE }}
      >
        <div>
          <p className="font-display text-2xl font-black tracking-tight text-white">UANABI Brands</p>
          <p className="mt-2 text-sm text-slate-400">Panel de marcas patrocinadoras</p>
        </div>
        <div className="space-y-4">
          <p className="text-lg font-semibold leading-snug text-white">
            Gestioná propuestas de hosts sin buscar eventos — solo respondé lo que llega a tu bandeja.
          </p>
          <p className="text-sm text-slate-500">
            Validación humana de identidad · Templates de rechazo amigables · Contacto directo al aceptar.
          </p>
        </div>
        <p className="text-xs text-slate-600">© UANABI · Flambee Lab</p>
      </aside>

      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="font-display text-xl font-black text-slate-900">UANABI Brands</p>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
            <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">
              Ingresá a tu marca
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Acceso exclusivo para cuentas de patrocinadores verificados.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="brand-email" className="mb-2 block text-xs font-bold text-slate-800">
                  Mail corporativo
                </label>
                <input
                  id="brand-email"
                  type="email"
                  className={BRAND_INPUT_CLASS}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="brand-password" className="mb-2 block text-xs font-bold text-slate-800">
                  Contraseña
                </label>
                <input
                  id="brand-password"
                  type="password"
                  className={BRAND_INPUT_CLASS}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full py-3 font-bold text-white hover:opacity-90"
                style={{ backgroundColor: BRAND_EMERALD }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ingresando…
                  </>
                ) : (
                  'Entrar al panel'
                )}
              </Button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            ¿Sos host?{' '}
            <a href="/auth/login" className="font-semibold text-slate-800 underline-offset-2 hover:underline">
              Ir al login de organizadores
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
