import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  UANABI_PROFILE_CARD_CLASS,
  UanabiProfilePage,
} from '../layout/UanabiProfileLayout'
import { countEventInvites } from '../../utils/eventSponsorMatch'
import { getEventHostActionSummary } from '../../utils/hostEventBuckets'
import {
  countPastEventInvitesNeedingHostAction,
  formatVerificationStatusLine,
} from '../../utils/sponsorshipLifecycle'
import { formatEventDateShort } from '../../utils/eventDetailFormat'
import EventCoverMedia from './EventCoverMedia'
import EventPinnedActionBanner from './EventPinnedActionBanner'

function PastEventCard({ event, brandCatalog, onSelect }) {
  const { matches, activeInvites } = countEventInvites(event)
  const pendingVerificationCount = countPastEventInvitesNeedingHostAction(event)
  const verificationLine = formatVerificationStatusLine(pendingVerificationCount)
  const action = getEventHostActionSummary(event, brandCatalog)

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={cn(
        UANABI_PROFILE_CARD_CLASS,
        'flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-selection/30',
        action && 'border-navbar-border bg-secondary/25',
      )}
    >
      {action && <EventPinnedActionBanner message={action.message} className="w-full" />}
      <div className="flex w-full gap-4">
        <EventCoverMedia event={event} variant="thumb" className="!h-16 !w-[5.5rem] rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="type-body font-semibold leading-snug text-foreground">{event.title}</p>
          <p className="type-small mt-1 flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {formatEventDateShort(event.date)}
            {event.niche && (
              <>
                <span className="text-border-subtle">·</span>
                {event.niche}
              </>
            )}
          </p>
          {verificationLine ? (
            <p className="type-small mt-2 font-semibold text-orange-700">{verificationLine}</p>
          ) : (
            (matches > 0 || activeInvites > 0) && (
              <p className="type-small mt-2 font-medium text-muted-foreground">
                {matches > 0 && `${matches} match`}
                {matches > 0 && activeInvites > 0 && ' · '}
                {activeInvites > 0 && `${activeInvites} invit.`}
              </p>
            )
          )}
        </div>
      </div>
    </button>
  )
}

export default function HostPastEventsView({
  events,
  brandCatalog = [],
  onSelectEvent,
  pendingCount = 0,
}) {
  const sortedEvents = [...events].sort((a, b) => {
    const aAction = Boolean(getEventHostActionSummary(a, brandCatalog))
    const bAction = Boolean(getEventHostActionSummary(b, brandCatalog))
    if (aAction !== bAction) return aAction ? -1 : 1
    return String(b.date).localeCompare(String(a.date))
  })

  if (events.length === 0) {
    return (
      <UanabiProfilePage
        innerClassName="flex flex-1 flex-col items-center justify-center max-w-3xl py-16 text-center"
      >
        <p className="type-heading font-display font-bold text-foreground">
          Sin eventos pasados
        </p>
        <p className="type-body-muted mx-auto mt-2 max-w-md">
          Cuando finalice un evento, vas a poder revisar el historial y validar la participación
          de las marcas desde acá.
        </p>
      </UanabiProfilePage>
    )
  }

  return (
    <UanabiProfilePage innerClassName="max-w-3xl">
      <h2 className="type-heading font-display font-bold text-foreground">Eventos pasados</h2>
      <p className="type-small mt-1 text-muted-foreground">
        Historial y validación de patrocinios · {events.length} evento
        {events.length !== 1 ? 's' : ''}
      </p>

      {pendingCount > 0 && (
        <p className="type-small mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-medium text-orange-900">
          Tenés {pendingCount} evento{pendingCount !== 1 ? 's' : ''} con validación de marca pendiente.
          Abrí el evento y confirmá la participación del sponsor.
        </p>
      )}

      <div className="mt-5 space-y-3">
        {sortedEvents.map((event) => (
          <PastEventCard
            key={event.id}
            event={event}
            brandCatalog={brandCatalog}
            onSelect={onSelectEvent}
          />
        ))}
      </div>
    </UanabiProfilePage>
  )
}
