import { useEffect, useMemo, useRef, useState } from 'react'
import ExploreSearchCapsule from '../components/explore/ExploreSearchCapsule'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import AppNavbar from '../components/layout/AppNavbar'
import GuestBanner from '../components/layout/GuestBanner'
import ApplyToBrandModal from '../components/apply/ApplyToBrandModal'
import InvitationWizard from './InvitationWizard'
import { saveInvitacionMarca, fetchInvitacionesMarcasForEvents, mergeInvitacionesMarcasIntoEvents } from '../lib/invitacionesMarcas'
import {
  appendInvitationToEvent,
  buildCommercialSnapshot,
  createInvitationRecord,
} from '../utils/sponsorshipProposal'
import Toast from '../components/ui/Toast'
import {
  createApplicationFromSubmission,
} from '../data/hostEvents'
import { mockNotifications as initialNotifications } from '../data/mockNotifications'
import { restoreInlineNotification } from '../utils/eventInlineNotifications'
import {
  DEFAULT_HOST_PROFILE,
  getProfileDisplayName,
  HOST_PROFILE_STORAGE_KEY,
  mergeProfileForSave,
} from '../data/hostProfile'
import { DEFAULT_AUTH_USER } from '../data/auth'
import { GUEST_BANNER_KEY } from '../data/appSession'
import {
  availableBrands,
  mockBrands,
  myApplications as initialApplications,
  myEvents as initialMyEvents,
} from '../data/mockEvents'
import { withRuntimeDemoDates } from '../utils/myEventsRuntime'
import CreateEventView from './CreateEventView'
import ExploreHome from './ExploreHome'
import MyEventsAndProposals from './MyEventsAndProposals'
import Profile from './Profile'
import AccountSettings from './AccountSettings'
import { DEFAULT_ACCOUNT_SETTINGS } from '../data/accountSettings'

export default function Dashboard({
  initialProfile = DEFAULT_HOST_PROFILE,
  initialOpenCreateEvent = false,
  initialNav = 'explore',
  onProfilePersist,
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isGuest, isAuthenticated, user, profile: authProfile, logout, restartOnboarding } =
    useAuth()
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(
    () => localStorage.getItem(GUEST_BANNER_KEY) === '1',
  )

  const [brands, setBrands] = useState(mockBrands)
  const [myEvents, setMyEvents] = useState(() => withRuntimeDemoDates(initialMyEvents))
  const [applications, setApplications] = useState(initialApplications)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeNav, setActiveNav] = useState(initialNav)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(initialOpenCreateEvent)
  const [focusEventId, setFocusEventId] = useState(null)
  const [hostProfile, setHostProfile] = useState(initialProfile)
  const [applyTarget, setApplyTarget] = useState(null)
  const [invitationWizard, setInvitationWizard] = useState(null)
  const [invitationSaving, setInvitationSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [accountSettings, setAccountSettings] = useState(DEFAULT_ACCOUNT_SETTINGS)
  const [profileEditSection, setProfileEditSection] = useState(null)
  const [exploreSearchQuery, setExploreSearchQuery] = useState('')
  const [exploreRubro, setExploreRubro] = useState(null)
  const [exploreSearchDockProgress, setExploreSearchDockProgress] = useState(0)
  const mainScrollRef = useRef(null)

  useEffect(() => {
    if (activeNav !== 'explore') {
      setExploreSearchDockProgress(0)
    }
  }, [activeNav])

  useEffect(() => {
    if (searchParams.get('callback') === 'true') {
      setActiveNav('profile')
    }
  }, [searchParams])

  useEffect(() => {
    if (authProfile) {
      setHostProfile((prev) => ({ ...prev, ...authProfile }))
    }
  }, [authProfile])

  useEffect(() => {
    if (!isAuthenticated || !user) return
    setHostProfile((prev) => {
      const isDemoAccount = user.email?.trim().toLowerCase() === DEFAULT_AUTH_USER.email
      const profileName = getProfileDisplayName(prev)
      const nextFullName = isDemoAccount
        ? profileName
        : user.fullName?.trim() || profileName

      return {
        ...prev,
        fullName: nextFullName,
      }
    })
    setAccountSettings((prev) => ({
      ...prev,
      email: user.email,
      authProvider: user.provider === 'google' ? 'google' : 'email',
    }))
  }, [isAuthenticated, user])

  useEffect(() => {
    if (!isAuthenticated || myEvents.length === 0) return

    let cancelled = false
    const eventIds = myEvents.map((event) => event.id)

    fetchInvitacionesMarcasForEvents(eventIds).then(({ data, error }) => {
      if (cancelled || error || !data?.length) return
      setMyEvents((prev) => mergeInvitacionesMarcasIntoEvents(prev, data, availableBrands))
    })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, myEvents.length])

  const hostEventsForModal = useMemo(
    () =>
      myEvents.map((e) => ({
        id: e.id,
        title: e.title,
        socialLink: e.socialLink ?? '',
        location: e.location,
        isVirtual: e.location === 'Virtual',
        audience: e.audience,
        offers: e.offers ?? [],
        seeks: e.seeks ?? [],
      })),
    [myEvents],
  )

  const handleStartApply = (brandId) => {
    const brand = brands.find((b) => b.id === brandId)
    if (brand && brand.applicationStatus === 'disponible') {
      setApplyTarget(brand)
    }
  }

  const handleSubmitApplication = ({ event, isNew }) => {
    if (!applyTarget) return

    if (isNew) {
      setMyEvents((prev) => [
        ...prev,
        {
          id: event.id,
          title: event.title,
          date: new Date().toISOString().slice(0, 10),
          location: event.location,
          audience: event.audience,
          socialLink: event.socialLink,
          offers: event.offers,
          seeks: event.seeks,
          niche: 'Entretenimiento',
          matchIndustries: ['Bebidas', 'Entretenimiento'],
          description:
            'Describí tu evento: qué experiencia ofrecés, quién es tu audiencia y qué tipo de sponsors buscás.',
          coverGradient: 'from-neutral-200 via-stone-100 to-white',
          time: '19:00',
          organizer: { name: 'Host Demo', role: 'Organizador' },
          invitedBrands: [],
        },
      ])
    }

    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === applyTarget.id ? { ...brand, applicationStatus: 'enviada' } : brand,
      ),
    )

    setApplications((prev) => [
      createApplicationFromSubmission(applyTarget, event),
      ...prev,
    ])

    setToast(`Postulación enviada a ${applyTarget.name}`)
    setApplyTarget(null)
  }

  const handleOpenChat = () => {
    setToast('La mensajería estará disponible pronto')
  }

  const openInvitationWizard = (brandId, activeEvent = null) => {
    const brand =
      brands.find((b) => b.id === brandId) ?? availableBrands.find((b) => b.id === brandId)
    if (!brand) return
    setInvitationWizard({ brand, activeEvent })
  }

  const handleRequestPartnership = (brandId) => {
    openInvitationWizard(brandId, null)
  }

  const handleSubmitInvitation = async ({
    event,
    brand,
    productosSolicitados,
    entregablesOfrecidos,
    fechaLimiteEntrega,
    mensajeExtra,
    cantidadEstimada,
    direccionEntrega,
    whatsapp,
  }) => {
    if (!invitationWizard?.brand || !event?.id) return

    setInvitationSaving(true)
    try {
      if (whatsapp?.trim()) {
        const nextProfile = mergeProfileForSave(hostProfile, { whatsapp: whatsapp.trim() })
        setHostProfile(nextProfile)
        onProfilePersist?.(nextProfile)
      }

      const { error: dbError, persisted } = await saveInvitacionMarca({
        eventoId: event.id,
        marcaNombre: brand?.name ?? invitationWizard.brand.name,
        productosSolicitados,
        entregablesOfrecidos,
        fechaLimiteEntrega,
        mensajeExtra,
        cantidadEstimada,
        direccionEntrega,
        whatsapp,
      })

      const logisticsLines = [
        direccionEntrega ? `Entrega: ${direccionEntrega}` : '',
        whatsapp ? `WhatsApp: ${whatsapp}` : '',
      ].filter(Boolean)

      const invitation = createInvitationRecord(invitationWizard.brand.id, {
        productosSolicitados,
        entregablesOfrecidos,
        fechaLimiteEntrega,
        mensajeExtra,
        materialRequest: [
          ...productosSolicitados.map((p) => `• ${p}`),
          ...entregablesOfrecidos.map((e) => `✓ ${e}`),
          ...logisticsLines,
          mensajeExtra ? `Nota: ${mensajeExtra}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        leadTimeDays: '7',
        commercialSnapshot: buildCommercialSnapshot(event),
      })

      setMyEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? appendInvitationToEvent(ev, invitation) : ev)),
      )

      const brandName = brand?.name ?? invitationWizard.brand.name
      setToast({
        title: '¡Invitación enviada!',
        message: persisted
          ? `${brandName} recibió tu propuesta y quedó registrada en la plataforma.`
          : `${brandName} recibió tu propuesta. Tiene 7 días hábiles para contactarte por WhatsApp.`,
      })

      if (dbError && import.meta.env.DEV) {
        console.warn('[invitaciones_marcas]', dbError.message)
      }
    } finally {
      setInvitationSaving(false)
      setInvitationWizard(null)
    }
  }

  const handleBrandsMatch = (brandId) => {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brandId ? { ...b, applicationStatus: 'match_aceptado' } : b,
      ),
    )
    setToast('Match confirmado')
  }

  const handleNavChange = (navId) => {
    setActiveNav(navId)
    setNotificationsOpen(false)
    if (navId !== 'profile') setProfileEditSection(null)
  }

  const handleOpenCreateEvent = () => {
    setNotificationsOpen(false)
    setIsCreateEventOpen(true)
  }

  const handleCreateEventSubmit = (event) => {
    setMyEvents((prev) => [event, ...prev])
    setFocusEventId(event.id)
    setActiveNav('matches')
    setIsCreateEventOpen(false)
    setToast('Evento creado')
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
    )
    setNotificationsOpen(false)

    if (notif.eventId && notif.brandId && notif.invitationStatus) {
      restoreInlineNotification(notif.eventId, notif.brandId, notif.invitationStatus)
    }
    if (notif.eventId) setFocusEventId(notif.eventId)
    if (notif.navTarget) handleNavChange(notif.navTarget)
  }

  const mainScrolls =
    (activeNav === 'explore' || activeNav === 'profile' || activeNav === 'settings') &&
    !isCreateEventOpen

  const handleLogout = () => {
    logout()
    setToast(isGuest ? 'Modo invitado finalizado' : 'Sesión cerrada')
  }

  const handleRequestLogin = () => {
    logout()
  }

  const dismissGuestBanner = () => {
    setGuestBannerDismissed(true)
    localStorage.setItem(GUEST_BANNER_KEY, '1')
  }

  const showGuestBanner = isGuest && !guestBannerDismissed && !isCreateEventOpen

  return (
    <div className="uanabi-shell flex h-full flex-col overflow-hidden">
      {showGuestBanner && (
        <GuestBanner onLogin={handleRequestLogin} onDismiss={dismissGuestBanner} />
      )}

      {!isCreateEventOpen && (
        <AppNavbar
          activeNav={activeNav}
          onNavChange={handleNavChange}
          notifications={notifications}
          notificationsOpen={notificationsOpen}
          onNotificationsToggle={() => setNotificationsOpen((o) => !o)}
          onNotificationsClose={() => setNotificationsOpen(false)}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotificationClick}
          hostProfile={hostProfile}
          isGuest={isGuest}
          exploreSearchDocked={
            activeNav === 'explore'
              ? {
                  progress: exploreSearchDockProgress,
                  search: (
                    <ExploreSearchCapsule
                      variant="compact"
                      searchQuery={exploreSearchQuery}
                      onSearchChange={setExploreSearchQuery}
                      selectedRubro={exploreRubro}
                      onSelectRubro={setExploreRubro}
                    />
                  ),
                }
              : null
          }
          onUserMenuAction={(action) => {
            if (action === 'my-profile') handleNavChange('profile')
            else if (action === 'profile-settings') handleNavChange('settings')
            else if (action === 'event-manager') handleNavChange('matches')
            else if (action === 'privacy') setToast('Privacidad — próximamente')
            else if (action === 'logout') handleLogout()
          }}
        />
      )}

      <main
        ref={mainScrollRef}
        className={`flex min-h-0 flex-1 flex-col overflow-hidden bg-white ${
          mainScrolls ? 'overflow-y-auto' : ''
        }`}
      >
        {!isCreateEventOpen && activeNav === 'explore' && (
          <ExploreHome
            brands={brands}
            hostEvents={myEvents}
            onRequestPartnership={handleRequestPartnership}
            scrollRootRef={mainScrollRef}
            onSearchDockProgress={setExploreSearchDockProgress}
            searchQuery={exploreSearchQuery}
            onSearchChange={setExploreSearchQuery}
            selectedRubro={exploreRubro}
            onSelectRubro={setExploreRubro}
          />
        )}

        {!isCreateEventOpen && activeNav === 'matches' && (
          <MyEventsAndProposals
            events={myEvents}
            hostProfile={hostProfile}
            onEventsChange={setMyEvents}
            onCreateEvent={handleOpenCreateEvent}
            focusEventId={focusEventId}
            onFocusEventConsumed={() => setFocusEventId(null)}
            onGoToProfile={() => handleNavChange('profile')}
            onProposeToBrand={(brandId, activeEvent) =>
              openInvitationWizard(brandId, activeEvent)
            }
          />
        )}

        {!isCreateEventOpen && activeNav === 'profile' && (
          <Profile
            profile={hostProfile}
            brands={brands}
            onProfileChange={(next) => {
              setHostProfile(next)
              onProfilePersist?.(next)
              setToast('Perfil actualizado')
            }}
            events={myEvents}
            editingSection={profileEditSection}
            onEditingChange={setProfileEditSection}
          />
        )}

        {!isCreateEventOpen && activeNav === 'settings' && (
          <AccountSettings
            settings={accountSettings}
            onSave={(next) => {
              setAccountSettings(next)
              setHostProfile((prev) => ({
                ...prev,
                commercialContactEnabled: next.commercialContactEnabled,
              }))
              setToast('Configuración de cuenta guardada')
            }}
            onDeleteAccount={() => {
              setToast('Cuenta eliminada (simulación Supabase)')
              setHostProfile(DEFAULT_HOST_PROFILE)
              onProfilePersist?.(DEFAULT_HOST_PROFILE)
              setAccountSettings(DEFAULT_ACCOUNT_SETTINGS)
              try {
                localStorage.removeItem(HOST_PROFILE_STORAGE_KEY)
              } catch {
                /* ignore */
              }
              logout()
            }}
            onRestartOnboarding={async () => {
              await restartOnboarding()
              setHostProfile(DEFAULT_HOST_PROFILE)
              navigate('/profile', { replace: true })
            }}
          />
        )}
      </main>

      {isCreateEventOpen && (
        <CreateEventView
          onClose={() => setIsCreateEventOpen(false)}
          onSubmit={handleCreateEventSubmit}
        />
      )}

      <ApplyToBrandModal
        isOpen={Boolean(applyTarget)}
        brand={applyTarget}
        hostEvents={hostEventsForModal}
        onClose={() => setApplyTarget(null)}
        onSubmit={handleSubmitApplication}
      />

      <InvitationWizard
        isOpen={Boolean(invitationWizard)}
        brand={invitationWizard?.brand}
        hostEvents={myEvents}
        activeEvent={invitationWizard?.activeEvent ?? null}
        hostProfile={hostProfile}
        onClose={() => setInvitationWizard(null)}
        onSubmit={handleSubmitInvitation}
        saving={invitationSaving}
      />

      {toast && (
        <Toast
          title={typeof toast === 'object' ? toast.title : undefined}
          message={typeof toast === 'object' ? toast.message : toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
