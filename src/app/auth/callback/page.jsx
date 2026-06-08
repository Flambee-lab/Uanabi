import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../../context/AuthProvider'
import { isProfileConfigured } from '../../../lib/profiles'
import { isOnboardingSkipped } from '../../../data/appSession'
import { supabase } from '../../../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { isReady, session, profile, profileLoading } = useAuth()
  const [error, setError] = useState('')
  const [authDone, setAuthDone] = useState(false)

  useEffect(() => {
    let active = true

    async function finishAuth() {
      if (!supabase) {
        setError('Supabase no está configurado.')
        return
      }

      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
        } else {
          const { error: sessionError } = await supabase.auth.getSession()
          if (sessionError) throw sessionError
        }

        if (!active) return
        setAuthDone(true)
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

  useEffect(() => {
    if (!authDone || !isReady || !session || profileLoading) return

    const destination =
      isProfileConfigured(profile) || isOnboardingSkipped() ? '/dashboard' : '/profile'
    navigate(destination, { replace: true })
  }, [authDone, isReady, session, profile, profileLoading, navigate])

  if (error) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa] px-6 text-center">
        <p className="text-sm font-semibold text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/auth/login', { replace: true })}
          className="mt-4 text-xs font-bold text-neutral-900 underline"
        >
          Volver al login
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa]">
      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      <p className="mt-3 text-xs text-neutral-500">Validando tu acceso…</p>
    </div>
  )
}
