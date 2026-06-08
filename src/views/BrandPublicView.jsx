import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Infinity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import BrandProductPacks from '../components/brand/BrandProductPacks'
import BrandSeekTags from '../components/brand/BrandSeekTags'
import BrandSocialAndScale from '../components/brand/BrandSocialAndScale'
import BrandCategoryTags from '../components/explore/BrandCategoryTags'
import BrandLogo from '../components/BrandLogo'
import { availableBrands } from '../data/mockEvents'
import {
  getBrandCollaborationHosts,
  getBrandPartnershipPhotos,
} from '../data/brandProfileExtras'
import { useBrandLogoSrc } from '../hooks/useBrandLogoSrc'
import { cn } from '@/lib/utils'
import {
  UANABI_PROFILE_CARD_CLASS,
  UANABI_PROFILE_COVER_CLASS,
} from '../components/layout/UanabiProfileLayout'
import { getBrandCategoryTags } from '../utils/exploreFilters'

const COVER_BY_INDUSTRY = {
  Bebidas:
    'https://images.unsplash.com/photo-1629203857988-ef7dd06ae83c?auto=format&fit=crop&w=1200&q=80',
  Tecnología:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  Indumentaria:
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
  Gastronomía:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  Entretenimiento:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
}

function formatCollabCount(count) {
  const n = count ?? 0
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')} mil`
  return String(n)
}

function CollaborationHostRow({ host }) {
  const initial = host.name?.charAt(0) ?? 'H'

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="type-body flex items-center gap-1 font-semibold text-foreground">
          <span className="truncate">{host.handle ?? host.name}</span>
          {host.verified && (
            <BadgeCheck
              className="h-3.5 w-3.5 shrink-0 text-foreground"
              strokeWidth={2.5}
              aria-label="Verificado"
            />
          )}
        </p>
        <p className="type-small truncate text-muted-foreground">{host.name}</p>
      </div>
    </li>
  )
}

function BrandHeroLogo({ brand }) {
  const { src, exhausted, onError, key } = useBrandLogoSrc(brand)

  return (
    <div className="relative brand-logo-surface -mt-9 h-16 w-16 shrink-0 rounded-xl border-[3px] border-card shadow-md ring-1 ring-border-subtle sm:-mt-10 sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-2xl">
      {!exhausted ? (
        <img
          key={key}
          src={src}
          alt=""
          className="h-11 w-11 object-contain sm:h-14 sm:w-14"
          onError={onError}
        />
      ) : (
        <span className="font-display text-xl font-extrabold text-foreground/70 sm:text-2xl">
          {brand.name.charAt(0)}
        </span>
      )}
      <span
        className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground"
        aria-hidden
      >
        <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
      </span>
    </div>
  )
}

function PartnershipsGallery({ photos }) {
  const [index, setIndex] = useState(0)
  const visible = photos.slice(index, index + 4)
  const canPrev = index > 0
  const canNext = index + 4 < photos.length

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="type-heading font-display font-bold text-foreground">
          Colaboraciones recientes en Uanabi
        </h2>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-foreground/70 transition hover:bg-selection disabled:opacity-30"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setIndex((i) => i + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-foreground/70 transition hover:bg-selection disabled:opacity-30"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {visible.map((src, i) => (
          <div
            key={`${src}-${index + i}`}
            className="aspect-square overflow-hidden rounded-2xl border border-border-subtle bg-muted"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}

function RelatedBrandRow({ brand, onSelect }) {
  const tags = getBrandCategoryTags(brand, 2)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(brand.id)}
      className="flex w-full items-center gap-3 rounded-2xl border border-border-subtle p-3 text-left transition hover:border-border hover:bg-selection/60"
    >
      <BrandLogo
        name={brand.name}
        logo={brand.logo}
        logoFallback={brand.logoFallback}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="type-body truncate font-semibold text-foreground">{brand.name}</p>
        <p className="type-small truncate text-muted-foreground">
          {tags.join(' · ') || 'Sponsor'}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
    </button>
  )
}

export default function BrandPublicView({
  brand,
  hostEvents = [],
  relatedBrands = [],
  onBack,
  onRequestPartnership,
  onSelectBrand,
}) {
  const [coverFailed, setCoverFailed] = useState(false)
  const [bioExpanded, setBioExpanded] = useState(false)

  const enriched = useMemo(
    () => availableBrands.find((b) => b.id === brand.id) ?? brand,
    [brand],
  )

  if (!brand) return null

  const coverSrc =
    brand.coverImage ?? COVER_BY_INDUSTRY[brand.industry] ?? null
  const showCover = coverSrc && !coverFailed
  const participations = brand.participations ?? brand.activeHosts ?? 0
  const partnershipPhotos = getBrandPartnershipPhotos(brand)
  const collaborationHosts = getBrandCollaborationHosts(brand)
  const bio =
    enriched.bio ??
    `${brand.name} patrocina eventos en Capital Federal con intercambio de producto y activaciones en vivo.`
  const bioShort = bio.length > 320 ? `${bio.slice(0, 320).trim()}…` : bio
  const alsoViewed = relatedBrands.filter((b) => b.id !== brand.id).slice(0, 4)

  return (
    <div className="uanabi-page min-h-full overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-2.5 sm:px-10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 type-small font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Volver al catálogo
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-8 pt-4 sm:px-10 sm:pb-10 sm:pt-5">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div className="min-w-0 space-y-8">
            <Card className={UANABI_PROFILE_CARD_CLASS}>
              <div className={UANABI_PROFILE_COVER_CLASS}>
                {showCover ? (
                  <img
                    src={coverSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => setCoverFailed(true)}
                  />
                ) : (
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br',
                      brand.coverGradient ?? 'from-muted to-background',
                    )}
                  />
                )}
              </div>

              <CardContent className="px-6 pb-5 pt-0 sm:px-8 sm:pb-6">
                <div className="relative min-w-0">
                  <BrandHeroLogo brand={brand} />
                  <div className="mt-3 sm:mt-3.5">
                    <div className="flex items-start justify-between gap-4">
                      <h1 className="type-display min-w-0 font-display font-black tracking-tight text-foreground">
                        {brand.name}
                      </h1>
                      {onRequestPartnership && (
                        <Button
                          type="button"
                          variant="primary"
                          size="lg"
                          className="shrink-0"
                          onClick={() => onRequestPartnership(brand.id)}
                        >
                          Solicitar patrocinio
                          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                        </Button>
                      )}
                    </div>
                    <BrandCategoryTags brand={brand} className="mt-2.5" />
                    <p className="type-body mt-3 max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">
                      {bioExpanded ? bio : bioShort}
                    </p>
                    {bio.length > 320 && (
                      <button
                        type="button"
                        onClick={() => setBioExpanded((e) => !e)}
                        className="type-small mt-2 font-semibold text-foreground underline-offset-2 hover:underline"
                      >
                        {bioExpanded ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                    <BrandSocialAndScale brand={brand} />
                  </div>
                </div>

                <section className="mt-6 space-y-8 border-t border-border-subtle pt-6 sm:mt-7 sm:pt-7">
                  <BrandSeekTags brand={brand} hostEvents={hostEvents} />
                  <BrandProductPacks brand={brand} />
                </section>
              </CardContent>
            </Card>

            <Card className={UANABI_PROFILE_CARD_CLASS}>
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6 border-b border-border-subtle pb-5">
                  <div className="min-w-0">
                    <h2 className="type-heading font-display font-bold text-foreground">
                      Colaboraciones en Uanabi
                    </h2>
                    <p className="type-small mt-1 text-muted-foreground">
                      Hosts con los que trabajó esta marca
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="inline-flex items-center justify-end gap-1.5 font-display text-3xl font-black leading-none tracking-tight text-foreground sm:text-4xl">
                      <Infinity
                        className="h-6 w-6 text-foreground/35 sm:h-7 sm:w-7"
                        strokeWidth={2}
                        aria-hidden
                      />
                      {formatCollabCount(participations)}
                    </p>
                    <p className="type-small mt-1.5 font-semibold text-foreground">
                      colaboraciones
                    </p>
                  </div>
                </div>
                <ul className="divide-y divide-border-subtle">
                  {collaborationHosts.map((host) => (
                    <CollaborationHostRow key={host.id} host={host} />
                  ))}
                </ul>
              </CardContent>
            </Card>

            <PartnershipsGallery photos={partnershipPhotos} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[4.5rem] lg:self-start">
            {alsoViewed.length > 0 && (
              <Card className={UANABI_PROFILE_CARD_CLASS}>
                <CardContent className="p-6">
                  <h2 className="type-heading font-display font-bold text-foreground">
                    Otras marcas sugeridas
                  </h2>
                  <div className="mt-4 space-y-2">
                    {alsoViewed.map((b) => (
                      <RelatedBrandRow
                        key={b.id}
                        brand={b}
                        onSelect={onSelectBrand}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
