import { useState } from 'react'
import {
  Check,
  ChevronRight,
  ExternalLink,
  Pencil,
  Share2,
  Users,
} from 'lucide-react'
import BrandLogo from '../BrandLogo'
import EventCoverMedia from '../events/EventCoverMedia'
import ProfileAboutCard from './ProfileAboutCard'
import ProfileFloatingChips from './ProfileFloatingChips'
import ProfileSocialPanel from './ProfileSocialPanel'
import {
  getProfileCategories,
  getProfileDisplayName,
  getProfileInitial,
} from '../../data/hostProfile'
import { findBrandInCatalog, getEventPartnerBrands } from '../../utils/profileBrands'
import { splitEventsByTimeline } from '../../utils/hostEventBuckets'

const SAMSUNG_BRAND_ID = 'brand-004'

function cardCoverEvent(event) {
  if (!event.coverGradient) return event
  return {
    ...event,
    coverGradient: event.coverGradient.replace(/\bto-white\b/g, 'to-neutral-100'),
  }
}

function dropLastSamsungPartnership(events, brandCatalog) {
  let lastSamsungIndex = -1
  events.forEach((event, index) => {
    const partners = getEventPartnerBrands(event, brandCatalog)
    if (partners.some((brand) => brand.id === SAMSUNG_BRAND_ID)) {
      lastSamsungIndex = index
    }
  })
  if (lastSamsungIndex === -1) return events
  return events.filter((_, index) => index !== lastSamsungIndex)
}

function getCollaborationPreview(story) {
  const photos = story.evidencePhotos ?? []
  const first = photos.find((p) => typeof p === 'object' && p.previewUrl) ?? photos[0]
  if (typeof first === 'object' && first?.previewUrl) return first.previewUrl
  return null
}

function PartnershipBadge({ brandName, brand, size = 'sm' }) {
  return (
    <div className="flex items-center gap-3">
      <BrandLogo
        name={brand?.name ?? brandName}
        logo={brand?.logo}
        logoFallback={brand?.logoFallback}
        size={size}
      />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Partnership con
        </p>
        <p className="truncate font-display text-sm font-black text-neutral-900">{brandName}</p>
      </div>
    </div>
  )
}

function CollaborationCard({ story, brandCatalog }) {
  const preview = getCollaborationPreview(story)
  const primaryBrand = story.brandNames?.filter(Boolean)[0]
  const brand = findBrandInCatalog(primaryBrand, brandCatalog)
  const extraBrands = (story.brandNames ?? []).slice(1)

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[5/4] overflow-hidden bg-neutral-100">
        {preview ? (
          <img
            src={preview}
            alt=""
            className="absolute inset-0 block h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${brand?.coverGradient ?? 'from-neutral-100 to-neutral-200'}`}
          >
            <p className="px-4 text-center text-sm font-bold text-neutral-500">{story.title}</p>
          </div>
        )}
        {story.referenceLink && (
          <a
            href={story.referenceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-neutral-700 shadow-sm backdrop-blur-sm"
            aria-label="Ver referencia"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        )}
      </div>

      <div className="space-y-3 border-t border-neutral-100 p-4">
        {primaryBrand && (
          <div>
            <PartnershipBadge brandName={primaryBrand} brand={brand} />
            {extraBrands.length > 0 && (
              <p className="mt-2 text-[10px] font-medium text-neutral-500">
                + {extraBrands.join(' · ')}
              </p>
            )}
          </div>
        )}
        <h3 className="font-display text-sm font-bold text-neutral-900">{story.title}</h3>
        {story.attendance && (
          <p className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-400">
            <Users className="h-3 w-3" strokeWidth={2} />
            {story.attendance}
          </p>
        )}
      </div>
    </article>
  )
}

function EventPartnershipCard({ event, brandCatalog, onSelect }) {
  const partners = getEventPartnerBrands(event, brandCatalog)
  const dateLine = [event.date, event.time].filter(Boolean).join(' · ')
  const primaryPartner = partners[0]

  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      className="group w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white text-left shadow-sm transition hover:border-neutral-200 hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        <EventCoverMedia
          event={cardCoverEvent(event)}
          variant="hero"
          className="!max-h-none aspect-[2/1] w-full rounded-none"
        />
      </div>

      <div className="space-y-3 p-5">
        {primaryPartner ? (
          <PartnershipBadge
            brandName={primaryPartner.name}
            brand={primaryPartner}
            size="sm"
          />
        ) : (
          <p className="text-[11px] text-neutral-400">Sin patrocinio confirmado aún</p>
        )}

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {event.niche}
          </span>
          <h3 className="mt-1 font-display text-base font-bold text-neutral-900 group-hover:underline">
            {event.title}
          </h3>
          <p className="mt-2 text-xs text-neutral-500">{dateLine}</p>
        </div>

        {partners.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {partners.slice(1).map((brand) => (
              <span
                key={brand.id}
                className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600"
              >
                {brand.name}
              </span>
            ))}
          </div>
        )}

        <p className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-800">
          Ver experiencia
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </p>
      </div>
    </button>
  )
}

function EmptyBlock({ title }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white/60 px-6 py-12 text-center">
      <p className="text-sm text-neutral-400">{title}</p>
    </div>
  )
}

export default function ProfilePublicView({
  profile,
  events = [],
  brands = [],
  onEdit,
  onSelectEvent,
}) {
  const fullName = getProfileDisplayName(profile)
  const initial = getProfileInitial(profile)
  const categories = getProfileCategories(profile)
  const collaborations = (profile.successStories ?? []).filter((s) => s.title?.trim())
  const { past: pastEvents, upcoming: upcomingEvents } = splitEventsByTimeline(events)
  const sponsoredEvents = dropLastSamsungPartnership(
    [...upcomingEvents, ...pastEvents].filter(
      (e) => getEventPartnerBrands(e, brands).length > 0,
    ),
    brands,
  )

  const [shareState, setShareState] = useState('idle')

  const handleShareProfile = async () => {
    const url = window.location.href
    const title = `Perfil de ${fullName} en Uanabi`

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setShareState('copied')
      window.setTimeout(() => setShareState('idle'), 2200)
    } catch {
      setShareState('idle')
    }
  }

  return (
    <div className="min-h-full overflow-y-auto bg-[#fafafa]">
      <header className="sticky top-0 z-10 border-b border-neutral-100 bg-[#fafafa]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <p className="text-xs font-semibold text-neutral-500">Tu perfil público</p>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-800 shadow-sm transition hover:border-neutral-300"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            Editar perfil
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,360px)_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="relative w-full">
                <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-pink-200/70 via-violet-200/60 to-amber-100/70 blur-xl" />
                <div className="relative">
                  <ProfileFloatingChips
                    categories={categories}
                    eventsCount={events.length}
                  />
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt=""
                      className="relative aspect-square w-full rounded-3xl object-cover shadow-lg ring-2 ring-white"
                    />
                  ) : (
                    <div className="relative flex aspect-square w-full items-center justify-center rounded-3xl bg-neutral-900 font-display text-6xl font-black text-white shadow-lg ring-2 ring-white">
                      {initial}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
                  {fullName}
                </h1>
                {profile.displayName && profile.displayName !== fullName && (
                  <p className="mt-1 text-sm font-semibold text-neutral-500">{profile.displayName}</p>
                )}
              </div>

              <ProfileSocialPanel profile={profile} />

              <ProfileAboutCard profile={profile} />

              <button
                type="button"
                onClick={handleShareProfile}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-bold text-neutral-800 transition hover:border-neutral-300 hover:bg-white"
              >
                {shareState === 'copied' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
                    Enlace copiado
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Compartir perfil
                  </>
                )}
              </button>
            </div>
          </aside>

          <main className="min-w-0 space-y-14">
            <section>
              <div className="mb-6">
                <h2 className="font-display text-xl font-black tracking-tight text-neutral-900">
                  Experiencias patrocinadas
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Eventos con marcas confirmadas en la plataforma
                </p>
              </div>

              {sponsoredEvents.length === 0 ? (
                <EmptyBlock title="Sin experiencias con marcas confirmadas" />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {sponsoredEvents.map((event) => (
                    <EventPartnershipCard
                      key={event.id}
                      event={event}
                      brandCatalog={brands}
                      onSelect={onSelectEvent}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-6">
                <h2 className="font-display text-xl font-black tracking-tight text-neutral-900">
                  Colaboraciones con marcas
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Casos de éxito y partnerships que cargaste en tu perfil
                </p>
              </div>

              {collaborations.length === 0 ? (
                <EmptyBlock title="Sin colaboraciones publicadas" />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {collaborations.map((story) => (
                    <CollaborationCard
                      key={story.id}
                      story={story}
                      brandCatalog={brands}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
