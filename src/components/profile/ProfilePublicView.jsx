import { useState } from 'react'
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
    <article className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-100 bg-neutral-100">
      {preview ? (
        <img src={preview} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-100 to-white p-6">
          <p className="text-center text-sm font-bold text-neutral-500">{story.title}</p>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 pt-10">
        <p className="line-clamp-2 text-sm font-bold text-white">{story.title}</p>
        {meta.length > 0 && (
          <p className="mt-1 text-[10px] font-medium text-white/80">{meta.join(' · ')}</p>
        )}
      </div>
      {story.referenceLink && (
        <a
          href={story.referenceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 top-3 rounded-full border border-neutral-100 bg-white/95 p-1.5 text-neutral-700"
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
      className="group w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white text-left transition hover:border-neutral-300"
    >
      <div
        className={`aspect-[16/7] w-full bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-100 to-white'}`}
      />
      <div className="p-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          {event.niche}
        </span>
        <h3 className="mt-1 font-display text-base font-bold text-neutral-900 group-hover:underline">
          {event.title}
        </h3>
        <p className="mt-2 text-xs text-neutral-500">{dateLine}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-neutral-900">
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
  const bio =
    profile.bio?.trim() ||
    profile.tagline?.trim() ||
    'Host verificado en Onbrand. Experiencias en CABA con trayectoria comprobable ante marcas.'

  return (
    <div className="min-h-full overflow-y-auto bg-white">
      <div className="border-b border-neutral-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <p className="text-xs font-semibold text-neutral-500">Preview Public Profile</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              Editar perfil
            </button>
            <button
              type="button"
              onClick={onExitPreview}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
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
            <div className="flex h-52 w-52 items-center justify-center bg-neutral-900 font-display text-5xl font-black text-white lg:h-56 lg:w-56">
              {initial}
            </div>
          )}

          <div className="min-w-0 space-y-5">
            <h1 className="font-display text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              {fullName}
            </h1>
            {profile.displayName && profile.displayName !== fullName && (
              <p className="text-sm font-semibold text-neutral-500">{profile.displayName}</p>
            )}
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800">
              <BadgeCheck className="h-4 w-4" strokeWidth={2} />
              Host verificado en Onbrand
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neutral-400" strokeWidth={1.75} />
                {profile.location ?? HOST_LOCATION}, Argentina
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-400" strokeWidth={1.75} />
                Miembro desde {formatJoinedDate(profile.joinedAt)}
              </li>
            </ul>
            {categories.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Expertise
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-800"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Bio</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{bio}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700"
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
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700"
                >
                  TikTok
                </a>
              )}
              {profile.socialMetrics?.totalFollowers && (
                <span className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600">
                  {profile.socialMetrics.totalFollowers} seguidores
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 border-b border-neutral-100">
          <nav className="flex gap-8">
            {PROFILE_PUBLIC_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 pb-3 text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
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
              <p className="rounded-2xl border border-dashed border-neutral-200 py-20 text-center text-sm text-neutral-400">
                Sin colaboraciones publicadas aún
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {collaborations.map((story) => (
                  <PortfolioCard key={story.id} story={story} />
                ))}
              </div>
            )
          ) : events.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-200 py-20 text-center text-sm text-neutral-400">
              Sin eventos activos publicados
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {events.map((event) => (
                <EventShowcaseCard key={event.id} event={event} onSelect={onSelectEvent} />
              ))}
            </div>
          )}
        </div>

        {whatsappUrl && (
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center">
            <p className="font-display text-lg font-bold text-neutral-900">
              Contacto comercial directo
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Las marcas pueden escribir al Host por WhatsApp sin fricción.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-neutral-800"
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
