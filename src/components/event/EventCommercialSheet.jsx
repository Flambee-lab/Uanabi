import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  MessageCircle,
  Users,
  X,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
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
    <div className="rounded-xl border border-border-subtle bg-white p-4">
      <Icon className="mb-2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      <p className="type-label ">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function DealList({ title, items }) {
  return (
    <div>
      <p className="text-xs font-bold text-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {(items ?? []).map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function EventCommercialSheet({
  event,
  hostProfile,
  onBack,
  onOpenChat,
  previewMode = false,
}) {
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
      <div className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-8 py-4">
          {previewMode ? (
            <p className="text-xs font-semibold text-muted-foreground">
              Vista de marca — ficha comercial del evento
            </p>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Volver al perfil del Host
            </button>
          )}
          <div className="flex items-center gap-3">
            <p className="type-label">Ficha comercial · Solo lectura</p>
            {previewMode && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-8 py-8">
        <div
          className={`aspect-[16/6] w-full overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br ${event.coverGradient ?? 'from-neutral-200 to-white'}`}
        >
          {event.coverLabel && (
            <div className="flex h-full items-end p-8">
              <span className="font-display text-xs font-black uppercase tracking-[0.4em] text-foreground/20">
                {event.coverLabel}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <span className="inline-block rounded-full border border-border px-3 py-1 type-small font-bold text-muted-foreground">
            {event.niche}
          </span>
          <h1 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {event.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SpecItem icon={Users} label="Audiencia estimada" value={event.audience} />
          <SpecItem icon={MapPin} label="Ubicación" value={locationLine} />
          <SpecItem icon={Calendar} label="Fecha y hora" value={dateLine} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 rounded-2xl border border-border-subtle bg-secondary p-6 md:grid-cols-2 md:p-8">
          <DealList title="Qué ofrece el evento" items={offers} />
          <DealList title="Qué busca el evento" items={seeks} />
        </div>

        <div className="mt-12 border-t border-border-subtle pt-10">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setProposalOpen(true)}
          >
            Proponer Patrocinio
          </Button>
        </div>
      </div>

      {proposalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-white p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="type-label ">
                  Comunicación directa
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  Proponer patrocinio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProposalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Tu propuesta para <span className="font-semibold text-foreground">{event.title}</span>{' '}
              se enviará al Host por el canal de mensajería de Uanabi o WhatsApp comercial.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                size="default"
                className="flex-1"
                onClick={() => setProposalOpen(false)}
              >
                Cancelar
              </Button>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'primary', size: 'default', className: 'flex-1' })}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2} />
                  WhatsApp
                </a>
              )}
              <Button
                type="button"
                variant="match"
                size="default"
                className="flex-1"
                onClick={() => {
                  onOpenChat?.()
                  setProposalOpen(false)
                }}
              >
                Ir al chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
