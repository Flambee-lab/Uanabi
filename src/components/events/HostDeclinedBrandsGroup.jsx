import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import BrandLogo from '../BrandLogo'
import HostInvitedBrandTimeline from './HostInvitedBrandTimeline'

export const DECLINED_GROUP_SUMMARY = {
  title: 'Solicitudes rechazadas',
  subtitle: 'Estas marcas no se suman al evento',
}

function DeclinedLogoStrip({ brands }) {
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="shrink-0 opacity-70 grayscale"
          title={brand.name}
        >
          <BrandLogo
            name={brand.name}
            logo={brand.logo}
            logoFallback={brand.logoFallback}
            size="xs"
          />
        </div>
      ))}
    </div>
  )
}

function CollapsedGroupSummary() {
  return (
    <div className="hidden min-w-[8.5rem] max-w-[12rem] text-right sm:block">
      <p className="type-small font-semibold leading-snug text-foreground">
        {DECLINED_GROUP_SUMMARY.title}
      </p>
      <p className="type-small mt-0.5 leading-snug text-muted-foreground">
        {DECLINED_GROUP_SUMMARY.subtitle}
      </p>
    </div>
  )
}

export default function HostDeclinedBrandsGroup({
  brands,
  event,
  isPastEvent = false,
  unreadBrandNotifications = new Map(),
  onAcknowledgeBrandNotification,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `declined-brands-group-${event?.id ?? 'event'}`

  return (
    <article className="overflow-hidden rounded-xl border border-navbar-border bg-secondary/30">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <DeclinedLogoStrip brands={brands} />
        {!isOpen && (
          <>
            <CollapsedGroupSummary />
            <p className="type-small font-semibold leading-snug text-foreground sm:hidden">
              {DECLINED_GROUP_SUMMARY.title}
            </p>
          </>
        )}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div id={panelId} className="space-y-2 border-t border-navbar-border px-2 pb-2 pt-3">
          {brands.map((brand) => (
            <HostInvitedBrandTimeline
              key={brand.id}
              brand={brand}
              event={event}
              isPastEvent={isPastEvent}
              unreadNotificationType={unreadBrandNotifications.get(brand.id) ?? null}
              onAcknowledgeNotification={onAcknowledgeBrandNotification}
            />
          ))}
        </div>
      )}
    </article>
  )
}
