import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { clearGuestAuthStorage, completeAuthCallback } from '../../../lib/authCallback'
import { fetchUserProfile, isProfileConfigured } from '../../../lib/profiles'
import { supabase } from '../../../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Validando tu acceso…')

  useEffect(() => {
    let active = true

    async function finishAuth() {
      try {
        setStatus('Procesando enlace de acceso…')
        clearGuestAuthStorage()

        const session = await completeAuthCallback(supabase)
        if (!active) return

        setStatus('Cargando tu perfil…')

        let destination = '/profile'
        try {
          const { data } = await fetchUserProfile(session.user.id)
          if (isProfileConfigured(data ? { whatsapp: data.whatsapp } : null)) {
            destination = '/dashboard'
          }
        } catch {
          destination = '/profile'
        }

        if (!active) return

        // Recarga limpia: el AuthProvider arranca sin modo invitado y lee la sesión real.
        window.location.replace(destination)
      } catch (err) {
        if (!active) return
        setError(err?.message ?? 'No pudimos validar tu sesión.')
      }
    }

    finishAuth()

    return () => {
      active = false
    }
  }, [])

  if (error) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa] px-6 text-center">
        <p className="max-w-sm text-sm font-semibold text-red-600">{error}</p>
        <p className="mt-3 max-w-sm text-xs leading-relaxed text-neutral-500">
          Verificá en Supabase → Authentication → URL Configuration que esté agregada la URL{' '}
          <code className="text-neutral-700">{window.location.origin}/auth/callback</code>
        </p>
        <button
          type="button"
          onClick={() => navigate('/auth/login', { replace: true })}
          className="mt-6 text-xs font-bold text-neutral-900 underline"
        >
          Volver al login
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa]">
      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      <p className="mt-3 text-xs text-neutral-500">{status}</p>
    </div>
  )
}
