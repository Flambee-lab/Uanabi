import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isBrandOnboardingComplete } from '../data/brandProfile'

const BRAND_PUBLIC_PATHS = ['/brands/login']

export function useBrandGatekeeper({ isReady, session, role, brandProfile }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isReady) return

    const path = location.pathname
    if (!path.startsWith('/brands')) return

    const isPublic = BRAND_PUBLIC_PATHS.some((p) => path.startsWith(p))

    if (!session || role !== 'brand') {
      if (!isPublic) {
        navigate('/brands/login', { replace: true })
      }
      return
    }

    if (isPublic) {
      navigate('/brands/dashboard', { replace: true })
      return
    }

    const onboardingComplete = isBrandOnboardingComplete(brandProfile)

    if (!onboardingComplete && path !== '/brands/verification') {
      navigate('/brands/verification', { replace: true })
      return
    }

    if (onboardingComplete && path === '/brands/verification') {
      navigate('/brands/dashboard', { replace: true })
    }
  }, [isReady, session, role, brandProfile, location.pathname, navigate])
}
