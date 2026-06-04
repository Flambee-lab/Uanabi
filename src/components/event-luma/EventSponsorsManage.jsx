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
        <h2 className="font-display text-base font-bold tracking-tight text-neutral-900">
          Sponsors Invitados
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Inbound y outbound — estado de cada invitación
        </p>
        <div className="mt-6">
          <EventInvitedAvatars sponsors={invitedSponsors} onOpenChat={onOpenChat} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-base font-bold tracking-tight text-neutral-900">
          Sponsors Recomendados para este Evento
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Uanabis en CABA que coinciden con{' '}
          <span className="font-semibold text-neutral-700">{event.niche}</span>
        </p>

        {suggestedSponsors.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-neutral-200 py-14 text-center text-sm text-neutral-400">
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
