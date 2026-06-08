import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isOnboardingSkipped } from '../data/appSession'
import { isProfileConfigured } from '../lib/profiles'

const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/callback']

export function useAuthGatekeeper({ isReady, session, profile, profileLoading }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isReady) return

    const path = location.pathname
    const isAuthPath = AUTH_PATHS.some((p) => path.startsWith(p))
    const isCallback = path === '/auth/callback'

    if (!session) {
      if (!isAuthPath) {
        navigate('/auth/login', { replace: true, state: { from: path } })
      }
      return
    }

    if (profileLoading) return

    const profileComplete = isProfileConfigured(profile)
    const skippedOnboarding = isOnboardingSkipped()

    if (!profileComplete && !skippedOnboarding) {
      if (path !== '/profile') {
        navigate('/profile', { replace: true })
      }
      return
    }

    if (isAuthPath && !isCallback) {
      navigate('/dashboard', { replace: true })
      return
    }

    if (path === '/') {
      navigate('/dashboard', { replace: true })
      return
    }

    if (path === '/profile' && profileComplete) {
      navigate('/dashboard', { replace: true })
    }
  }, [isReady, session, profile, profileLoading, location.pathname, navigate])
}
