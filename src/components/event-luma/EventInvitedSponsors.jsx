import { Button } from '@/components/ui/button'
import HostDeclinedBrandsGroup from '../events/HostDeclinedBrandsGroup'
import HostInvitedBrandTimeline from '../events/HostInvitedBrandTimeline'
import { isEventPast } from '../../utils/sponsorshipLifecycle'
import {
  getProposalBrandGroups,
  getProposalEmptyMessage,
  PROPOSAL_FILTER,
} from '../../utils/proposalFilters'

export default function EventInvitedSponsors({
  sponsors,
  event,
  filter = PROPOSAL_FILTER.ALL,
  verificationMode = false,
  unreadBrandNotifications = new Map(),
  onAcknowledgeBrandNotification,
  onCloseCaseForBrand,
  onGoToRecommended,
}) {
  if (!sponsors.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
        <p className="type-body font-semibold text-foreground">
          {verificationMode
            ? 'Nada para verificar en este evento'
            : 'Todavía no invitaste sponsors a este evento'}
        </p>
        <p className="type-small mx-auto mt-1 max-w-xs text-muted-foreground">
          {verificationMode
            ? 'No hubo patrocinios confirmados que requieran validación de productos.'
            : 'Mirá las marcas recomendadas para tu nicho y enviá tu primera propuesta.'}
        </p>
        {!verificationMode && onGoToRecommended && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={onGoToRecommended}
          >
            Ver marcas recomendadas
          </Button>
        )}
      </div>
    )
  }

  const isPastEvent = event ? isEventPast(event) : false

  if (verificationMode) {
    return (
      <div className="space-y-2">
        {sponsors.map((sponsor) => (
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
    )
  }

  const groups = getProposalBrandGroups(sponsors, filter)

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle px-6 py-12 text-center">
        <p className="type-body-muted">{getProposalEmptyMessage(filter)}</p>
        {filter !== PROPOSAL_FILTER.ALL && onGoToRecommended && (
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            className="mt-4"
            onClick={onGoToRecommended}
          >
            Ver marcas recomendadas
          </Button>
        )}
      </div>
    )
  }

  const isDeclinedGroup = (group) =>
    group.id === 'declined' || group.category === PROPOSAL_FILTER.DECLINED

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.id} className="space-y-2">
          {!group.hideTitle && (
            <h3 className="uanabi-proposal-group-label">
              {group.title}{' '}
              <span className="tabular-nums">{group.items.length}</span>
            </h3>
          )}
          <div className="space-y-2">
            {isDeclinedGroup(group) ? (
              <HostDeclinedBrandsGroup
                brands={group.items}
                event={event}
                isPastEvent={isPastEvent}
                unreadBrandNotifications={unreadBrandNotifications}
                onAcknowledgeBrandNotification={onAcknowledgeBrandNotification}
              />
            ) : (
              group.items.map((sponsor) => (
                <HostInvitedBrandTimeline
                  key={sponsor.id}
                  brand={sponsor}
                  event={event}
                  isPastEvent={isPastEvent}
                  unreadNotificationType={unreadBrandNotifications.get(sponsor.id) ?? null}
                  onAcknowledgeNotification={onAcknowledgeBrandNotification}
                  onCloseCase={onCloseCaseForBrand}
                />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
