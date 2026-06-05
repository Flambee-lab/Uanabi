import { useState } from 'react'
import {
  AtSign,
  Calendar,
  ExternalLink,
  MapPin,
  MessageCircle,
  Pencil,
} from 'lucide-react'
import {
  buildWhatsAppUrl,
  formatJoinedDate,
  normalizeSocialUrl,
  resolvePastBrandLogos,
  WHATSAPP_PREFILL_MESSAGE,
} from '../../data/hostProfile'

const TABS = [
  { id: 'open', label: 'Convocatorias Abiertas' },
  { id: 'success', label: 'Historial de Éxitos' },
]

function MetricBubble({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-secondary px-4 py-3 text-center">
      <p className="type-label ">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-black text-foreground">{value}</p>
    </div>
  )
}

function OpenEventCard({ event }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-sm">
      <div className={`h-32 bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-100 to-white'}`} />
      <div className="p-5">
        <h3 className="font-display text-sm font-bold text-foreground">{event.title}</h3>
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
          {event.date}
        </p>
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-orange-500" strokeWidth={1.75} />
          {event.venueName ?? event.location}
        </p>
      </div>
    </article>
  )
}

function SuccessStoryCard({ story, brandCatalog }) {
  const brands = resolvePastBrandLogos(story.brandNames ?? [], brandCatalog)
  const evidenceCount = story.evidencePhotos?.length ?? 0
  const metaParts = [
    story.attendance ? `${story.attendance} asistentes` : null,
    brands.length > 0 ? `${brands.length} marcas` : null,
    evidenceCount > 0 ? `${evidenceCount} evidencia${evidenceCount !== 1 ? 's' : ''}` : null,
  ].filter(Boolean)

  return (
    <article className="flex gap-5 overflow-hidden rounded-[24px] border border-border-subtle bg-white p-5 shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="type-label ">
          Colaboración verificada
        </p>
        <h3 className="mt-1 font-display text-base font-bold text-foreground">
          {story.title}
        </h3>
        {metaParts.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">{metaParts.join(' · ')}</p>
        )}
        {story.referenceLink && (
          <a
            href={story.referenceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline"
          >
            Ver referencia
          </a>
        )}
        {brands.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {brands.map((b) =>
              b.logo ? (
                <img
                  key={b.name}
                  src={b.logo}
                  alt=""
                  className="h-8 w-8 rounded-lg border border-border-subtle bg-white object-contain p-1 grayscale opacity-70"
                />
              ) : (
                <span
                  key={b.name}
                  className="rounded-lg bg-secondary px-2 py-1 type-small font-bold text-muted-foreground"
                >
                  {b.name}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default function ProfilePublicMeetup({
  profile,
  events,
  stats,
  brandCatalog,
  onQuickEdit,
}) {
  const [tab, setTab] = useState('open')
  const instagramUrl = normalizeSocialUrl('instagram', profile.instagram)
  const tiktokUrl = normalizeSocialUrl('tiktok', profile.tiktok)
  const showWhatsApp = profile.commercialContactEnabled !== false
  const whatsappUrl = showWhatsApp
    ? buildWhatsAppUrl(profile.whatsapp, WHATSAPP_PREFILL_MESSAGE)
    : null

  const reachLabel =
    stats.totalReach >= 1000
      ? `${(stats.totalReach / 1000).toFixed(1)}k`
      : stats.totalReach

  return (
    <div className="rounded-[32px] bg-[#fcfcfc] p-4 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="relative w-full shrink-0 rounded-3xl border border-border-subtle bg-white p-6 lg:w-[300px]">
          <button
            type="button"
            onClick={onQuickEdit}
            className="absolute right-4 top-4 rounded-full border border-border bg-white p-2 text-muted-foreground shadow-sm transition hover:border-primary hover:text-foreground"
            aria-label="Editar perfil"
            title="Editar perfil"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-primary font-display text-3xl font-black text-white">
              {profile.displayName?.charAt(0) ?? 'H'}
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">
              Host verificado en Uanabi
            </p>
            <p className="mt-1 type-small text-muted-foreground">
              Desde {formatJoinedDate(profile.joinedAt)}
            </p>

            <div className="mt-6 w-full space-y-2">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-border py-2.5 text-xs font-semibold text-foreground/80 hover:border-primary"
                >
                  <AtSign className="h-3.5 w-3.5" strokeWidth={2} />
                  Instagram
                  {profile.validatedLinks?.instagram && (
                    <span className="text-match-foreground">✓</span>
                  )}
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-border py-2.5 text-xs font-semibold text-foreground/80 hover:border-primary"
                >
                  TikTok
                  {profile.validatedLinks?.tiktok && (
                    <span className="text-match-foreground">✓</span>
                  )}
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
            </div>

            <div className="mt-6 grid w-full grid-cols-1 gap-2">
              <MetricBubble label="Matches" value={stats.matches} />
              <MetricBubble label="Alcance" value={reachLabel} />
              <MetricBubble label="Eventos" value={stats.eventsCount} />
              <MetricBubble label="Engagement" value={stats.engagement} />
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[24px] bg-match py-3.5 text-xs font-bold text-match-foreground transition hover:bg-[#e8ecd8]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                Contactar por WhatsApp
              </a>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6 p-2 sm:p-4">
          <div>
            <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {profile.displayName}
            </h1>
            {profile.tagline && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {profile.tagline}
              </p>
            )}
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {profile.socialMetrics?.totalFollowers} seguidores ·{' '}
              {profile.socialMetrics?.engagementPercent} engagement
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-secondary p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                  tab === t.id
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground/80'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'open' ? (
            events.length === 0 ? (
              <p className="rounded-[24px] border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                Sin convocatorias abiertas por ahora
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {events.map((event) => (
                  <OpenEventCard key={event.id} event={event} />
                ))}
              </div>
            )
          ) : (profile.successStories ?? []).length === 0 ? (
            <p className="rounded-[24px] border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              El host aún no cargó historial de éxitos
            </p>
          ) : (
            <div className="space-y-4">
              {profile.successStories.map((story) => (
                <SuccessStoryCard
                  key={story.id}
                  story={story}
                  brandCatalog={brandCatalog}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
