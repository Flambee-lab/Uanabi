import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProfileDisplayName, getProfileInitial } from '../../data/hostProfile'

const MENU_SECTIONS = [
  [
    { id: 'profile-settings', label: 'Configuración de perfil' },
    { id: 'event-manager', label: 'Mis eventos' },
    { id: 'privacy', label: 'Privacidad' },
  ],
  [{ id: 'logout', label: 'Cerrar sesión', danger: true }],
]

export default function NavbarUserMenu({ profile, onMenuAction, isGuest = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const fullName = isGuest ? 'Invitado' : getProfileDisplayName(profile)
  const role = isGuest ? 'Sin cuenta' : (profile?.role ?? 'Host')
  const initial = isGuest ? '?' : getProfileInitial(profile)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleItem = (id) => {
    setOpen(false)
    onMenuAction?.(id)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="uanabi-navbar-user-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {!isGuest && profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-background"
          />
        ) : (
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold',
              isGuest
                ? 'bg-neutral-300 text-neutral-700'
                : 'bg-primary text-primary-foreground',
            )}
          >
            {initial}
          </span>
        )}
        <span className="hidden min-w-0 truncate text-left md:block">
          <span className="block truncate text-xs font-bold text-foreground">{fullName}</span>
          <span className="block truncate type-small font-medium text-muted-foreground">
            {role}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="uanabi-panel absolute right-0 z-50 mt-2 w-56 origin-top-right py-1.5 shadow-md"
        >
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {sectionIndex > 0 && <div className="my-1.5 border-t border-border-subtle" />}
              {section.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleItem(item.id)}
                  className={cn(
                    'uanabi-menu-item type-body block w-full px-3 py-2.5 text-left font-medium',
                    item.danger
                      ? 'text-destructive hover:text-destructive'
                      : 'text-foreground',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
