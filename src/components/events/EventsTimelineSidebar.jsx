import { useMemo } from 'react'
import { History, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { countEventInvites, getInvitedBrandsForEvent } from '../../utils/eventSponsorMatch'
import { getEventInlineNotifications } from '../../utils/eventInlineNotifications'
import { getPastEventsNeedingAction } from '../../utils/hostEventBuckets'
import {
  countPastEventInvitesNeedingHostAction,
  formatVerificationStatusLine,
  isEventPast,
} from '../../utils/sponsorshipLifecycle'
import { formatEventDateShort } from '../../utils/eventDetailFormat'
import EventCoverMedia from './EventCoverMedia'
import EventPinnedActionBanner from './EventPinnedActionBanner'
import EventSidebarNotificationHint from './EventSidebarNotificationHint'

function EventRowBody({ event }) {
  const { matches, activeInvites } = countEventInvites(event)
  const isPast = isEventPast(event)
  const pendingVerificationCount = countPastEventInvitesNeedingHostAction(event)
  const verificationLine = formatVerificationStatusLine(pendingVerificationCount)

  return (
    <div className="flex w-full gap-2.5">
      <EventCoverMedia event={event} variant="thumb" />
      <div className="min-w-0 flex-1 py-0.5">
        <p className="type-body line-clamp-2 font-semibold leading-snug text-foreground">
          {event.title}
        </p>
        <p className="type-small mt-0.5 text-muted-foreground">
          {formatEventDateShort(event.date)}
        </p>
        {isPast && verificationLine ? (
          <p className="type-small mt-1 font-semibold text-orange-700">{verificationLine}</p>
        ) : (
          (matches > 0 || activeInvites > 0) && (
            <p className="type-small mt-1 font-medium text-muted-foreground">
              {matches > 0 && `${matches} match`}
              {matches > 0 && activeInvites > 0 && ' · '}
              {activeInvites > 0 && `${activeInvites} invit.`}
            </p>
          )
        )}
      </div>
    </div>
  )
}

function EventRow({
  event,
  isActive,
  onSelect,
  notifications = [],
  pinnedAction = null,
}) {
  const hasNotifications = notifications.length > 0 && !pinnedAction

  if (pinnedAction) {
    return (
      <div
        className={cn(
          'rounded-xl border border-navbar-border bg-secondary/35 p-2 transition-colors',
          isActive && 'bg-selection',
        )}
      >
        <EventPinnedActionBanner message={pinnedAction.message} className="mb-2 w-full" />
        <button
          type="button"
          onClick={() => onSelect(event.id)}
          className={cn(
            'flex w-full rounded-lg text-left transition-colors',
            isActive ? 'bg-white/80' : 'hover:bg-white/60',
          )}
        >
          <div className="flex w-full p-1.5">
            <EventRowBody event={event} />
          </div>
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={cn(
        'flex w-full flex-col rounded-xl border border-transparent text-left transition-colors',
        'hover:border-navbar-border hover:bg-selection/60',
        isActive && 'border-navbar-border bg-selection',
      )}
    >
      <div
        className={cn(
          'flex w-full gap-2.5 p-2',
          hasNotifications && 'flex-col gap-1.5',
        )}
      >
        {hasNotifications && (
          <EventSidebarNotificationHint
            notifications={notifications}
            className="mx-0 w-full"
          />
        )}
        <EventRowBody event={event} />
      </div>
    </button>
  )
}

function PinnedPastSection({ items, selectedId, onSelect }) {
  if (items.length === 0) return null

  return (
    <section className="border-b border-navbar-border px-3 pb-3">
      <p className="type-small mb-2 px-1 font-semibold text-muted-foreground">
        Requieren tu atención
      </p>
      <div className="space-y-2">
        {items.map(({ event, action }) => (
          <EventRow
            key={event.id}
            event={event}
            isActive={event.id === selectedId}
            onSelect={onSelect}
            pinnedAction={action}
          />
        ))}
      </div>
    </section>
  )
}

function UpcomingSection({ events, selectedId, onSelect, brandCatalog, notifRevision = 0 }) {
  const notificationsByEventId = useMemo(() => {
    const map = new Map()

    events.forEach((event) => {
      const invitedBrands = getInvitedBrandsForEvent(event, brandCatalog)
      const notifications = getEventInlineNotifications(event, invitedBrands)
      if (notifications.length > 0) {
        map.set(event.id, notifications)
      }
    })

    return map
  }, [events, brandCatalog, notifRevision])

  return (
    <section className="px-3 pb-4">
      {events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-navbar-border px-3 py-6 text-center type-small text-muted-foreground">
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
              notifications={notificationsByEventId.get(event.id) ?? []}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default function EventsTimelineSidebar({
  upcoming,
  past = [],
  pastPendingCount = 0,
  selectedId,
  panelMode,
  brandCatalog = [],
  notifRevision = 0,
  onSelectEvent,
  onSelectPastEvent,
  onShowPastEvents,
  onCreateEvent,
}) {
  const pinnedPastEvents = useMemo(
    () => getPastEventsNeedingAction(past, brandCatalog),
    [past, brandCatalog],
  )

  const handleSelectPinned = (eventId) => {
    onSelectPastEvent?.(eventId)
  }

  return (
    <aside className="flex max-h-[45vh] w-full shrink-0 flex-col overflow-hidden border-b border-navbar-border bg-card lg:h-full lg:max-h-none lg:w-[17.5rem] lg:border-b-0 lg:border-r">
      <div className="shrink-0 border-b border-navbar-border px-4 py-3">
        <p className="type-heading font-display font-bold text-foreground">Mis eventos</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-3">
        <PinnedPastSection
          items={pinnedPastEvents}
          selectedId={selectedId}
          onSelect={handleSelectPinned}
        />
        <UpcomingSection
          events={upcoming}
          selectedId={selectedId}
          onSelect={onSelectEvent}
          brandCatalog={brandCatalog}
          notifRevision={notifRevision}
        />
      </div>

      <div className="shrink-0 space-y-1 border-t border-navbar-border p-3">
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
          <span className="ml-auto flex items-center gap-1.5">
            {pastPendingCount > 0 && (
              <span
                className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-orange-800"
                title="Verificación pendiente en eventos pasados"
              >
                {pastPendingCount}
              </span>
            )}
            {past.length > 0 && (
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-muted-foreground">
                {past.length}
              </span>
            )}
          </span>
        </button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="mt-1 w-full"
          onClick={onCreateEvent}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Crear evento
        </Button>
      </div>
    </aside>
  )
}
