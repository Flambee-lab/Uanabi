import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  MessageCircle,
  Users,
  X,
} from 'lucide-react'
import { buildWhatsAppUrl, WHATSAPP_PREFILL_MESSAGE } from '../../data/hostProfile'

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

function SpecItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-4">
      <Icon className="mb-2 h-4 w-4 text-neutral-400" strokeWidth={1.75} />
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  )
}

function DealList({ title, items }) {
  return (
    <div>
      <p className="text-xs font-bold text-neutral-900">{title}</p>
      <ul className="mt-3 space-y-2">
        {(items ?? []).map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-neutral-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function EventCommercialSheet({ event, hostProfile, onBack, onOpenChat }) {
  const [proposalOpen, setProposalOpen] = useState(false)

  if (!event) return null

  const locationLine = event.venueAddress ?? event.location ?? 'CABA, Buenos Aires'
  const dateLine = formatEventDate(event.date, event.time)
  const offers = event.offers ?? [
    'Stands y activaciones de marca en el venue',
    'Banners, naming y presencia en redes del evento',
    'Sampling y experiencias para la audiencia',
  ]
  const seeks = event.seeks ?? [
    'Presupuesto en efectivo según alcance',
    'Canje de producto alineado al nicho del evento',
  ]

  const whatsappUrl = buildWhatsAppUrl(
    hostProfile?.whatsapp,
    `${WHATSAPP_PREFILL_MESSAGE} Me interesa el evento: ${event.title}.`,
  )

  return (
    <div className="min-h-full overflow-y-auto bg-white">
      <div className="border-b border-neutral-100">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-8 py-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Volver al perfil del Host
          </button>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Ficha comercial · Solo lectura
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-8 py-8">
        <div
          className={`aspect-[16/6] w-full overflow-hidden rounded-2xl border border-neutral-100 bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-200 to-white'}`}
        >
          {event.coverLabel && (
            <div className="flex h-full items-end p-8">
              <span className="font-display text-xs font-black uppercase tracking-[0.4em] text-neutral-900/20">
                {event.coverLabel}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <span className="inline-block rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-bold text-neutral-600">
            {event.niche}
          </span>
          <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
            {event.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-neutral-600">
            {event.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SpecItem icon={Users} label="Audiencia estimada" value={event.audience} />
          <SpecItem icon={MapPin} label="Ubicación" value={locationLine} />
          <SpecItem icon={Calendar} label="Fecha y hora" value={dateLine} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 md:grid-cols-2 md:p-8">
          <DealList title="Qué ofrece el evento" items={offers} />
          <DealList title="Qué busca el evento" items={seeks} />
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-10">
          <button
            type="button"
            onClick={() => setProposalOpen(true)}
            className="w-full rounded-xl bg-neutral-900 py-4 text-sm font-bold text-white transition hover:bg-neutral-800 sm:w-auto sm:px-12"
          >
            Proponer Patrocinio
          </button>
        </div>
      </div>

      {proposalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Comunicación directa
                </p>
                <p className="mt-1 font-display text-lg font-bold text-neutral-900">
                  Proponer patrocinio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProposalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-50"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              Tu propuesta para <span className="font-semibold text-neutral-800">{event.title}</span>{' '}
              se enviará al Host por el canal de mensajería de Uanabi o WhatsApp comercial.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setProposalOpen(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-3 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-neutral-800"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2} />
                  WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  onOpenChat?.()
                  setProposalOpen(false)
                }}
                className="flex-1 rounded-xl bg-[#f4f6e9] py-3 text-xs font-bold text-[#1d230d] hover:bg-[#e8ecd8]"
              >
                Ir al chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
