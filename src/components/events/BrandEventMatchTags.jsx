import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBrandSeekMatchForEvent } from '../../utils/brandSeekMatch'

function MatchPill({ label }) {
  return (
    <li
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-full border border-neutral-300',
        'bg-card px-2.5 py-1 type-small font-semibold text-foreground',
      )}
    >
      <ArrowUpRight className="h-3 w-3 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
      <span className="truncate">{label}</span>
    </li>
  )
}

export default function BrandEventMatchTags({ brand, event, maxTags = 5, className }) {
  const { matchedTags, matchCount, industryMatch, headline } = getBrandSeekMatchForEvent(
    brand,
    event,
  )

  if (matchCount === 0 && !industryMatch) return null

  return (
    <div className={className}>
      <p className="type-small font-medium text-emerald-800">{headline}</p>
      {matchedTags.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {matchedTags.slice(0, maxTags).map((tag) => (
            <MatchPill key={`${tag.group}-${tag.label}`} label={tag.label} />
          ))}
          {matchedTags.length > maxTags && (
            <li className="type-small self-center px-1 font-semibold text-muted-foreground">
              +{matchedTags.length - maxTags}
            </li>
          )}
        </ul>
      ) : (
        <p className="type-small mt-1 text-muted-foreground">
          Rubro {brand.industry} alineado con las industrias de tu evento
        </p>
      )}
    </div>
  )
}
