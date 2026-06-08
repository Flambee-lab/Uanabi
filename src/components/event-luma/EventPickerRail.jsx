import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { countEventInvites } from '../../utils/eventSponsorMatch'

export default function EventPickerRail({ events, selectedId, onSelect, onCreateEvent }) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-card shadow-sm">
      <div className="shrink-0 border-b border-border-subtle px-4 py-3">
        <p className="type-label">
          Tus eventos
        </p>
      </div>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-2">
        {events.map((event) => {
          const { matches, activeInvites } = countEventInvites(event)
          const isActive = event.id === selectedId

          return (
            <Button
              key={event.id}
              type="button"
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => onSelect(event.id)}
              className={cn(
                'h-auto w-full flex-col items-start rounded-xl px-3 py-2 text-left',
                isActive && 'bg-primary hover:bg-primary/90',
              )}
            >
              <p
                className={cn(
                  'type-small line-clamp-2 font-bold text-foreground',
                  isActive ? 'text-primary-foreground' : 'text-foreground',
                )}
              >
                {event.title}
              </p>
              <p
                className={cn(
                  'type-small mt-1',
                  isActive ? 'text-primary-foreground/70' : 'text-muted-foreground',
                )}
              >
                {event.date}
              </p>
              {(matches > 0 || activeInvites > 0) && (
                <p
                  className={cn(
                    'type-small mt-1 font-medium',
                    isActive ? 'text-primary-foreground/60' : 'text-muted-foreground',
                  )}
                >
                  {matches > 0 && `${matches} match`}
                  {matches > 0 && activeInvites > 0 && ' · '}
                  {activeInvites > 0 && `${activeInvites} invit.`}
                </p>
              )}
            </Button>
          )
        })}
        {events.length === 0 && (
          <p className="px-3 py-8 text-center text-xs text-muted-foreground">Sin eventos</p>
        )}
      </div>

      <div className="shrink-0 border-t border-border-subtle p-3">
        <Button type="button" variant="primary" size="lg" className="w-full" onClick={onCreateEvent}>
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Crear evento
        </Button>
      </div>
    </aside>
  )
}
