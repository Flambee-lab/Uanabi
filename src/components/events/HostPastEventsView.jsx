import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  UANABI_PROFILE_CARD_CLASS,
  UanabiProfilePage,
} from '../layout/UanabiProfileLayout'
import { countEventInvites } from '../../utils/eventSponsorMatch'
import { inviteNeedsClosure } from '../../utils/sponsorshipLifecycle'
import { formatEventDateShort } from '../../utils/eventDetailFormat'
import EventCoverMedia from './EventCoverMedia'

function PastEventCard({ event, onSelect }) {
  const { matches, activeInvites } = countEventInvites(event)
  const needsClosure = (event.invitedBrands ?? []).some((inv) =>
    inviteNeedsClosure(inv, event),
  )

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={cn(
        UANABI_PROFILE_CARD_CLASS,
        'flex w-full gap-4 p-4 text-left transition-colors hover:bg-selection/30',
      )}
    >
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
        {(matches > 0 || activeInvites > 0 || needsClosure) && (
          <p className="type-small mt-2 font-medium text-muted-foreground">
            {needsClosure && <span className="text-orange-700">Validación pendiente</span>}
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

export default function HostPastEventsView({ events, onSelectEvent, pendingCount = 0 }) {
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
        <p className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-medium leading-relaxed text-orange-900">
          Tenés {pendingCount} evento{pendingCount !== 1 ? 's' : ''} con validación de marca pendiente.
          Abrí el evento y confirmá la participación del sponsor.
        </p>
      )}

      <div className="mt-5 space-y-3">
        {events.map((event) => (
          <PastEventCard key={event.id} event={event} onSelect={onSelectEvent} />
        ))}
      </div>
    </UanabiProfilePage>
  )
}
