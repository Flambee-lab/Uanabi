import { Compass, Inbox, Plus } from 'lucide-react'
import NotificationsCenter from './NotificationsCenter'

const NAV_ITEMS = [
  { id: 'explore', label: 'Inicio', icon: Compass },
  { id: 'matches', label: 'Mis Eventos', icon: Inbox },
]

export default function AppNavbar({
  activeNav,
  onNavChange,
  onCreateEvent,
  notifications,
  notificationsOpen,
  onNotificationsToggle,
  onNotificationsClose,
  onMarkAllRead,
  onNotificationClick,
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[#eef0f2] bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={() => onNavChange('explore')}
        className="shrink-0 font-display text-base font-extrabold tracking-tight text-[#111827] transition hover:opacity-80"
      >
        Uanabi
      </button>

      <nav className="flex min-w-0 flex-1 items-center justify-center gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all sm:px-4 ${
                isActive
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? 'opacity-90' : 'opacity-50'}`}
                strokeWidth={1.75}
              />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{id === 'explore' ? 'Inicio' : 'Eventos'}</span>
            </button>
          )
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <NotificationsCenter
          notifications={notifications}
          isOpen={notificationsOpen}
          onToggle={onNotificationsToggle}
          onClose={onNotificationsClose}
          onMarkAllRead={onMarkAllRead}
          onNotificationClick={onNotificationClick}
        />

        <button
          type="button"
          onClick={onCreateEvent}
          className="hidden items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-neutral-800 sm:inline-flex"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Crear evento
        </button>

        <button
          type="button"
          onClick={onCreateEvent}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white sm:hidden"
          aria-label="Crear evento"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <div
          className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-xs font-bold text-white sm:flex"
          title="Host Demo"
        >
          H
        </div>
      </div>
    </header>
  )
}
