import { useEffect, useRef } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  getInlineNotificationBadgeClass,
  getInlineNotificationDotClass,
  getInlineNotificationRowClass,
  getInlineNotificationTypeLabel,
  resolveNotificationVisual,
} from '../../utils/eventInlineNotifications'

const NAVBAR_LABEL_OVERRIDES = {
  match: 'Match',
  invite: 'Invitación',
  suggestion: 'Nuevo',
  event: 'Evento',
  declined: 'Rechazada',
}

export default function NotificationsCenter({
  notifications,
  isOpen,
  onToggle,
  onClose,
  onMarkAllRead,
  onNotificationClick,
}) {
  const panelRef = useRef(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.()
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="uanabi-navbar-icon-btn"
        aria-label="Centro de notificaciones"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 type-small font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <div>
              <p className="type-body font-bold">Notificaciones</p>
              {unreadCount > 0 && (
                <p className="type-small text-muted-foreground">{unreadCount} sin leer</p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button type="button" variant="tertiary" size="xs" onClick={onMarkAllRead}>
                <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Marcar todas
              </Button>
            )}
          </div>

          <ul className="max-h-[min(420px,70vh)] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <li className="px-4 py-10 text-center">
                <p className="type-body font-semibold text-foreground">Estás al día</p>
                <p className="mt-1 type-small text-muted-foreground">
                  Acá vas a ver las novedades de tus eventos y propuestas con marcas.
                </p>
              </li>
            ) : (
              notifications.map((notif) => {
                const visualType = resolveNotificationVisual(notif)

                return (
                  <li key={notif.id}>
                    <button
                      type="button"
                      onClick={() => onNotificationClick?.(notif)}
                      className={cn(
                        'relative flex w-full gap-3 px-4 py-3.5 text-left transition',
                        getInlineNotificationRowClass(visualType, notif.read),
                      )}
                    >
                      <span
                        className={cn(
                          'mt-1.5 flex h-2 w-2 shrink-0 rounded-full',
                          notif.read
                            ? 'bg-transparent'
                            : getInlineNotificationDotClass(visualType),
                        )}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="type-body font-bold leading-snug">{notif.title}</p>
                          <span
                            className={cn(
                              'type-label shrink-0 rounded-full px-1.5 py-0.5 normal-case',
                              getInlineNotificationBadgeClass(visualType),
                            )}
                          >
                            {NAVBAR_LABEL_OVERRIDES[notif.type] ??
                              getInlineNotificationTypeLabel(visualType)}
                          </span>
                        </div>
                        <p className="mt-1 type-small leading-relaxed text-muted-foreground">
                          {notif.body}
                        </p>
                        <p className="mt-1.5 type-small font-medium text-muted-foreground">
                          {notif.time}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
