import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getEventPublicationDisplay,
  getPublicationMenuActions,
} from '../../utils/eventPublicationStatus'

export default function EventPublicationStatusTag({ event, onStatusChange, className }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const display = getEventPublicationDisplay(event)
  const menuActions = getPublicationMenuActions(display.status)

  useEffect(() => {
    setOpen(false)
  }, [event?.id, display.status])

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

  const handleAction = (nextStatus) => {
    setOpen(false)
    onStatusChange?.(nextStatus)
  }

  if (!display.interactive) {
    return (
      <span
        className={cn(
          'inline-flex rounded-full px-2.5 py-0.5 type-small font-semibold',
          display.badgeClass,
          className,
        )}
      >
        {display.label}
      </span>
    )
  }

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 type-small font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          display.badgeClass,
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Estado: ${display.label}. Tocá para cambiar`}
      >
        {display.label}
        <ChevronDown
          className={cn('h-3 w-3 opacity-70 transition', open && 'rotate-180')}
          strokeWidth={2.5}
        />
      </button>

      {open && menuActions.length > 0 && (
        <div
          role="menu"
          className="uanabi-panel absolute left-0 top-full z-50 mt-1.5 min-w-[11rem] origin-top-left py-1 shadow-md"
        >
          {menuActions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              onClick={() => handleAction(action.nextStatus)}
              className="uanabi-menu-item type-body block w-full px-3 py-2.5 text-left font-medium text-foreground"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
