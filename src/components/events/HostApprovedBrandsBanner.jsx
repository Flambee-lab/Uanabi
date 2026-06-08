import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProductDeliveryByLabel } from '../../utils/sponsorshipLifecycle'

function buildBannerMessage(approvedBrands, event) {
  const names = approvedBrands.map((b) => b.name).filter(Boolean)
  const count = names.length
  const productDeliveryBy = event ? getProductDeliveryByLabel(event) : null

  const headline =
    count === 1
      ? `${names[0]} aprobó tu evento`
      : `${count} marcas aprobaron tu evento`

  const coordination = productDeliveryBy
    ? `te contactamos nosotros para coordinar el envío de productos (objetivo: ${productDeliveryBy})`
    : 'te contactamos nosotros para coordinar el envío de productos'

  return `${headline} — ${coordination}.`
}

export default function HostApprovedBrandsBanner({
  approvedBrands = [],
  event,
  onDismiss,
  className,
}) {
  if (!approvedBrands.length) return null

  const message = buildBannerMessage(approvedBrands, event)

  return (
    <div
      role="status"
      className={cn(
        'flex w-full items-center gap-2 border-b border-white/10 bg-foreground px-6 py-2 sm:px-10',
        className,
      )}
    >
      <p className="type-small min-w-0 flex-1 leading-snug text-background">
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="-mr-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-background/60 transition-colors hover:bg-white/10 hover:text-background"
        aria-label="Cerrar aviso"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  )
}
