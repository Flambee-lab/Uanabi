import { useState } from 'react'
import { Infinity } from 'lucide-react'
import { useBrandLogoSrc } from '@/hooks/useBrandLogoSrc'
import BrandCategoryTags from './BrandCategoryTags'

const COVER_BY_INDUSTRY = {
  Bebidas:
    'https://images.unsplash.com/photo-1629203857988-ef7dd06ae83c?auto=format&fit=crop&w=800&q=80',
  Tecnología:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  Indumentaria:
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80',
  Gastronomía:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  Entretenimiento:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
}

function participacionesLabel(count) {
  const n = count ?? 0
  return n === 1 ? '1 participación' : `${n} participaciones`
}

function BrandAvatar({ brand }) {
  const { src, exhausted, onError, key } = useBrandLogoSrc(brand)

  return (
    <div className="relative brand-logo-surface h-14 w-14 shrink-0 rounded-full border-2 border-card ring-1 ring-border-subtle">
      {!exhausted ? (
        <img
          key={key}
          src={src}
          alt=""
          className="h-10 w-10 object-contain"
          onError={onError}
        />
      ) : (
        <span className="font-display text-lg font-extrabold text-foreground/70">
          {brand.name.charAt(0)}
        </span>
      )}
    </div>
  )
}

function CardCover({ brand }) {
  const [coverFailed, setCoverFailed] = useState(false)
  const coverSrc =
    brand.coverImage ?? COVER_BY_INDUSTRY[brand.industry] ?? null
  const showImage = coverSrc && !coverFailed

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
      {showImage ? (
        <img
          src={coverSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${brand.coverGradient ?? 'from-muted to-background'}`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/5" />

      <div className="absolute bottom-3 left-3">
        <BrandAvatar brand={brand} />
      </div>
    </div>
  )
}

/** Card de catálogo — solo descubrimiento; el detalle se abre al hacer click. */
export default function BrandDiscoverCard({ brand, onSelect }) {
  const participations = brand.participations ?? brand.activeHosts ?? 0

  const handleActivate = () => onSelect?.(brand.id)

  return (
    <article
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? handleActivate : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleActivate()
              }
            }
          : undefined
      }
      className={`uanabi-card-hover group flex w-full flex-col shadow-none ${
        onSelect ? 'cursor-pointer text-left' : ''
      }`}
    >
      <CardCover brand={brand} />

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="type-heading line-clamp-2 group-hover:underline group-hover:underline-offset-2">
          {brand.name}
        </h3>

        <BrandCategoryTags brand={brand} className="mt-2" />

        <p className="type-small mt-2 inline-flex items-center gap-1.5 text-muted-foreground">
          <Infinity
            className="h-3.5 w-3.5 shrink-0 text-foreground/45"
            strokeWidth={2}
            aria-hidden
          />
          {participacionesLabel(participations)}
        </p>
      </div>
    </article>
  )
}
