import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isBrandOnboardingComplete } from '../data/brandProfile'

// El wizard de registro es público: la marca aplica primero y recibe credenciales al ser validada
const BRAND_PUBLIC_PATHS = ['/brands/verification']

export function useBrandGatekeeper({ isReady, session, role, brandProfile }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isReady) return

    const path = location.pathname
    if (!path.startsWith('/brands')) return

    const isPublic =
      path === '/brands' || BRAND_PUBLIC_PATHS.some((p) => path.startsWith(p))

    if (!session || role !== 'brand') {
      if (!isPublic) {
        navigate('/brands/verification', { replace: true })
      }
      return
    }

    const onboardingComplete = isBrandOnboardingComplete(brandProfile)

    if (!onboardingComplete && !path.startsWith('/brands/verification')) {
      navigate('/brands/verification', { replace: true })
      return
    }

    if (onboardingComplete && path.startsWith('/brands/verification')) {
      navigate('/brands/dashboard', { replace: true })
    }
  }, [isReady, session, role, brandProfile, location.pathname, navigate])
}
