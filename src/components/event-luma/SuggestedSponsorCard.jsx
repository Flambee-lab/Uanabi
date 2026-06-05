import { Plus } from 'lucide-react'
import BrandLogo from '../BrandLogo'
import BrandEventMatchTags from '../events/BrandEventMatchTags'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

function formatContribution(brand) {
  const type = brand.typicalContribution ?? brand.budgetType
  const firstOffer = brand.offers?.[0]
  if (firstOffer && type) return `${type} · ${firstOffer}`
  if (type) return type
  return 'Patrocinio a medida'
}

export default function SuggestedSponsorCard({ brand, event, onInvite }) {
  return (
    <Card className="uanabi-panel uanabi-card-hover gap-0 overflow-hidden py-0 shadow-none">
      {brand.coverImage && (
        <div className="relative h-24 w-full border-b border-border-subtle bg-muted">
          <img
            src={brand.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <BrandLogo
            name={brand.name}
            logo={brand.logo}
            logoFallback={brand.logoFallback}
            size="sm"
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="type-body truncate font-bold text-foreground">{brand.name}</h3>
            <p className="type-small text-muted-foreground">{brand.industry}</p>
          </div>
        </div>

        {event && <BrandEventMatchTags brand={brand} event={event} className="mt-4" />}

        <p className="type-small mt-3 line-clamp-2 text-muted-foreground">
          {formatContribution(brand)}
        </p>
      </CardContent>

      <CardFooter className="border-t border-border-subtle bg-background p-4">
        <Button
          type="button"
          size="event"
          className="w-full"
          onClick={() => onInvite(brand.id)}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Enviar propuesta
        </Button>
      </CardFooter>
    </Card>
  )
}
