import { useMemo, useState } from 'react'
import AppNavbar from '../components/layout/AppNavbar'
import ApplyToBrandModal from '../components/apply/ApplyToBrandModal'
import Toast from '../components/ui/Toast'
import { createApplicationFromSubmission } from '../data/hostEvents'
import { mockNotifications as initialNotifications } from '../data/mockNotifications'
import {
  mockBrands,
  myApplications as initialApplications,
  myEvents as initialMyEvents,
} from '../data/mockEvents'
import CreateEventView from './CreateEventView'
import ExploreHome from './ExploreHome'
import MyEventsAndProposals from './MyEventsAndProposals'

export default function Dashboard() {
  const [brands, setBrands] = useState(mockBrands)
  const [myEvents, setMyEvents] = useState(initialMyEvents)
  const [applications, setApplications] = useState(initialApplications)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeNav, setActiveNav] = useState('explore')
  const [exploreGeoMode, setExploreGeoMode] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [focusEventId, setFocusEventId] = useState(null)
  const [applyTarget, setApplyTarget] = useState(null)
  const [toast, setToast] = useState(null)

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
    if (navId !== 'explore') setExploreGeoMode(false)
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

  const mainScrolls = activeNav === 'explore' && !exploreGeoMode && !isCreateEventOpen

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#fafafa]">
      {!isCreateEventOpen && (
        <AppNavbar
          activeNav={activeNav}
          onNavChange={handleNavChange}
          onCreateEvent={handleOpenCreateEvent}
          notifications={notifications}
          notificationsOpen={notificationsOpen}
          onNotificationsToggle={() => setNotificationsOpen((o) => !o)}
          onNotificationsClose={() => setNotificationsOpen(false)}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotificationClick}
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
            onApply={handleStartApply}
            onOpenChat={handleOpenChat}
            onGeoModeChange={setExploreGeoMode}
          />
        )}

        {!isCreateEventOpen && activeNav === 'matches' && (
          <MyEventsAndProposals
            events={myEvents}
            onEventsChange={setMyEvents}
            onCreateEvent={handleOpenCreateEvent}
            focusEventId={focusEventId}
            onFocusEventConsumed={() => setFocusEventId(null)}
            onOpenChat={handleOpenChat}
            onBrandsMatch={handleBrandsMatch}
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

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
