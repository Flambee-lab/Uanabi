import { Compass, Inbox, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import NavbarUserMenu from './NavbarUserMenu'
import NotificationsCenter from './NotificationsCenter'

const NAV_ITEMS = [
  { id: 'explore', label: 'Marcas', icon: Compass },
  { id: 'matches', label: 'Mis Eventos', icon: Inbox },
  { id: 'profile', label: 'Mi Perfil', icon: User },
]

const MOBILE_LABELS = {
  explore: 'Marcas',
  matches: 'Eventos',
  profile: 'Mi Perfil',
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
    <header className="uanabi-navbar">
      <div className="uanabi-navbar-start">
        <button
          type="button"
          onClick={() => onNavChange('explore')}
          className="uanabi-navbar-brand shrink-0"
        >
          Uanabi
        </button>
      </div>

      <nav className="uanabi-navbar-center" aria-label="Navegación principal">
        <div className="uanabi-nav-rail">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeNav === id

            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn('uanabi-nav-item', isActive && 'uanabi-nav-item-active')}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-foreground' : 'text-muted-foreground/70',
                  )}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{MOBILE_LABELS[id] ?? label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <div className="uanabi-navbar-actions">
        <NotificationsCenter
          notifications={notifications}
          isOpen={notificationsOpen}
          onToggle={onNotificationsToggle}
          onClose={onNotificationsClose}
          onMarkAllRead={onMarkAllRead}
          onNotificationClick={onNotificationClick}
        />

        <span className="uanabi-navbar-divider" aria-hidden />

        <NavbarUserMenu profile={hostProfile} onMenuAction={onUserMenuAction} />
      </div>
    </header>
  )
}
