import { Compass, Inbox, User } from 'lucide-react'
import NavbarUserMenu from './NavbarUserMenu'
import NotificationsCenter from './NotificationsCenter'

const NAV_ITEMS = [
  { id: 'explore', label: 'Inicio', icon: Compass },
  { id: 'matches', label: 'Mis Eventos', icon: Inbox },
  { id: 'profile', label: 'Perfil', icon: User },
]

const MOBILE_LABELS = {
  explore: 'Inicio',
  matches: 'Eventos',
  profile: 'Perfil',
}

export default function AppNavbar({
  activeNav,
  onNavChange,
  notifications,
  notificationsOpen,
  onNotificationsToggle,
  onNotificationsClose,
  onMarkAllRead,
  onNotificationClick,
  hostProfile,
  onUserMenuAction,
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
              <span className="sm:hidden">{MOBILE_LABELS[id] ?? label}</span>
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

        <NavbarUserMenu profile={hostProfile} onMenuAction={onUserMenuAction} />
      </div>
    </header>
  )
}
