import { useEffect, useRef } from 'react'
import { Bell, CheckCheck } from 'lucide-react'

const TYPE_STYLES = {
  match: 'bg-[#f4f6e9] text-[#1d230d]',
  invite: 'bg-neutral-100 text-neutral-700',
  suggestion: 'bg-violet-50 text-violet-700',
  event: 'bg-amber-50 text-amber-800',
  declined: 'bg-neutral-50 text-neutral-500',
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
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
        aria-label="Centro de notificaciones"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-neutral-900">Notificaciones</p>
              {unreadCount > 0 && (
                <p className="text-[11px] text-neutral-500">{unreadCount} sin leer</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900"
              >
                <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Marcar todas
              </button>
            )}
          </div>

          <ul className="max-h-[min(420px,70vh)] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-neutral-400">
                No tenés notificaciones
              </li>
            ) : (
              notifications.map((notif) => (
                <li key={notif.id}>
                  <button
                    type="button"
                    onClick={() => onNotificationClick?.(notif)}
                    className={`flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-neutral-50 ${
                      !notif.read ? 'bg-neutral-50/80' : ''
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-2 w-2 shrink-0 rounded-full ${
                        notif.read ? 'bg-transparent' : 'bg-neutral-900'
                      }`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold leading-snug text-neutral-900">
                          {notif.title}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${TYPE_STYLES[notif.type] ?? TYPE_STYLES.invite}`}
                        >
                          {notif.type === 'match'
                            ? 'Match'
                            : notif.type === 'suggestion'
                              ? 'Nuevo'
                              : notif.type === 'event'
                                ? 'Evento'
                                : notif.type === 'declined'
                                  ? 'Info'
                                  : 'Invitación'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
                        {notif.body}
                      </p>
                      <p className="mt-1.5 text-[10px] font-medium text-neutral-400">
                        {notif.time}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
