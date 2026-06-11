import { Infinity } from 'lucide-react'
import BrandLogo from '../BrandLogo'

export default function SponsorBrandPill({ brand, verified = false, eventCount }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-secondary/40 px-2.5 py-1">
      <BrandLogo
        name={brand.name}
        logo={brand.logo}
        logoFallback={brand.logoFallback}
        size="xs"
      />
      <span className="type-small font-medium text-foreground">{brand.name}</span>
      {verified && (
        <span
          className="inline-flex items-center gap-0.5 font-display text-xs font-bold leading-none text-primary"
          title="Colaboración verificada en Uanabi"
        >
          <Infinity className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
          {eventCount != null && eventCount > 1 ? <span>{eventCount}</span> : null}
        </span>
      )}
    </div>
  )
}
