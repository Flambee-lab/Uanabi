import { useMemo } from 'react'
import { History, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { countEventInvites, getInvitedBrandsForEvent } from '../../utils/eventSponsorMatch'
import { getEventInlineNotifications } from '../../utils/eventInlineNotifications'
import { inviteNeedsClosure } from '../../utils/sponsorshipLifecycle'
import { formatEventDateShort } from '../../utils/eventDetailFormat'
import EventCoverMedia from './EventCoverMedia'
import EventSidebarNotificationHint from './EventSidebarNotificationHint'

function EventRow({ event, isActive, onSelect, notifications = [], muted = false }) {
  const { matches, activeInvites } = countEventInvites(event)
  const needsClosure = (event.invitedBrands ?? []).some((inv) =>
    inviteNeedsClosure(inv, event),
  )
  const hasNotifications = notifications.length > 0

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={cn(
        'flex w-full flex-col rounded-xl border border-transparent text-left transition-colors',
        'hover:border-border-subtle hover:bg-selection/60',
        isActive && 'border-border-subtle bg-selection',
        muted && !isActive && 'opacity-90',
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
        <div className="flex w-full gap-2.5">
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
              {needsClosure && <span className="text-orange-700">Validación pendiente</span>}
              {needsClosure && (matches > 0 || activeInvites > 0) && ' · '}
              {matches > 0 && `${matches} match`}
              {matches > 0 && activeInvites > 0 && ' · '}
              {activeInvites > 0 && `${activeInvites} invit.`}
            </p>
          )}
        </div>
        </div>
      </div>
    </button>
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
  pastCount = 0,
  pastPendingCount = 0,
  selectedId,
  panelMode,
  brandCatalog = [],
  notifRevision = 0,
  onSelectEvent,
  onShowPastEvents,
  onCreateEvent,
}) {
  const showUpcomingSelection = panelMode === 'event'

  return (
    <aside className="flex h-full w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-card">
      <div className="shrink-0 border-b border-border-subtle px-4 py-3">
        <p className="type-heading font-display font-bold text-foreground">Mis eventos</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-3">
        <UpcomingSection
          events={upcoming}
          selectedId={showUpcomingSelection ? selectedId : null}
          onSelect={onSelectEvent}
          brandCatalog={brandCatalog}
          notifRevision={notifRevision}
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
          <span className="ml-auto flex items-center gap-1.5">
            {pastPendingCount > 0 && (
              <span
                className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-orange-800"
                title="Validación pendiente en eventos pasados"
              >
                {pastPendingCount}
              </span>
            )}
            {pastCount > 0 && (
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                {pastCount}
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
