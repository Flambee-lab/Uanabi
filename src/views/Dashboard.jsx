import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import AppNavbar from '../components/layout/AppNavbar'
import GuestBanner from '../components/layout/GuestBanner'
import ApplyToBrandModal from '../components/apply/ApplyToBrandModal'
import ProposalModal from '../components/market/ProposalModal'
import {
  appendInvitationToEvent,
  createInvitationRecord,
} from '../utils/sponsorshipProposal'
import Toast from '../components/ui/Toast'
import {
  buildHostEventFromQuickForm,
  createApplicationFromSubmission,
} from '../data/hostEvents'
import { mockNotifications as initialNotifications } from '../data/mockNotifications'
import { DEFAULT_HOST_PROFILE } from '../data/hostProfile'
import {
  availableBrands,
  mockBrands,
  myApplications as initialApplications,
  myEvents as initialMyEvents,
} from '../data/mockEvents'
import CreateEventView from './CreateEventView'
import ExploreHome from './ExploreHome'
import MyEventsAndProposals from './MyEventsAndProposals'
import Profile from './Profile'
import AccountSettings from './AccountSettings'
import { DEFAULT_ACCOUNT_SETTINGS } from '../data/accountSettings'

const GUEST_BANNER_KEY = 'uanabi_guest_banner_dismissed'

export default function Dashboard() {
  const { isGuest, isAuthenticated, user, logout } = useAuth()
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(
    () => localStorage.getItem(GUEST_BANNER_KEY) === '1',
  )

  const [brands, setBrands] = useState(mockBrands)
  const [myEvents, setMyEvents] = useState(initialMyEvents)
  const [applications, setApplications] = useState(initialApplications)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeNav, setActiveNav] = useState('explore')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [focusEventId, setFocusEventId] = useState(null)
  const [hostProfile, setHostProfile] = useState(DEFAULT_HOST_PROFILE)
  const [applyTarget, setApplyTarget] = useState(null)
  const [proposalModal, setProposalModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [accountSettings, setAccountSettings] = useState(DEFAULT_ACCOUNT_SETTINGS)

  useEffect(() => {
    if (!isAuthenticated || !user) return
    setHostProfile((prev) => ({
      ...prev,
      fullName: user.fullName || prev.fullName,
    }))
    setAccountSettings((prev) => ({
      ...prev,
      email: user.email,
      authProvider: user.provider === 'google' ? 'google' : 'email',
    }))
  }, [isAuthenticated, user])

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

  const openProposalModal = (brandId, activeEvent = null) => {
    const brand =
      brands.find((b) => b.id === brandId) ?? availableBrands.find((b) => b.id === brandId)
    if (!brand) return
    setProposalModal({ brand, activeEvent })
  }

  const handleRequestPartnership = (brandId) => {
    openProposalModal(brandId, null)
  }

  const handleProposalEventCreated = (quickEvent) => {
    const fullEvent = buildHostEventFromQuickForm(quickEvent)
    setMyEvents((prev) => [fullEvent, ...prev])
    if (proposalModal?.brand) {
      setProposalModal({ brand: proposalModal.brand, activeEvent: fullEvent })
    }
  }

  const handleSubmitProposal = ({ event, proposal }) => {
    if (!proposalModal?.brand || !event?.id) return

    const invitation = createInvitationRecord(proposalModal.brand.id, proposal)

    setMyEvents((prev) =>
      prev.map((ev) =>
        ev.id === event.id ? appendInvitationToEvent(ev, invitation) : ev,
      ),
    )

    setToast(
      `Propuesta enviada a ${proposalModal.brand.name}. La marca tiene 7 días hábiles para contactarte.`,
    )
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
    <div className="flex h-full flex-col overflow-hidden bg-[#fafafa]">
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
          onUserMenuAction={(action) => {
            if (action === 'profile-settings') handleNavChange('settings')
            else if (action === 'event-manager') handleNavChange('matches')
            else if (action === 'privacy') setToast('Privacidad — próximamente')
            else if (action === 'logout') handleLogout()
          }}
        />
      )}

      <main
        className={`flex min-h-0 flex-1 flex-col overflow-hidden bg-white ${
          mainScrolls ? 'overflow-y-auto' : ''
        }`}
      >
        {!isCreateEventOpen && activeNav === 'explore' && (
          <ExploreHome
            brands={brands}
            hostEvents={myEvents}
            onRequestPartnership={handleRequestPartnership}
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
            onOpenChat={handleOpenChat}
            onBrandsMatch={handleBrandsMatch}
            onGoToProfile={() => handleNavChange('profile')}
            onProposeToBrand={(brandId, activeEvent) =>
              openProposalModal(brandId, activeEvent)
            }
          />
        )}

        {!isCreateEventOpen && activeNav === 'profile' && (
          <Profile
            profile={hostProfile}
            onProfileChange={(next) => {
              setHostProfile(next)
              setToast('Perfil actualizado')
            }}
            events={myEvents}
            onOpenChat={handleOpenChat}
            onGoToEvents={() => handleNavChange('matches')}
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
              setAccountSettings(DEFAULT_ACCOUNT_SETTINGS)
              logout()
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

      <ProposalModal
        isOpen={Boolean(proposalModal)}
        brand={proposalModal?.brand}
        hostEvents={myEvents}
        activeEvent={proposalModal?.activeEvent ?? null}
        onClose={() => setProposalModal(null)}
        onSubmit={handleSubmitProposal}
        onEventCreated={handleProposalEventCreated}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
