import { useState } from 'react'
import { Calendar, MapPin, Pencil } from 'lucide-react'
import EventEditModal from '../components/event-luma/EventEditModal'
import EventInvitedSponsors from '../components/event-luma/EventInvitedSponsors'
import SuggestedSponsorCard from '../components/event-luma/SuggestedSponsorCard'

const SPONSOR_TABS = [
  { id: 'invited', label: 'Sponsors Invitados' },
  { id: 'recommended', label: 'Sponsors Recomendados' },
]

function formatEventDate(date, time) {
  if (!date) return ''
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

function EventCover({ event }) {
  if (event.coverImage) {
    return (
      <img
        src={event.coverImage}
        alt=""
        className="h-48 w-full rounded-2xl border border-neutral-100 object-cover"
      />
    )
  }

  return (
    <div
        className={`relative h-48 w-full overflow-hidden rounded-2xl border border-neutral-100 bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-200 via-stone-100 to-white'}`}
    >
      {event.coverLabel && (
        <span className="absolute bottom-4 left-5 font-display text-[11px] font-black uppercase tracking-[0.35em] text-neutral-900/25">
          {event.coverLabel}
        </span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  )
}

function SponsorTabs({ active, onChange }) {
  return (
    <div className="border-b border-neutral-100">
      <div className="flex gap-8">
        {SPONSOR_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative pb-3 text-sm font-bold transition-colors ${
              active === tab.id
                ? 'text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-neutral-900" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MatchesAndRequests({
  event,
  invitedBrands = [],
  suggestedBrands = [],
  onInvite,
  onOpenChat,
  onEventUpdate,
  pendingCasesForEvent = [],
  onCloseCaseForBrand,
}) {
  const [activeTab, setActiveTab] = useState('invited')
  const [isEditOpen, setIsEditOpen] = useState(false)

  if (!event) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-sm text-neutral-400">Seleccioná un evento para gestionar sponsors</p>
      </div>
    )
  }

  const locationLine = event.venueAddress ?? event.location
  const dateLine = formatEventDate(event.date, event.time)

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-5xl p-8">
        <header className="mb-8">
          <EventCover event={event} />

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-3">
              <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900 sm:text-[1.65rem]">
                {event.title}
              </h1>
              <div className="flex flex-col gap-2 text-sm text-neutral-500">
                {dateLine && (
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
                    <span className="capitalize">{dateLine}</span>
                  </p>
                )}
                {locationLine && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-orange-500" strokeWidth={1.75} />
                    {locationLine}
                  </p>
                )}
              </div>
              {event.niche && (
                <span className="inline-block rounded-full border border-neutral-100 bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral-600">
                  {event.niche}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-100 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-200 hover:bg-neutral-50"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              Editar evento
            </button>
          </div>
        </header>

        <div className="rounded-2xl border border-neutral-100 bg-white">
          <div className="border-b border-neutral-100 px-6 pt-6 sm:px-8">
            <SponsorTabs active={activeTab} onChange={setActiveTab} />
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'invited' ? (
              <section className="space-y-6">
                <p className="text-xs text-neutral-500">
                  Marcas contactadas para este evento — estados de invitación en tiempo real.
                </p>
                {pendingCasesForEvent.length > 0 && (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                    <p className="text-xs font-semibold text-orange-900">
                      Evento finalizado: tenés {pendingCasesForEvent.length} patrocinio
                      {pendingCasesForEvent.length !== 1 ? 's' : ''} por cerrar
                    </p>
                    <button
                      type="button"
                      onClick={() => onCloseCaseForBrand?.(pendingCasesForEvent[0].brandId)}
                      className="mt-3 rounded-xl bg-neutral-900 px-4 py-2 text-[11px] font-bold text-white hover:bg-neutral-800"
                    >
                      Cerrar Caso
                    </button>
                  </div>
                )}
                <EventInvitedSponsors
                  sponsors={invitedBrands}
                  onInformContact={() => onOpenChat?.()}
                />
              </section>
            ) : (
              <section className="space-y-6">
                <p className="text-xs text-neutral-500">
                  Uanabis sugeridos para{' '}
                  <span className="font-semibold text-neutral-700">{event.niche}</span> en CABA
                </p>
                {suggestedBrands.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-16 text-center text-sm text-neutral-400">
                    No hay más sponsors recomendados para este nicho
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {suggestedBrands.map((brand) => (
                      <SuggestedSponsorCard
                        key={brand.id}
                        brand={brand}
                        onInvite={onInvite}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      <EventEditModal
        event={event}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={onEventUpdate}
      />
    </div>
  )
}
