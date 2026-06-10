import { useEffect, useMemo, useState } from 'react'
import SponsorshipCloseCaseModal from '../components/events/SponsorshipCloseCaseModal'
import { useAuth } from '../context/AuthProvider'
import { submitPatrocinioEvidencias } from '../lib/patrociniosEvidencias'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  dismissInlineNotification,
  getDismissedInlineNotificationIds,
  getEventInlineNotifications,
  getInlineNotificationId,
  getUnreadBrandNotificationsMap,
  migrateLegacyApprovedBannerDismiss,
} from '../utils/eventInlineNotifications'
import { openEventBrandPreview } from '../utils/eventBrandPreview'
import { isEventPast, SPONSORSHIP_STATUS } from '../utils/sponsorshipLifecycle'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { UANABI_PROFILE_CARD_CLASS, UanabiProfilePage } from '../components/layout/UanabiProfileLayout'
import HostEventDashboardHeader from '../components/events/HostEventDashboardHeader'
import EventEditModal from '../components/event-luma/EventEditModal'
import EventInvitedSponsors from '../components/event-luma/EventInvitedSponsors'
import HostRecommendedBrandCard from '../components/events/HostRecommendedBrandCard'
import RecommendedBrandsTagLegend from '../components/events/RecommendedBrandsTagLegend'

function SponsorTabs({ active, onChange, invitedCount = 0, recommendedCount = 0 }) {
  const tabs = [
    { id: 'invited', label: 'Marcas invitadas', count: invitedCount },
    { id: 'recommended', label: 'Recomendadas', count: recommendedCount },
  ]

  return (
    <div
      className="uanabi-segmented-control"
      role="tablist"
      aria-label="Secciones de patrocinio"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'uanabi-segmented-control-tab',
              isActive && 'uanabi-segmented-control-tab-active',
            )}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={cn(
                  'text-xs font-semibold tabular-nums',
                  isActive ? 'text-muted-foreground' : 'text-muted-foreground/70',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function MatchesAndRequests({
  event,
  invitedBrands = [],
  suggestedBrands = [],
  onInvite,
  onOpenChat,
  onEventUpdate,
  onEventsChange,
  onNotificationsDismissed,
  onDeleteEventRequest,
  notifRevision = 0,
  hostProfile,
}) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('invited')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [closeCaseTarget, setCloseCaseTarget] = useState(null)
  const [dismissedNotifIds, setDismissedNotifIds] = useState(() => new Set())
  const isPastEvent = isEventPast(event)

  useEffect(() => {
    if (isPastEvent) {
      setIsEditOpen(false)
      setActiveTab('invited')
    }
  }, [event?.id, isPastEvent])

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

  const handleCloseCaseForBrand = (brandId) => {
    const brand = invitedBrands.find((b) => b.id === brandId)
    if (!brand || !event) return
    setCloseCaseTarget({
      eventId: event.id,
      eventTitle: event.title,
      brandId,
      brandName: brand.name,
    })
  }

  const handleCloseCaseSubmit = async (submission) => {
    if (!closeCaseTarget) return

    const { eventId, brandId } = closeCaseTarget

    if (isSupabaseConfigured && user?.id) {
      await submitPatrocinioEvidencias({
        userId: user.id,
        eventId,
        brandId,
        delivered: submission.delivered,
        rating: submission.rating,
        review: submission.review,
        photoFiles: submission.photoFiles ?? [],
      })
    }

    onEventsChange?.((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev
        return {
          ...ev,
          invitedBrands: (ev.invitedBrands ?? []).map((inv) =>
            inv.brandId === brandId
              ? {
                  ...inv,
                  status: SPONSORSHIP_STATUS.EN_VERIFICACION,
                  closureSubmission: submission,
                }
              : inv,
          ),
        }
      }),
    )
  }

  const handleExploreSimilarBrands = () => {
    setActiveTab('recommended')
  }

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
          {!isPastEvent && (
            <SponsorTabs
              active={activeTab}
              onChange={setActiveTab}
              invitedCount={invitedBrands.length}
              recommendedCount={suggestedBrands.length}
            />
          )}

          <div className={cn(!isPastEvent && 'pt-6')}>
            {isPastEvent || activeTab === 'invited' ? (
              <section className="space-y-6">
                <EventInvitedSponsors
                  sponsors={invitedBrands}
                  event={event}
                  unreadBrandNotifications={unreadBrandNotifications}
                  onAcknowledgeBrandNotification={handleAcknowledgeBrandNotification}
                  onCloseCaseForBrand={handleCloseCaseForBrand}
                  onExploreSimilarBrands={handleExploreSimilarBrands}
                />
              </section>
            ) : (
              <section className="space-y-3">
                <RecommendedBrandsTagLegend />
                {suggestedBrands.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border-subtle bg-secondary/30 px-6 py-16 text-center">
                    <p className="type-body-muted">
                      No hay más marcas recomendadas para este evento
                    </p>
                  </div>
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

      <SponsorshipCloseCaseModal
        isOpen={Boolean(closeCaseTarget)}
        caseInfo={closeCaseTarget}
        onClose={() => setCloseCaseTarget(null)}
        onSubmit={handleCloseCaseSubmit}
      />
    </div>
  )
}
