import { useEffect, useMemo, useState } from 'react'
import {
  dismissInlineNotification,
  getDismissedInlineNotificationIds,
  getEventInlineNotifications,
  getInlineNotificationId,
  getUnreadBrandNotificationsMap,
  migrateLegacyApprovedBannerDismiss,
} from '../utils/eventInlineNotifications'
import { openEventBrandPreview } from '../utils/eventBrandPreview'
import { isEventPast } from '../utils/sponsorshipLifecycle'
import { getProposalFilterCounts, getPastEventVerificationBrands, PROPOSAL_FILTER } from '../utils/proposalFilters'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { UANABI_PROFILE_CARD_CLASS, UanabiProfilePage } from '../components/layout/UanabiProfileLayout'
import HostEventDashboardHeader from '../components/events/HostEventDashboardHeader'
import ProposalFilterTabs from '../components/events/ProposalFilterTabs'
import EventEditModal from '../components/event-luma/EventEditModal'
import EventInvitedSponsors from '../components/event-luma/EventInvitedSponsors'
import HostRecommendedBrandCard from '../components/events/HostRecommendedBrandCard'
import RecommendedBrandsEmptyState from '../components/events/RecommendedBrandsEmptyState'
import RecommendedBrandsTagLegend from '../components/events/RecommendedBrandsTagLegend'

export default function MatchesAndRequests({
  event,
  invitedBrands = [],
  suggestedBrands = [],
  onInvite,
  onEventUpdate,
  onCloseCaseForBrand,
  onNotificationsDismissed,
  onDeleteEventRequest,
  notifRevision = 0,
  hostProfile,
}) {
  const [activeFilter, setActiveFilter] = useState(PROPOSAL_FILTER.ALL)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [dismissedNotifIds, setDismissedNotifIds] = useState(() => new Set())
  const isPastEvent = isEventPast(event)
  const hasNoProposals = !isPastEvent && invitedBrands.length === 0
  const verificationBrands = useMemo(
    () => (isPastEvent ? getPastEventVerificationBrands(invitedBrands) : []),
    [isPastEvent, invitedBrands],
  )
  const displayBrands = isPastEvent ? verificationBrands : invitedBrands

  const filterCounts = useMemo(
    () => {
      const counts = getProposalFilterCounts(invitedBrands, suggestedBrands.length)
      if (isPastEvent) {
        counts[PROPOSAL_FILTER.VERIFICATION] = verificationBrands.length
      }
      return counts
    },
    [invitedBrands, suggestedBrands.length, isPastEvent, verificationBrands.length],
  )

  useEffect(() => {
    if (hasNoProposals) {
      setActiveFilter(PROPOSAL_FILTER.RECOMMENDED)
    } else {
      setActiveFilter(PROPOSAL_FILTER.ALL)
    }
    if (isPastEvent) {
      setIsEditOpen(false)
    }
  }, [event?.id, isPastEvent, hasNoProposals])

  useEffect(() => {
    if (!event?.id) return
    migrateLegacyApprovedBannerDismiss(event.id, invitedBrands)
    setDismissedNotifIds(getDismissedInlineNotificationIds(event.id))
  }, [event?.id, invitedBrands, notifRevision])

  const inlineNotifications = useMemo(
    () =>
      isPastEvent
        ? []
        : getEventInlineNotifications(event, invitedBrands, dismissedNotifIds),
    [isPastEvent, event, invitedBrands, dismissedNotifIds],
  )

  const unreadBrandNotifications = useMemo(
    () => getUnreadBrandNotificationsMap(inlineNotifications),
    [inlineNotifications],
  )

  if (!event) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="uanabi-meta">Seleccioná un evento para gestionar sponsors</p>
      </div>
    )
  }

  const handlePublicationStatusChange = (publicationStatus) => {
    onEventUpdate?.({ ...event, publicationStatus })
  }

  const handleAcknowledgeBrandNotification = (brandId, status) => {
    dismissInlineNotification(event.id, getInlineNotificationId(brandId, status))
    setDismissedNotifIds(getDismissedInlineNotificationIds(event.id))
    onNotificationsDismissed?.()
  }

  const showRecommendedPanel =
    activeFilter === PROPOSAL_FILTER.RECOMMENDED || hasNoProposals

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <UanabiProfilePage innerClassName="space-y-6">
          <HostEventDashboardHeader
            event={event}
            isPastEvent={isPastEvent}
            onEdit={() => setIsEditOpen(true)}
            onViewEvent={() => openEventBrandPreview(event, hostProfile)}
            onPublicationStatusChange={handlePublicationStatusChange}
            onDeleteEventRequest={onDeleteEventRequest}
          />

          <Card className={cn(UANABI_PROFILE_CARD_CLASS, 'uanabi-sponsor-stroke gap-0 py-0')}>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-3">
                <h2 className="uanabi-proposal-section-title">
                  {isPastEvent ? 'Verificación' : hasNoProposals ? 'Marcas' : 'Propuestas enviadas'}
                </h2>

                <ProposalFilterTabs
                  active={activeFilter}
                  onChange={setActiveFilter}
                  counts={filterCounts}
                  showRecommended={!isPastEvent}
                  recommendedOnly={hasNoProposals}
                  recommendedDescription={
                    hasNoProposals
                      ? 'Todavía no enviaste propuestas. Estas marcas encajan con tu evento — invitá a la que prefieras para empezar.'
                      : undefined
                  }
                  verificationOnly={isPastEvent}
                  verificationDescription={
                    isPastEvent
                      ? verificationBrands.length > 1
                        ? `${verificationBrands.length} marcas esperan que subas pruebas de uso de productos. Las invitaciones rechazadas o sin respuesta ya no aplican.`
                        : 'Confirmá el uso de los productos que te envió la marca. Las invitaciones rechazadas o sin respuesta ya no aplican.'
                      : undefined
                  }
                />
              </div>

              <div className="pt-6">
                {showRecommendedPanel ? (
                  <section
                    id={`proposal-panel-${PROPOSAL_FILTER.RECOMMENDED}`}
                    role="tabpanel"
                    className="space-y-3"
                  >
                    <RecommendedBrandsTagLegend />
                    {suggestedBrands.length === 0 ? (
                      <RecommendedBrandsEmptyState
                        variant={hasNoProposals ? 'no-match' : 'exhausted'}
                      />
                    ) : (
                      <div className="space-y-2">
                        {suggestedBrands.map((brand) => (
                          <HostRecommendedBrandCard
                            key={brand.id}
                            brand={brand}
                            event={event}
                            onInvite={onInvite}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                ) : (
                  <section
                    id={`proposal-panel-${activeFilter}`}
                    role="tabpanel"
                    className="space-y-6"
                  >
                    <EventInvitedSponsors
                      sponsors={displayBrands}
                      event={event}
                      filter={activeFilter}
                      verificationMode={isPastEvent}
                      unreadBrandNotifications={unreadBrandNotifications}
                      onAcknowledgeBrandNotification={handleAcknowledgeBrandNotification}
                      onCloseCaseForBrand={onCloseCaseForBrand}
                      onGoToRecommended={
                        isPastEvent
                          ? undefined
                          : () => setActiveFilter(PROPOSAL_FILTER.RECOMMENDED)
                      }
                    />
                  </section>
                )}
              </div>
            </CardContent>
          </Card>

          {!isPastEvent && (
            <EventEditModal
              event={event}
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              onSave={onEventUpdate}
            />
          )}
        </UanabiProfilePage>
      </div>
    </div>
  )
}
