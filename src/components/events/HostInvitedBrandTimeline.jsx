import { useEffect, useState } from 'react'
import { ChevronDown, Compass, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BrandLogo from '../BrandLogo'
import HostInvitationStepPanel from './HostInvitationStepPanel'
import { getBrandDeclineMessage } from '../../lib/invitacionesMarcas'
import { INLINE_NOTIFICATION_ACCENT_CLASS } from '../../utils/eventInlineNotifications'
import {
  getInvitationBadgeClass,
  getInvitationStatusBadgeLabel,
  getInvitationStepPanelContent,
  getInvitationTimelineProgress,
  getInvitationTimelineStepLabel,
  getInvitationTimelineStepState,
  getProductDeliveryByLabel,
  INVITATION_TIMELINE_STEPS,
  isDeclinedStatus,
  SPONSORSHIP_STATUS,
} from '../../utils/sponsorshipLifecycle'

function InvitationTimeline({ progress, status, className }) {
  const stepCount = INVITATION_TIMELINE_STEPS.length

  return (
    <ol
      className={cn('uanabi-invite-timeline-v list-none p-0', className)}
      aria-label="Progreso de la invitación"
    >
      {INVITATION_TIMELINE_STEPS.map((step, index) => {
        const state = getInvitationTimelineStepState(index, status, progress)
        const isCurrent = state === 'active' || state === 'declined'
        const isLast = index === stepCount - 1

        return (
          <li key={step.id} className="flex gap-2">
            <div className="flex w-2 shrink-0 flex-col items-center">
              <span
                className={cn(
                  'block w-0.5 shrink-0 rounded-full',
                  isCurrent && 'h-4 bg-foreground',
                  state === 'doneApproved' && 'h-2 bg-emerald-500',
                  (state === 'done' || state === 'future') && 'h-2 bg-neutral-200',
                  state === 'declined' && 'h-4 bg-orange-300',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              />
              {!isLast && <span className="my-0.5 w-px min-h-1.5 flex-1 bg-neutral-200" aria-hidden />}
            </div>
            <p
              className={cn(
                'min-w-0 flex-1 text-sm leading-[1.45]',
                !isLast && 'pb-1.5',
                isCurrent && 'font-medium text-foreground',
                state === 'doneApproved' && 'font-normal text-emerald-700',
                (state === 'done' || state === 'future') && 'font-normal text-muted-foreground',
                state === 'declined' && 'font-medium text-orange-800/90',
              )}
            >
              {getInvitationTimelineStepLabel(index, status)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold leading-none',
        getInvitationBadgeClass(status),
      )}
    >
      {getInvitationStatusBadgeLabel(status)}
    </span>
  )
}

function BrandDeclineMessageBubble({ brandName, message }) {
  return (
    <div className="relative mt-3 rounded-2xl border border-orange-100/90 bg-orange-50/50 px-4 py-3.5">
      <span
        className="absolute -top-2 left-5 h-3 w-3 rotate-45 border-l border-t border-orange-100/90 bg-orange-50/50"
        aria-hidden
      />
      <div className="flex gap-2.5">
        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600/80" strokeWidth={2} />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-orange-700/80">
            Mensaje de {brandName}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default function HostInvitedBrandTimeline({
  brand,
  event,
  isPastEvent = false,
  unreadNotificationType = null,
  onAcknowledgeNotification,
  onCloseCase,
  onExploreSimilarBrands,
}) {
  const status = brand.invitationStatus
  const isDeclined = isDeclinedStatus(status)
  const declineMessage = isDeclined ? getBrandDeclineMessage(brand) : ''
  const progress = getInvitationTimelineProgress(status, { isPastEvent })
  const productDeliveryBy = event ? getProductDeliveryByLabel(event) : null
  const hasUnreadNotification = Boolean(unreadNotificationType)
  const participationValidationPending =
    isPastEvent && status === SPONSORSHIP_STATUS.CASO_ABIERTO
  const accentType = hasUnreadNotification
    ? unreadNotificationType
    : participationValidationPending
      ? 'case_open'
      : null
  const isDeclinedUnread =
    isDeclined && hasUnreadNotification && unreadNotificationType === 'declined'
  const isDeclinedMuted = isDeclined && !isDeclinedUnread
  const stepPanel = getInvitationStepPanelContent(status, {
    isPastEvent,
    productDeliveryBy,
    invitedAt: brand.invitedAt,
    approvedBannerVisible:
      hasUnreadNotification && status === SPONSORSHIP_STATUS.MATCH_ACEPTADO,
  })
  const showCloseCase = status === SPONSORSHIP_STATUS.CASO_ABIERTO && onCloseCase
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `invite-brand-panel-${brand.id}`

  const handleToggle = () => {
    if (isDeclined) return
    setIsOpen((open) => {
      const nextOpen = !open
      if (nextOpen && hasUnreadNotification) {
        onAcknowledgeNotification?.(brand.id, status)
      }
      return nextOpen
    })
  }

  useEffect(() => {
    if (isDeclined && hasUnreadNotification) {
      onAcknowledgeNotification?.(brand.id, status)
    }
  }, [isDeclined, hasUnreadNotification, brand.id, status, onAcknowledgeNotification])

  const headerRow = (
    <>
      <div className={cn('shrink-0', isDeclinedMuted && 'opacity-80')}>
        <BrandLogo
          name={brand.name}
          logo={brand.logo}
          logoFallback={brand.logoFallback}
          size="md"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-[1.45] text-foreground">{brand.name}</p>
        <p className="text-sm font-normal leading-[1.45] text-muted-foreground">{brand.industry}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {(!isOpen || isDeclined) && (
          <div className="flex min-w-[6.25rem] justify-end">
            <StatusBadge status={status} />
          </div>
        )}
        {!isDeclined && (
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            strokeWidth={2}
            aria-hidden
          />
        )}
      </div>
    </>
  )

  return (
    <article
      className={cn(
        'uanabi-sponsor-stroke relative overflow-hidden rounded-xl bg-white p-3',
        isDeclined && 'border-orange-100/80 bg-orange-50/15',
        accentType === 'declined' && 'border-orange-200/70',
        accentType === 'approved' && 'border-emerald-200/60',
        accentType === 'verifying' && 'border-violet-200/60',
        accentType === 'case_open' && 'border-orange-200/80',
      )}
    >
      {accentType && (
        <span
          className={cn(
            'absolute bottom-3 left-0 top-3 w-[3px] rounded-full',
            accentType === 'declined'
              ? 'bg-orange-300'
              : (INLINE_NOTIFICATION_ACCENT_CLASS[accentType] ?? 'bg-emerald-500'),
          )}
          aria-hidden
        />
      )}
      {isDeclined ? (
        <div className="flex w-full items-center gap-3">{headerRow}</div>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 text-left"
        >
          {headerRow}
        </button>
      )}

      {isDeclined && declineMessage && (
        <BrandDeclineMessageBubble brandName={brand.name} message={declineMessage} />
      )}

      {isOpen && !isDeclined && (
        <div
          id={panelId}
          className="mt-3 flex items-start gap-3 border-t border-border-subtle pt-3"
        >
          <InvitationTimeline
            progress={progress}
            status={status}
            className="w-[6.5rem] shrink-0"
          />
          <HostInvitationStepPanel content={stepPanel}>
            {showCloseCase && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-2.5"
                onClick={() => onCloseCase(brand.id)}
              >
                Validar participación
              </Button>
            )}
          </HostInvitationStepPanel>
        </div>
      )}

      {isDeclined && onExploreSimilarBrands && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full rounded-full border-orange-200/90 bg-white text-orange-900 hover:bg-orange-50/80"
          onClick={() => onExploreSimilarBrands(brand)}
        >
          <Compass className="h-4 w-4" />
          Explorar marcas similares
        </Button>
      )}
    </article>
  )
}
