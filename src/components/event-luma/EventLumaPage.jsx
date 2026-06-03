import {
  ArrowUpRight,
  CalendarPlus,
  ChevronRight,
  Clock,
  MapPin,
  Share2,
  Star,
} from 'lucide-react'
import EventSponsorsPanel from './EventSponsorsPanel'

function formatSidebarDateTime(dateStr, timeStr) {
  if (!dateStr) return timeStr ?? ''
  const d = new Date(`${dateStr}T12:00:00`)
  const dayPart = d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
  const timePart = timeStr?.replace('–', 'a').replace('-', 'a') ?? ''
  return timePart ? `${dayPart} · ${timePart} GMT-3` : dayPart
}

function StarRating({ value = 4.5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.floor(value)
              ? 'fill-pink-400 text-pink-400'
              : i < value
                ? 'fill-pink-200 text-pink-400'
                : 'fill-neutral-100 text-neutral-200'
          }`}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

export default function EventLumaPage({
  event,
  invitedBrands,
  suggestedBrands,
  sponsorSearch = '',
  onSponsorSearchChange,
  onInvite,
  onOpenChat,
}) {
  const organizer = event.organizer ?? { name: 'Host Demo', role: 'Organizador Uanabi' }
  const community = event.hostCommunity ?? {
    name: 'Uanabi — Eventos con sponsors',
    rating: 4.8,
    reviewCount: 124,
    coverGradient: 'from-violet-200 to-fuchsia-100',
  }
  const coverClass =
    event.coverGradient ?? 'from-violet-200 via-fuchsia-100 to-orange-50'
  const venueName = event.venueName ?? event.location?.split(',')[0]?.trim() ?? event.location
  const venueAddress = event.venueAddress ?? event.location
  const coHosts = event.coOrganizersCount ?? 0

  return (
    <div className="min-h-full bg-white pb-24">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:py-12">
        {/* Hero Luma — 60/40 */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Columna izquierda */}
          <div className="lg:col-span-3">
            <h1 className="font-display text-[2.5rem] font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-[2.75rem]">
              {event.title}
            </h1>

            <div className="mt-5 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                {organizer.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <p className="text-sm leading-snug text-neutral-600">
                  Organizado por{' '}
                  <span className="font-semibold text-neutral-900">{organizer.name}</span>
                  {coHosts > 0 && (
                    <span className="text-neutral-600">
                      {' '}
                      y {coHosts} más
                    </span>
                  )}
                </p>
                {organizer.isSuperHost && (
                  <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[10px] text-sky-600">
                      ✓
                    </span>
                    <span>
                      {organizer.name.split(' ')[0]} es un{' '}
                      <span className="font-semibold text-neutral-700">Super Organizador</span>
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Tarjeta comunidad */}
            <button
              type="button"
              className="mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-2.5 text-left transition hover:border-neutral-200 hover:shadow-sm"
            >
              <div
                className={`h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br ${community.coverGradient ?? 'from-neutral-200 to-neutral-100'}`}
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-0.5 text-sm font-semibold text-neutral-900">
                  <span className="truncate">{community.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={2} />
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-900">
                    {community.rating}
                  </span>
                  <StarRating value={community.rating} />
                  <span className="text-xs text-neutral-400">
                    {community.reviewCount} reseñas
                  </span>
                </div>
              </div>
            </button>

            {/* Detalles */}
            <section className="mt-10">
              <h2 className="relative inline-block text-lg font-bold text-neutral-900">
                Detalles
                <span
                  className="absolute -bottom-0.5 left-0 h-0.5 w-5 rounded-full bg-orange-400"
                  aria-hidden
                />
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-[1.65] text-neutral-600">
                {event.description}
              </p>

              <div className="mt-6 space-y-2.5">
                {event.time && (
                  <p className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <Clock className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
                    {event.time}
                  </p>
                )}
                <p className="flex items-center gap-2.5 text-sm text-neutral-700">
                  <MapPin
                    className="h-4 w-4 shrink-0 text-orange-500"
                    strokeWidth={1.75}
                    fill="currentColor"
                  />
                  {venueName}
                </p>
              </div>

              {(event.audience || event.niche) && (
                <div className="mt-6 space-y-1 border-t border-neutral-100 pt-6 text-sm text-neutral-500">
                  {event.audience && (
                    <p>
                      <span className="font-medium text-neutral-700">Audiencia:</span>{' '}
                      {event.audience}
                    </p>
                  )}
                  {event.niche && (
                    <p>
                      <span className="font-medium text-neutral-700">Nicho:</span> {event.niche}
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Columna derecha — dos tarjetas separadas */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 shadow-sm">
              <div
                className={`aspect-[4/3] w-full bg-gradient-to-br ${coverClass} flex items-center justify-center p-8`}
                role="img"
                aria-label={`Portada de ${event.title}`}
              >
                <span className="text-center font-display text-lg font-black uppercase tracking-widest text-neutral-900/80">
                  {event.coverLabel ?? event.title.split('—')[0]?.trim().slice(0, 24)}
                </span>
              </div>
              <button
                type="button"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3.5 py-2 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
              >
                <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                Compartir un volante
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
              <div className="flex items-start gap-3 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50">
                  <span className="text-base" aria-hidden>
                    📅
                  </span>
                </div>
                <p className="min-w-0 flex-1 pt-0.5 text-sm font-medium leading-snug text-neutral-800">
                  {formatSidebarDateTime(event.date, event.time)}
                </p>
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-50 hover:text-neutral-700"
                  aria-label="Añadir al calendario"
                >
                  <CalendarPlus className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>

              <div className="mx-4 border-t border-neutral-100" />

              <div className="flex items-start gap-3 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                  <MapPin
                    className="h-4 w-4 text-orange-500"
                    strokeWidth={1.75}
                    fill="currentColor"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-neutral-900">{venueName}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">{venueAddress}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-50 hover:text-neutral-700"
                  aria-label="Ver ubicación en mapa"
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <EventSponsorsPanel
          event={event}
          invitedSponsors={invitedBrands}
          suggestedSponsors={suggestedBrands}
          sponsorSearch={sponsorSearch}
          onSponsorSearchChange={onSponsorSearchChange}
          onInvite={onInvite}
          onOpenChat={onOpenChat}
        />
      </div>
    </div>
  )
}
