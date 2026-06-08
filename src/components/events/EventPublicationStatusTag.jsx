import { useEffect, useRef, useState } from 'react'

import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import {

  getEventPublicationDisplay,

  getPublicationMenuActions,

  PUBLICATION_MENU_ACTION,

} from '../../utils/eventPublicationStatus'



export default function EventPublicationStatusTag({

  event,

  onStatusChange,

  onDeleteRequest,

  className,

}) {

  const [open, setOpen] = useState(false)

  const rootRef = useRef(null)

  const display = getEventPublicationDisplay(event)

  const menuActions = getPublicationMenuActions(event)



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



  const handleAction = (action) => {

    setOpen(false)

    if (action.action === PUBLICATION_MENU_ACTION.DELETE) {

      onDeleteRequest?.(event)

      return

    }

    if (action.nextStatus) {

      onStatusChange?.(action.nextStatus)

    }

  }



  if (!display.interactive) {

    return (

      <span

        className={cn(

          'inline-flex h-8 shrink-0 items-center rounded-xl border px-3 text-xs font-semibold leading-none box-border',

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

          'inline-flex h-8 shrink-0 items-center gap-1 rounded-xl border px-3 text-xs font-semibold leading-none box-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',

          display.badgeClass,

        )}

        aria-expanded={open}

        aria-haspopup="menu"

        aria-label={`Estado: ${display.label}. Tocá para ver opciones`}

      >

        {display.label}

        <ChevronDown

          className={cn('h-3.5 w-3.5 opacity-70 transition', open && 'rotate-180')}

          strokeWidth={2}

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

              onClick={() => handleAction(action)}

              className={cn(

                'uanabi-menu-item block w-full px-3 py-2 text-left text-xs font-semibold leading-none',

                action.destructive

                  ? 'text-destructive hover:bg-destructive/10'

                  : 'text-foreground',

              )}

            >

              {action.label}

            </button>

          ))}

        </div>

      )}

    </div>

  )

}


