import { ArrowUpRight, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBrandEventSeekTags, hasAnySeekMatch } from '../../utils/brandSeekMatch'
import BrandProfileInset from './BrandProfileInset'

function SeekTag({ tag }) {
  const { label, matched, matchCount } = tag

  return (
    <li
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 type-small font-semibold',
        matched
          ? 'border-neutral-300 bg-card text-foreground'
          : 'border-border-subtle bg-secondary/40 text-muted-foreground/70',
      )}
    >
      {matched && (
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 text-emerald-600"
          strokeWidth={2.5}
          aria-hidden
        />
      )}
      <span>{label}</span>
      {matched && matchCount > 0 && (
        <span
          className="inline-flex shrink-0 items-center gap-0.5 text-muted-foreground"
          title={`${matchCount} evento${matchCount !== 1 ? 's' : ''} tuyo${matchCount !== 1 ? 's' : ''} encaja${matchCount !== 1 ? 'n' : ''}`}
        >
          <Link2 className="h-3 w-3" strokeWidth={2} aria-hidden />
          <span className="type-small font-bold tabular-nums">{matchCount}</span>
        </span>
      )}
    </li>
  )
}

export default function BrandSeekTags({ brand, hostEvents = [] }) {
  const tags = getBrandEventSeekTags(brand, hostEvents)

  if (tags.length === 0) return null

  const anyMatch = hasAnySeekMatch(tags)
  const matchCount = tags.filter((t) => t.matched).length

  return (
    <BrandProfileInset>
      <p className="type-heading font-display font-bold text-foreground">
        Qué tipo de eventos busca
      </p>
      <p className="type-small mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        La marca prioriza estos criterios.{' '}
        <span className="font-semibold text-foreground/80">
          No tenés que cumplirlos todos
        </span>{' '}
        — con que tu evento encaje en varios alcanza.
      </p>
      {anyMatch && (
        <p className="type-small mt-2 text-emerald-800">
          {matchCount === 1
            ? '1 criterio coincide con tus eventos.'
            : `${matchCount} criterios coinciden con tus eventos.`}
        </p>
      )}
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <SeekTag key={`${tag.group}-${tag.label}`} tag={tag} />
        ))}
      </ul>
    </BrandProfileInset>
  )
}
