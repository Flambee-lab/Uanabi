import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Check,
  MapPin,
  Share2,
  Users,
} from 'lucide-react'
import BrandLogo from '../BrandLogo'
import EventCoverMedia from '../events/EventCoverMedia'
import { getProfileDisplayName } from '../../data/hostProfile'
import { getEventPartnerBrands } from '../../utils/profileBrands'

function cardCoverEvent(event) {
  if (!event.coverGradient) return event
  return {
    ...event,
    coverGradient: event.coverGradient.replace(/\bto-white\b/g, 'to-neutral-100'),
  }
}

function formatEventDate(date, time) {
  if (!date) return 'Fecha a confirmar'
  const parsed = new Date(`${date}T12:00:00`)
  const formatted = Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
  return time ? `${formatted} · ${time}` : formatted
}

function MetaRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="mt-0.5 text-xs font-semibold text-neutral-900">{value}</p>
      </div>
    </div>
  )
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function DealList({ items }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-xs leading-relaxed text-neutral-600">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function SponsorRow({ brand }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-3 shadow-sm">
      <BrandLogo
        name={brand.name}
        logo={brand.logo}
        logoFallback={brand.logoFallback}
        size="sm"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-neutral-900">{brand.name}</p>
        <p className="text-[10px] font-semibold text-emerald-700">Patrocinio confirmado</p>
      </div>
    </div>
  )
}

function EmptyBlock({ title }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white/60 px-6 py-12 text-center">
      <p className="text-sm text-neutral-400">{title}</p>
    </div>
  )
}

export default function EventCommercialSheet({
  event,
  hostProfile,
  brands = [],
  onBack,
  previewMode = false,
}) {
  const [shareState, setShareState] = useState('idle')

  if (!event) return null

  const hostName = getProfileDisplayName(hostProfile)
  const locationLine = event.venueAddress ?? event.location ?? 'CABA, Buenos Aires'
  const venueName = event.venueName
  const dateLine = formatEventDate(event.date, event.time)
  const partners = getEventPartnerBrands(event, brands)
  const offers = event.offers ?? [
    'Stands y activaciones de marca en el venue',
    'Banners, naming y presencia en redes del evento',
    'Sampling y experiencias para la audiencia',
  ]
  const seeks = event.seeks ?? [
    'Presupuesto en efectivo según alcance',
    'Canje de producto alineado al nicho del evento',
  ]

  const handleShareEvent = async () => {
    const url = window.location.href
    const title = `${event.title} — ${hostName}`

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
          {previewMode ? (
            <p className="text-xs font-semibold text-neutral-500">
              Vista de marca — ficha comercial del evento
            </p>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition hover:text-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              Volver al perfil
            </button>
          )}
          <p className="text-xs font-semibold text-neutral-500">
            {previewMode ? 'Solo lectura' : 'Ficha del evento'}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,360px)_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="relative overflow-hidden rounded-2xl">
                <EventCoverMedia
                  event={cardCoverEvent(event)}
                  variant="hero"
                  className="!max-h-none aspect-[4/3] w-full rounded-2xl"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {event.niche}
                </span>
                <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
                  {event.title}
                </h1>
                {event.coverLabel && (
                  <p className="mt-2 font-display text-[10px] font-black uppercase tracking-[0.35em] text-neutral-300">
                    {event.coverLabel}
                  </p>
                )}
              </div>

              <InfoCard title="Detalles clave">
                <div className="space-y-4">
                  <MetaRow icon={Calendar} label="Fecha y hora" value={dateLine} />
                  <MetaRow icon={MapPin} label="Ubicación" value={locationLine} />
                  {venueName && (
                    <MetaRow icon={MapPin} label="Venue" value={venueName} />
                  )}
                  <MetaRow icon={Users} label="Audiencia" value={event.audience} />
                  {event.audienceGender && (
                    <MetaRow icon={Users} label="Perfil de público" value={event.audienceGender} />
                  )}
                </div>
              </InfoCard>

              <InfoCard title="Organización">
                <p className="text-xs font-bold text-neutral-900">{hostName}</p>
                {event.organizer?.role && (
                  <p className="mt-1 text-[11px] text-neutral-500">{event.organizer.role}</p>
                )}
                {event.hostCommunity?.name && (
                  <p className="mt-2 text-[11px] text-neutral-500">{event.hostCommunity.name}</p>
                )}
              </InfoCard>

              <button
                type="button"
                onClick={handleShareEvent}
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
                    Compartir evento
                  </>
                )}
              </button>
            </div>
          </aside>

          <main className="min-w-0 space-y-14">
            <section>
              <div className="mb-6">
                <h2 className="font-display text-xl font-black tracking-tight text-neutral-900">
                  Sobre este evento
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Descripción y contexto de la experiencia
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-sm leading-relaxed text-neutral-600">
                  {event.description ||
                    'Experiencia presencial en CABA con activaciones de marca, público cualificado y oportunidades de patrocinio.'}
                </p>
                {event.matchIndustries?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-5">
                    {event.matchIndustries.map((industry) => (
                      <span
                        key={industry}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold text-neutral-600"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="mb-6">
                <h2 className="font-display text-xl font-black tracking-tight text-neutral-900">
                  Propuesta comercial
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Lo que ofrece el evento y lo que busca de las marcas
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Qué ofrece
                  </p>
                  <div className="mt-4">
                    <DealList items={offers} />
                  </div>
                </article>
                <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Qué busca
                  </p>
                  <div className="mt-4">
                    <DealList items={seeks} />
                  </div>
                </article>
              </div>
            </section>

            <section>
              <div className="mb-6">
                <h2 className="font-display text-xl font-black tracking-tight text-neutral-900">
                  Marcas patrocinadoras
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Sponsors confirmados en esta experiencia
                </p>
              </div>

              {partners.length === 0 ? (
                <EmptyBlock title="Sin marcas confirmadas en este evento" />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {partners.map((brand) => (
                    <SponsorRow key={brand.id} brand={brand} />
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
