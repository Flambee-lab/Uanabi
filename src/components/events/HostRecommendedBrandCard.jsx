import { Plus } from 'lucide-react'
import BrandLogo from '../BrandLogo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getBrandEventSeekTags } from '../../utils/brandSeekMatch'
import BrandSeekCriterionTag from './BrandSeekCriterionTag'

export default function HostRecommendedBrandCard({ brand, event, onInvite, className }) {
  const tags = getBrandEventSeekTags(brand, event ? [event] : [])
  const matchedCount = tags.filter((tag) => tag.matched).length

  return (
    <article
      className={cn(
        'uanabi-sponsor-stroke flex items-start gap-3 rounded-xl bg-white p-3',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <div className="flex min-w-0 items-center gap-2">
            <BrandLogo
              name={brand.name}
              logo={brand.logo}
              logoFallback={brand.logoFallback}
              size="md"
            />
            <h3 className="font-display text-sm font-bold text-foreground">{brand.name}</h3>
          </div>
          <span className="type-small text-muted-foreground">{brand.industry}</span>
          {matchedCount > 0 && (
            <span className="type-small font-medium text-emerald-700">
              {matchedCount} coincidencia{matchedCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <BrandSeekCriterionTag
              key={`${tag.group}-${tag.label}`}
              label={tag.label}
              matched={tag.matched}
            />
          ))}
        </ul>
      </div>

      {onInvite && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="mt-0.5 shrink-0"
          onClick={() => onInvite(brand.id)}
          aria-label={`Invitar a ${brand.name}`}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">Invitar</span>
        </Button>
      )}
    </article>
  )
}
