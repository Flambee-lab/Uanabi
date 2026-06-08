import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  AtSign,
  BadgeCheck,
  Calendar,
  ChevronRight,
  ExternalLink,
  MapPin,
  MessageCircle,
  Pencil,
} from 'lucide-react'
import {
  buildWhatsAppUrl,
  formatJoinedDate,
  getProfileCategories,
  getProfileDisplayName,
  getProfileInitial,
  HOST_LOCATION,
  normalizeSocialUrl,
  PROFILE_PUBLIC_TABS,
  WHATSAPP_PREFILL_MESSAGE,
} from '../../data/hostProfile'
import { splitEventsByTimeline } from '../../utils/hostEventBuckets'

function getCollaborationPreview(story) {
  const photos = story.evidencePhotos ?? []
  const first = photos.find((p) => typeof p === 'object' && p.previewUrl) ?? photos[0]
  if (typeof first === 'object' && first?.previewUrl) return first.previewUrl
  return null
}

function PortfolioCard({ story }) {
  const preview = getCollaborationPreview(story)
  const brandLabel = story.brandNames?.[0]
  const meta = [
    brandLabel,
    (story.evidencePhotos?.length ?? 0) > 0
      ? `${story.evidencePhotos.length} evidencia${story.evidencePhotos.length !== 1 ? 's' : ''}`
      : null,
  ].filter(Boolean)

  return (
    <article className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle bg-secondary">
      {preview ? (
        <img src={preview} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-100 to-white p-6">
          <p className="text-center text-sm font-bold text-muted-foreground">{story.title}</p>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 pt-10">
        <p className="line-clamp-2 text-sm font-bold text-white">{story.title}</p>
        {meta.length > 0 && (
          <p className="mt-1 type-small font-medium text-white/80">{meta.join(' · ')}</p>
        )}
      </div>
      {story.referenceLink && (
        <a
          href={story.referenceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 top-3 rounded-full border border-border-subtle bg-white/95 p-1.5 text-foreground/80"
          aria-label="Ver referencia"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      )}
    </article>
  )
}

function EventShowcaseCard({ event, onSelect }) {
  const dateLine = [event.date, event.time].filter(Boolean).join(' · ')

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className="group w-full overflow-hidden rounded-2xl border border-border-subtle bg-white text-left transition hover:border-border"
    >
      <div
        className={`aspect-[16/7] w-full bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-100 to-white'}`}
      />
      <div className="p-5">
        <span className="type-label ">
          {event.niche}
        </span>
        <h3 className="mt-1 font-display text-base font-bold text-foreground group-hover:underline">
          {event.title}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">{dateLine}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-foreground">
          Ver ficha comercial
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </p>
      </div>
    </button>
  )
}

export default function ProfilePublicView({
  profile,
  events = [],
  onExitPreview,
  onEdit,
  onSelectEvent,
  onGoToEvents,
}) {
  const [activeTab, setActiveTab] = useState('historial')
  const fullName = getProfileDisplayName(profile)
  const initial = getProfileInitial(profile)
  const categories = getProfileCategories(profile)
  const instagramUrl = normalizeSocialUrl('instagram', profile.instagram)
  const tiktokUrl = normalizeSocialUrl('tiktok', profile.tiktok)
  const showWhatsApp = profile.commercialContactEnabled !== false
  const whatsappUrl = showWhatsApp
    ? buildWhatsAppUrl(profile.whatsapp, WHATSAPP_PREFILL_MESSAGE)
    : null
  const collaborations = (profile.successStories ?? []).filter((s) => s.title?.trim())
  const { upcoming: upcomingEvents } = splitEventsByTimeline(events)
  const bio =
    profile.bio?.trim() ||
    profile.tagline?.trim() ||
    'Host verificado en Onbrand. Experiencias en CABA con trayectoria comprobable ante marcas.'

  return (
    <div className="min-h-full overflow-y-auto bg-white">
      <div className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <p className="text-xs font-semibold text-muted-foreground">Preview Public Profile</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground/80 hover:bg-secondary"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              Editar perfil
            </button>
            <button
              type="button"
              onClick={onExitPreview}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Salir de preview
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-52 w-52 object-cover ring-1 ring-neutral-100 lg:h-56 lg:w-56"
            />
          ) : (
            <div className="flex h-52 w-52 items-center justify-center bg-primary font-display text-5xl font-black text-white lg:h-56 lg:w-56">
              {initial}
            </div>
          )}

          <div className="min-w-0 space-y-5">
            <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {fullName}
            </h1>
            {profile.displayName && profile.displayName !== fullName && (
              <p className="text-sm font-semibold text-muted-foreground">{profile.displayName}</p>
            )}
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <BadgeCheck className="h-4 w-4" strokeWidth={2} />
              Host verificado en Onbrand
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                {profile.location ?? HOST_LOCATION}, Argentina
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                Miembro desde {formatJoinedDate(profile.joinedAt)}
              </li>
            </ul>
            {categories.length > 0 && (
              <div>
                <p className="type-label ">
                  Expertise
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="type-label ">Bio</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{bio}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80"
                >
                  <AtSign className="h-3.5 w-3.5" />
                  Instagram
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80"
                >
                  TikTok
                </a>
              )}
              {profile.socialMetrics?.totalFollowers && (
                <span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  {profile.socialMetrics.totalFollowers} seguidores
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 border-b border-border-subtle">
          <nav className="flex gap-8">
            {PROFILE_PUBLIC_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 pb-3 text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-10">
          {activeTab === 'historial' ? (
            collaborations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  Sin colaboraciones publicadas aún
                </p>
                {onGoToEvents && (
                  <button
                    type="button"
                    onClick={onGoToEvents}
                    className="mt-4 text-sm font-semibold text-foreground underline-offset-2 hover:underline"
                  >
                    Ver patrocinios confirmados en Mis Eventos
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {collaborations.map((story) => (
                  <PortfolioCard key={story.id} story={story} />
                ))}
              </div>
            )
          ) : upcomingEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Sin próximos eventos visibles en tu perfil
              </p>
              {onGoToEvents && (
                <button
                  type="button"
                  onClick={onGoToEvents}
                  className="mt-4 text-sm font-semibold text-foreground underline-offset-2 hover:underline"
                >
                  Gestionar eventos en Mis Eventos
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {upcomingEvents.map((event) => (
                <EventShowcaseCard key={event.id} event={event} onSelect={onSelectEvent} />
              ))}
            </div>
          )}
        </div>

        {whatsappUrl && (
          <div className="rounded-2xl border border-border-subtle bg-secondary p-8 text-center">
            <p className="font-display text-lg font-bold text-foreground">
              Contacto comercial directo
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Las marcas pueden escribir al Host por WhatsApp sin fricción.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'mt-6')}
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} />
              WhatsApp comercial
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
