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
  isGuest = false,
  exploreSearchDocked = null,
  glowBackdrop = false,
}) {
  const dockProgress =
    activeNav === 'explore' && exploreSearchDocked ? exploreSearchDocked.progress : 0
  const dockedSearch = activeNav === 'explore' ? exploreSearchDocked?.search : null
  const navHidden = dockProgress > 0.55

  return (
    <header
      className={cn(
        'uanabi-navbar',
        glowBackdrop && 'uanabi-navbar-glow',
        dockProgress > 0.85 && 'uanabi-navbar-docked',
      )}
    >
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
        <div
          className={cn(
            'uanabi-nav-rail transition-[opacity,transform] duration-200 ease-out',
            navHidden && 'pointer-events-none',
          )}
          style={{
            opacity: 1 - Math.min(dockProgress * 1.15, 1),
            transform: `scale(${1 - dockProgress * 0.04})`,
          }}
          aria-hidden={navHidden}
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeNav === id

            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavChange(id)}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={navHidden ? -1 : undefined}
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

      {dockedSearch && (
        <div
          className={cn(
            'uanabi-navbar-search-dock',
            dockProgress > 0.35 && 'uanabi-navbar-search-dock-active',
          )}
          style={{
            opacity: dockProgress,
            transform: `translate(-50%, -50%) scale(${0.94 + dockProgress * 0.06})`,
          }}
        >
          {dockedSearch}
        </div>
      )}

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

        <NavbarUserMenu
          profile={hostProfile}
          onMenuAction={onUserMenuAction}
          isGuest={isGuest}
        />
      </div>
    </header>
  )
}
