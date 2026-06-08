import HostInvitedBrandTimeline from '../events/HostInvitedBrandTimeline'
import { isEventPast, SPONSORSHIP_STATUS } from '../../utils/sponsorshipLifecycle'

const INVITE_GROUPS = [
  {
    id: 'attention',
    title: 'Validá la participación de la marca',
    match: (status) => status === SPONSORSHIP_STATUS.CASO_ABIERTO,
  },
  {
    id: 'pending',
    title: 'En espera de la marca',
    match: (status) =>
      status === SPONSORSHIP_STATUS.INVITACION_ENVIADA || status === 'invitada',
  },
  {
    id: 'approved',
    title: 'Aprobadas',
    match: (status) => status === SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  },
  {
    id: 'verifying',
    title: 'En verificación',
    match: (status) => status === SPONSORSHIP_STATUS.EN_VERIFICACION,
  },
  {
    id: 'declined',
    title: 'Rechazadas',
    match: (status) => status === SPONSORSHIP_STATUS.DECLINADO,
  },
]

function groupInvitedBrands(brands) {
  const assigned = new Set()

  return INVITE_GROUPS.map((group) => {
    const items = brands.filter((brand) => {
      if (assigned.has(brand.id)) return false
      if (!group.match(brand.invitationStatus)) return false
      assigned.add(brand.id)
      return true
    })
    return { ...group, items }
  }).filter((group) => group.items.length > 0)
}

export default function EventInvitedSponsors({
  sponsors,
  event,
  unreadBrandNotifications = new Map(),
  onAcknowledgeBrandNotification,
  onCloseCaseForBrand,
}) {
  if (!sponsors.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-secondary/50 py-12 text-center text-sm text-muted-foreground">
        Todavía no invitaste sponsors a este evento.
      </p>
    )
  }

  const isPastEvent = event ? isEventPast(event) : false
  const groups = groupInvitedBrands(sponsors)

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section key={group.id} className="space-y-2">
          <h3 className="type-label normal-case tracking-normal text-muted-foreground">
            {group.title}
          </h3>
          <div className="space-y-2">
            {group.items.map((sponsor) => (
              <HostInvitedBrandTimeline
                key={sponsor.id}
                brand={sponsor}
                event={event}
                isPastEvent={isPastEvent}
                unreadNotificationType={unreadBrandNotifications.get(sponsor.id) ?? null}
                onAcknowledgeNotification={onAcknowledgeBrandNotification}
                onCloseCase={onCloseCaseForBrand}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
