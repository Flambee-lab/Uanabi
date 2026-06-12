import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import BrandLogo from '../BrandLogo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getBrandEventSeekTags } from '../../utils/brandSeekMatch'
import BrandSeekCriterionTag from './BrandSeekCriterionTag'

export default function HostRecommendedBrandCard({ brand, event, onInvite, className }) {
  const [chipsOpen, setChipsOpen] = useState(false)
  const tags = getBrandEventSeekTags(brand, event ? [event] : [])
  const matchedCount = tags.filter((tag) => tag.matched).length
  const panelId = `brand-seek-tags-${brand.id}`
  const hasTags = tags.length > 0
  const toggleChips = () => setChipsOpen((open) => !open)

  return (
    <article
      className={cn(
        'uanabi-sponsor-stroke flex flex-col gap-2 rounded-xl bg-white p-3',
        className,
      )}
    >
      <div className="flex items-start gap-3">
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
              <button
                type="button"
                className="type-small font-medium text-emerald-700 transition hover:text-emerald-800"
                aria-expanded={chipsOpen}
                aria-controls={panelId}
                onClick={toggleChips}
              >
                {matchedCount} coincidencia{matchedCount !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {onInvite && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onInvite(brand.id)}
              aria-label={`Invitar a ${brand.name}`}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Invitar</span>
            </Button>
          )}
          {hasTags && (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              className="h-8 w-8 shrink-0 px-0 text-muted-foreground hover:text-foreground"
              aria-expanded={chipsOpen}
              aria-controls={panelId}
              aria-label={chipsOpen ? 'Ocultar criterios de match' : 'Ver criterios de match'}
              onClick={toggleChips}
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  chipsOpen && 'rotate-180',
                )}
                strokeWidth={2}
              />
            </Button>
          )}
        </div>
      </div>

      {hasTags && chipsOpen && (
        <ul id={panelId} className="flex flex-wrap gap-1.5 border-t border-border-subtle pt-2">
          {tags.map((tag) => (
            <BrandSeekCriterionTag
              key={`${tag.group}-${tag.label}`}
              label={tag.label}
              matched={tag.matched}
            />
          ))}
        </ul>
      )}
    </article>
  )
}
