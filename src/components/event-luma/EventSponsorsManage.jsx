import EventInvitedAvatars from './EventInvitedAvatars'
import SuggestedSponsorCard from './SuggestedSponsorCard'

export default function EventSponsorsManage({
  event,
  invitedSponsors,
  suggestedSponsors,
  onInvite,
  onOpenChat,
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-base font-bold tracking-tight text-foreground">
          Sponsors Invitados
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Inbound y outbound — estado de cada invitación
        </p>
        <div className="mt-6">
          <EventInvitedAvatars sponsors={invitedSponsors} onOpenChat={onOpenChat} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-base font-bold tracking-tight text-foreground">
          Sponsors Recomendados para este Evento
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Uanabis en CABA que coinciden con{' '}
          <span className="font-semibold text-foreground/80">{event.niche}</span>
        </p>

        {suggestedSponsors.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">
            No hay más sponsors recomendados en CABA para este nicho
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedSponsors.map((sponsor) => (
              <SuggestedSponsorCard key={sponsor.id} brand={sponsor} onInvite={onInvite} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
