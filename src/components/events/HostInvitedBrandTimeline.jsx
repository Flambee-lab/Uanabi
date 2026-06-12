import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BrandLogo from '../BrandLogo'
import { INLINE_NOTIFICATION_ACCENT_CLASS } from '../../utils/eventInlineNotifications'
import {
  getInvitationPresentation,
  getInvitationRowBorderClass,
  getInvitationRowSummaryTitleClass,
  getProductDeliveryByLabel,
  inviteNeedsHostVerificationUpload,
  SPONSORSHIP_STATUS,
} from '../../utils/sponsorshipLifecycle'

function StatusSummary({ summary, className }) {
  return (
    <div className={cn('shrink-0 text-right', className)}>
      <p
        className={cn(
          'type-small whitespace-nowrap font-semibold leading-snug',
          getInvitationRowSummaryTitleClass(summary.tone),
        )}
      >
        {summary.title}
      </p>
      <p className="type-small mt-0.5 whitespace-nowrap leading-snug text-muted-foreground">
        {summary.subtitle}
      </p>
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
}) {
  const status = brand.invitationStatus
  const productDeliveryBy = event ? getProductDeliveryByLabel(event) : null
  const presentationOptions = {
    isPastEvent,
    hostPhase: brand.hostPhase,
    declineReason: brand.declineReason,
    invitedAt: brand.invitedAt,
    productDeliveryBy,
  }
  const presentation = getInvitationPresentation(status, presentationOptions)
  const hasUnreadNotification = Boolean(unreadNotificationType)
  const needsVerificationUpload = inviteNeedsHostVerificationUpload({ status }, event)
  const participationValidationPending = needsVerificationUpload
  const accentType = hasUnreadNotification
    ? unreadNotificationType
    : participationValidationPending
      ? 'case_open'
      : null
  const isDeclinedUnread =
    status === SPONSORSHIP_STATUS.DECLINADO &&
    hasUnreadNotification &&
    unreadNotificationType === 'declined'
  const isDeclinedMuted = status === SPONSORSHIP_STATUS.DECLINADO && !isDeclinedUnread
  const showVerificationAction = needsVerificationUpload && onCloseCase
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `invite-brand-panel-${brand.id}`

  const handleToggle = () => {
    setIsOpen((open) => {
      const nextOpen = !open
      if (nextOpen && hasUnreadNotification) {
        onAcknowledgeNotification?.(brand.id, status)
      }
      return nextOpen
    })
  }

  return (
    <article
      className={cn(
        'uanabi-sponsor-stroke relative overflow-hidden rounded-xl border bg-white p-3',
        getInvitationRowBorderClass(presentation.tone),
        accentType === 'declined' && 'border-red-200/70',
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
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className={cn('shrink-0', isDeclinedMuted && 'opacity-50 grayscale')}>
          <BrandLogo
            name={brand.name}
            logo={brand.logo}
            logoFallback={brand.logoFallback}
            size="md"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="type-body font-semibold leading-snug text-foreground">{brand.name}</p>
          <p className="type-small mt-0.5 text-muted-foreground">{brand.industry}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusSummary summary={presentation} />
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            strokeWidth={2}
            aria-hidden
          />
        </div>
      </button>

      {isOpen && (
        <div id={panelId} className="mt-3 border-t border-border-subtle pt-3">
          <p className="type-small font-semibold leading-snug text-foreground">{presentation.detail}</p>
          {showVerificationAction && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="mt-3"
              onClick={() => onCloseCase(brand.id)}
            >
              Subir pruebas
            </Button>
          )}
        </div>
      )}
    </article>
  )
}
