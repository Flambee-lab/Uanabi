import { useCallback, useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { buildCallbackRedirectPath } from './lib/authCallback'
import { AuthProvider, useAuth } from './context/AuthProvider'
import { useAuthGatekeeper } from './hooks/useAuthGatekeeper'
import { useBrandGatekeeper } from './hooks/useBrandGatekeeper'
import { useSocialOAuthCallback } from './hooks/useSocialOAuthCallback'
import { DEFAULT_HOST_PROFILE } from './data/hostProfile'
import { enableDevAuth } from './lib/supabase'
import AuthCallbackPage from './app/auth/callback/page'
import LoginPage from './app/auth/login/page'
import SignupPage from './app/auth/signup/page'
import Dashboard from './views/Dashboard'
import HostRegistrationWizard from './views/HostRegistrationWizard'
import BrandLogin from './views/brands/BrandLogin'
import BrandVerification from './views/brands/BrandVerification'
import BrandDashboard from './views/brands/BrandDashboard'
import BrandSettings from './views/brands/BrandSettings'
import EventBrandPreviewView from './views/EventBrandPreviewView'
import { isProfileConfigured } from './lib/profiles'
import { getEventPreviewIdFromUrl } from './utils/eventBrandPreview'

function SupabaseSetupNotice() {
  const handleDevMode = () => {
    enableDevAuth()
    window.location.href = '/auth/login'
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[#fafafa] px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm">
        <p className="text-center font-display text-lg font-black text-neutral-900">Onbrand</p>
        <h1 className="mt-4 text-center text-sm font-bold text-neutral-800">
          Falta conectar Supabase
        </h1>
        <p className="mt-2 text-center text-xs leading-relaxed text-neutral-500">
          El archivo <code className="text-neutral-700">.env.local</code> existe, pero todav├¡a no
          tiene credenciales reales.
        </p>

        <ol className="mt-6 space-y-4 text-left text-xs text-neutral-600">
          <li className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
              1
            </span>
            <span>
              Cre├í un proyecto en{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-neutral-900 underline"
              >
                supabase.com/dashboard
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
              2
            </span>
            <span>
              En <strong>Project Settings ΓåÆ API</strong>, copi├í la{' '}
              <strong>Project URL</strong> y la <strong>anon public key</strong> a{' '}
              <code className="text-neutral-800">.env.local</code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
              3
            </span>
            <span>
              En <strong>SQL Editor</strong>, peg├í y ejecut├í el contenido de{' '}
              <code className="text-neutral-800">supabase/schema.sql</code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
              4
            </span>
            <span>
              En <strong>Authentication ΓåÆ URL Configuration</strong>, agreg├í{' '}
              <code className="text-neutral-800">http://localhost:5173/auth/callback</code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
              5
            </span>
            <span>
              <strong>Reinici├í</strong> el servidor (<code className="text-neutral-800">npm run dev</code>)
              para que Vite cargue las variables
            </span>
          </li>
        </ol>

        <button
          type="button"
          onClick={handleDevMode}
          className="mt-8 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100"
        >
          Seguir en modo demo (sin Supabase)
        </button>
      </div>
    </div>
  )
}

function OnboardingRoute() {
  const navigate = useNavigate()
  const { user, profile, saveProfile } = useAuth()

  const handleComplete = useCallback(
    async (nextProfile, { openCreateEvent = false } = {}) => {
      await saveProfile({ ...nextProfile, isConfigured: true })
      const qs = openCreateEvent ? '?createEvent=1' : ''
      navigate(`/dashboard${qs}`, { replace: true })
    },
    [navigate, saveProfile],
  )

  return (
    <div className="h-dvh min-h-dvh overflow-hidden">
      <HostRegistrationWizard profile={profile} authUser={user} onComplete={handleComplete} />
    </div>
  )
}

function DashboardRoute() {
  const { profile, saveProfile } = useAuth()
  const params = new URLSearchParams(window.location.search)
  const initialOpenCreateEvent = params.get('createEvent') === '1'

  return (
    <Dashboard
      initialProfile={profile ?? DEFAULT_HOST_PROFILE}
      initialOpenCreateEvent={initialOpenCreateEvent}
      initialNav="matches"
      onProfilePersist={async (next) => {
        await saveProfile(next)
      }}
    />
  )
}

/** Captura enlaces de email/OAuth que aterrizan en `/` u otra ruta con tokens. */
function AuthCallbackCapture() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const target = buildCallbackRedirectPath(window.location)
    if (target) {
      navigate(target, { replace: true })
    }
  }, [location.pathname, location.search, location.hash, navigate])

  return null
}

function ProtectedRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const restartHandled = useRef(false)
  const {
    isReady,
    session,
    profile,
    brandProfile,
    role,
    profileLoading,
    isSupabaseConfigured,
    isDevAuth,
    restartOnboarding,
    saveProfile,
    refreshProfile,
  } = useAuth()

  useAuthGatekeeper({ isReady, session, profile, profileLoading, role })
  useBrandGatekeeper({ isReady, session, role, brandProfile })
  useSocialOAuthCallback({ profile, saveProfile, refreshProfile })

  useEffect(() => {
    if (!isReady || !session || restartHandled.current) return

    const params = new URLSearchParams(location.search)
    if (params.get('restartOnboarding') !== '1') return

    restartHandled.current = true
    restartOnboarding()
      .then(() => navigate('/profile', { replace: true }))
      .catch(() => {
        restartHandled.current = false
      })
  }, [isReady, session, location.search, restartOnboarding, navigate])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <p className="text-sm text-neutral-500">Cargando…</p>
      </div>
    )
  }

  if (!isSupabaseConfigured && !isDevAuth && !import.meta.env.DEV) {
    return <SupabaseSetupNotice />
  }

  return (
    <>
      <AuthCallbackCapture />
      <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/brands/login" element={<BrandLogin />} />
      <Route
        path="/brands/verification"
        element={session && role === 'brand' ? <BrandVerification /> : <Navigate to="/brands/login" replace />}
      />
      <Route
        path="/brands/dashboard"
        element={session && role === 'brand' ? <BrandDashboard /> : <Navigate to="/brands/login" replace />}
      />
      <Route
        path="/brands/settings"
        element={session && role === 'brand' ? <BrandSettings /> : <Navigate to="/brands/login" replace />}
      />
      <Route path="/brands" element={<Navigate to="/brands/dashboard" replace />} />
      <Route
        path="/profile"
        element={session ? <OnboardingRoute /> : <Navigate to="/auth/login" replace />}
      />
      <Route
        path="/dashboard"
        element={session ? <DashboardRoute /> : <Navigate to="/auth/login" replace />}
      />
      <Route
        path="/"
        element={
          <Navigate
            to={
              session
                ? isProfileConfigured(profile)
                  ? '/dashboard'
                  : '/profile'
                : '/auth/login'
            }
            replace
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

function App() {
  const previewEventId = getEventPreviewIdFromUrl()
  if (previewEventId) {
    return <EventBrandPreviewView eventId={previewEventId} />
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
