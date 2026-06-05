import { Handshake, History, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { countEventInvites } from '../../utils/eventSponsorMatch'
import { inviteNeedsClosure } from '../../utils/sponsorshipLifecycle'
import { formatEventDateShort } from '../../utils/eventDetailFormat'
import EventCoverMedia from './EventCoverMedia'

function EventRow({ event, isActive, onSelect, muted = false }) {
  const { matches, activeInvites } = countEventInvites(event)
  const needsClosure = (event.invitedBrands ?? []).some((inv) =>
    inviteNeedsClosure(inv, event),
  )

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={cn(
        'flex w-full gap-2.5 rounded-xl border border-transparent p-2 text-left transition-colors',
        'hover:border-border-subtle hover:bg-selection/60',
        isActive && 'border-border-subtle bg-selection',
        muted && !isActive && 'opacity-90',
      )}
    >
      <EventCoverMedia event={event} variant="thumb" />
      <div className="min-w-0 flex-1 py-0.5">
        <p className="type-body line-clamp-2 font-semibold leading-snug text-foreground">
          {event.title}
        </p>
        <p className="type-small mt-0.5 text-muted-foreground">
          {formatEventDateShort(event.date)}
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
      </div>
    </button>
  )
}

function SectionBadge({ count, tone = 'default' }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums',
        tone === 'upcoming' && 'bg-match text-match-foreground',
        tone === 'past' && 'bg-secondary text-muted-foreground',
        tone === 'default' && 'bg-foreground/8 text-muted-foreground',
      )}
    >
      {count}
    </span>
  )
}

function UpcomingSection({ events, selectedId, onSelect }) {
  return (
    <section className="px-3 pb-4">
      <div className="mb-2 flex items-start justify-between gap-2 px-1">
        <div>
          <h3 className="type-body font-display font-bold text-foreground">Próximos eventos</h3>
          <p className="type-small mt-0.5 text-muted-foreground">Los que vas a operar con marcas</p>
        </div>
        <SectionBadge count={events.length} tone="upcoming" />
      </div>

      {events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-subtle px-3 py-6 text-center type-small text-muted-foreground">
          No tenés eventos programados
        </p>
      ) : (
        <div className="space-y-1">
          {events.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              isActive={event.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default function EventsTimelineSidebar({
  upcoming,
  pastCount = 0,
  selectedId,
  panelMode,
  partnershipCount = 0,
  onSelectEvent,
  onShowPartnerships,
  onShowPastEvents,
  onCreateEvent,
}) {
  const showUpcomingSelection = panelMode === 'event'

  return (
    <aside className="flex h-full w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-card">
      <div className="shrink-0 border-b border-border-subtle px-4 py-3">
        <p className="type-heading font-display font-bold text-foreground">Mis eventos</p>
        <p className="type-small mt-0.5 text-muted-foreground">
          {upcoming.length} próximo{upcoming.length !== 1 ? 's' : ''}
          {pastCount > 0 && (
            <>
              {' '}
              · {pastCount} en historial
            </>
          )}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-3">
        <UpcomingSection
          events={upcoming}
          selectedId={showUpcomingSelection ? selectedId : null}
          onSelect={onSelectEvent}
        />
      </div>

      <div className="shrink-0 space-y-1 border-t border-border-subtle p-3">
        <button
          type="button"
          onClick={onShowPastEvents}
          className={cn(
            'uanabi-menu-item flex w-full items-center gap-2 px-3 py-2.5 text-left',
            panelMode === 'past' && 'uanabi-menu-item-active',
          )}
        >
          <History className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className="type-body font-semibold">Eventos pasados</span>
          {pastCount > 0 && (
            <span className="ml-auto rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
              {pastCount}
            </span>
          )}
        </button>
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
        <Button type="button" size="event" className="mt-1 w-full text-xs" onClick={onCreateEvent}>
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Crear evento
        </Button>
      </div>
    </aside>
  )
}
