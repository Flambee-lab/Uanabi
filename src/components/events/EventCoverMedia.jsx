import { cn } from '@/lib/utils'
import { BRAND_CATEGORY_TAG_CLASS } from '../explore/BrandCategoryTags'

function CoverNicheBadge({ niche }) {
  if (!niche) return null
  return (
    <span
      className={cn(
        BRAND_CATEGORY_TAG_CLASS,
        'absolute left-4 top-4 z-10 bg-card/95 shadow-sm backdrop-blur-sm',
      )}
    >
      {niche}
    </span>
  )
}

const HERO_GRADIENT =
  'from-muted via-secondary to-card'

/**
 * Portada del evento: imagen si existe, si no gradiente + etiqueta.
 */
export default function EventCoverMedia({
  event,
  variant = 'thumb',
  className,
}) {
  if (!event) return null

  const isHero = variant === 'hero'
  const isBrandHero = variant === 'brandHero'
  const isThumb = variant === 'thumb'
  if (event.coverImage) {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-neutral-100',
          isHero && 'aspect-[2.2/1] max-h-52 w-full sm:max-h-56',
          isBrandHero && 'h-full w-full',
          isThumb && 'h-14 w-[4.75rem] shrink-0 rounded-lg',
          className,
        )}
      >
        <img
          src={event.coverImage}
          alt=""
          className="absolute inset-0 block h-full w-full object-cover object-center"
        />
        {(isHero || isBrandHero) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        )}
        {(isHero || isBrandHero) && <CoverNicheBadge niche={event.niche} />}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br',
        event.coverGradient ?? HERO_GRADIENT,
        isHero && 'aspect-[2.2/1] max-h-52 w-full sm:max-h-56',
        isBrandHero && 'h-full w-full',
        isThumb && 'h-14 w-[4.75rem] shrink-0 rounded-lg border border-border-subtle/80',
        className,
      )}
    >
      {event.coverLabel && (
        <span
          className={cn(
            'uanabi-label absolute font-display text-foreground/20',
            isHero || isBrandHero ? 'bottom-4 left-5 text-sm' : 'bottom-1 left-1.5 text-[9px]',
          )}
        >
          {event.coverLabel}
        </span>
      )}
      {isThumb && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      )}
      {(isHero || isBrandHero) && <CoverNicheBadge niche={event.niche} />}
    </div>
  )
}
