import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthProvider'
import { isWelcomeComplete, markWelcomeComplete } from './data/onboarding'
import Dashboard from './views/Dashboard'
import Login from './views/Login'
import WelcomeWizard from './views/WelcomeWizard'

function AppShell() {
  const {
    isReady,
    isLoggedIn,
    isGuest,
    user,
    loginWithEmail,
    loginWithGoogle,
    enterAsGuest,
  } = useAuth()
  const [welcomeDone, setWelcomeDone] = useState(() => isWelcomeComplete())

  const handleWelcomeFinish = () => {
    markWelcomeComplete()
    setWelcomeDone(true)
  }

  if (!isReady) {
    return <div className="h-full bg-white" aria-hidden />
  }

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={loginWithEmail}
        onGoogleLogin={loginWithGoogle}
        onSkip={enterAsGuest}
      />
    )
  }

  if (!welcomeDone) {
    return (
      <WelcomeWizard
        onFinish={handleWelcomeFinish}
        userName={user?.fullName}
        isGuest={isGuest}
      />
    )
  }

  return <Dashboard />
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
