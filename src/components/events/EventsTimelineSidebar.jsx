import { Handshake, Plus, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { countEventInvites } from '../../utils/eventSponsorMatch'
import { inviteNeedsClosure, isEventPast } from '../../utils/sponsorshipLifecycle'

function formatEventDateShort(date) {
  if (!date) return ''
  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function EventRow({ event, isActive, onSelect }) {
  const { matches, activeInvites } = countEventInvites(event)
  const needsClosure = (event.invitedBrands ?? []).some((inv) =>
    inviteNeedsClosure(inv, event),
  )
  const past = isEventPast(event)

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={cn(
        'uanabi-menu-item w-full px-3 py-2.5 text-left',
        isActive && 'uanabi-menu-item-active',
      )}
    >
      <p className="type-body line-clamp-2 font-semibold leading-snug text-foreground">
        {event.title}
      </p>
      <p className="type-small mt-1 text-muted-foreground">
        {formatEventDateShort(event.date)}
        {past ? ' · Finalizado' : ''}
      </p>
      {(matches > 0 || activeInvites > 0 || needsClosure) && (
        <p className="type-small mt-1 font-medium text-muted-foreground">
          {needsClosure && <span className="text-orange-700">Cierre pendiente</span>}
          {needsClosure && (matches > 0 || activeInvites > 0) && ' · '}
          {matches > 0 && `${matches} match`}
          {matches > 0 && activeInvites > 0 && ' · '}
          {activeInvites > 0 && `${activeInvites} invit.`}
        </p>
      )}
    </button>
  )
}

function EventSection({ title, events, selectedId, onSelect, emptyLabel }) {
  if (events.length === 0) {
    return (
      <p className="px-3 py-3 type-small text-muted-foreground">{emptyLabel}</p>
    )
  }

  return (
    <div className="space-y-0.5 px-2">
      <p className="type-label px-2 pb-1">{title}</p>
      {events.map((event) => (
        <EventRow
          key={event.id}
          event={event}
          isActive={event.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default function EventsTimelineSidebar({
  upcoming,
  past,
  selectedId,
  panelMode,
  partnershipCount = 0,
  onSelectEvent,
  onShowPartnerships,
  onCreateEvent,
  onGoToProfile,
}) {
  const showEvents = panelMode === 'event'

  return (
    <aside className="flex h-full w-[15.5rem] shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-card">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2">
        <EventSection
          title="Próximos"
          events={upcoming}
          selectedId={showEvents ? selectedId : null}
          onSelect={onSelectEvent}
          emptyLabel="Sin próximos eventos"
        />
        <div className="mx-4 my-2 border-t border-border-subtle" />
        <EventSection
          title="Pasados"
          events={past}
          selectedId={showEvents ? selectedId : null}
          onSelect={onSelectEvent}
          emptyLabel="Sin eventos pasados"
        />
      </div>

      <div className="shrink-0 space-y-1 border-t border-border-subtle p-3">
        <button
          type="button"
          onClick={onShowPartnerships}
          className={cn(
            'uanabi-menu-item flex w-full items-center gap-2 px-3 py-2.5 text-left',
            panelMode === 'partnerships' && 'uanabi-menu-item-active',
          )}
        >
          <Handshake className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className="type-body font-semibold">Colaboraciones</span>
          {partnershipCount > 0 && (
            <span className="ml-auto rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
              {partnershipCount}
            </span>
          )}
        </button>
        {onGoToProfile && (
          <button
            type="button"
            onClick={onGoToProfile}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left type-small font-semibold text-muted-foreground transition-colors hover:bg-selection hover:text-foreground"
          >
            <User className="h-3.5 w-3.5" strokeWidth={1.75} />
            Mi Perfil
          </button>
        )}
        <Button type="button" size="event" className="mt-1 w-full text-xs" onClick={onCreateEvent}>
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Crear evento
        </Button>
      </div>
    </aside>
  )
}
