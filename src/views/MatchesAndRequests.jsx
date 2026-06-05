import { useState } from 'react'
import { Calendar, MapPin, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import EventEditModal from '../components/event-luma/EventEditModal'
import EventInvitedSponsors from '../components/event-luma/EventInvitedSponsors'
import SuggestedSponsorCard from '../components/event-luma/SuggestedSponsorCard'

const SPONSOR_TABS = [
  { id: 'invited', label: 'Marcas invitadas' },
  { id: 'recommended', label: 'Recomendadas' },
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
        className="h-52 w-full rounded-2xl border border-border-subtle object-cover shadow-sm"
      />
    )
  }

  return (
    <div
      className={`relative h-52 w-full overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br shadow-sm ${event.coverGradient ?? 'from-muted via-secondary to-card'}`}
    >
      {event.coverLabel && (
        <span className="uanabi-label absolute bottom-4 left-5 text-foreground/25">
          {event.coverLabel}
        </span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  )
}

function SponsorTabs({ active, onChange }) {
  return (
    <div className="uanabi-nav-rail">
      {SPONSOR_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'uanabi-nav-item',
            active === tab.id && 'uanabi-nav-item-active',
          )}
        >
          {tab.label}
        </button>
      ))}
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
  compact = false,
}) {
  const [activeTab, setActiveTab] = useState('invited')
  const [isEditOpen, setIsEditOpen] = useState(false)

  if (!event) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="uanabi-meta">Seleccioná un evento para gestionar sponsors</p>
      </div>
    )
  }

  const locationLine = event.venueAddress ?? event.location
  const dateLine = formatEventDate(event.date, event.time)

  return (
    <div className="min-h-full bg-background">
      <div
        className={cn(
          'mx-auto max-w-5xl',
          compact ? 'px-6 py-6 sm:px-8' : 'p-8 sm:p-10',
        )}
      >
        <header className={cn(compact ? 'mb-5' : 'mb-10')}>
          {!compact && <EventCover event={event} />}

          <div
            className={cn(
              'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
              !compact && 'mt-8',
            )}
          >
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={cn(compact ? 'type-heading' : 'uanabi-title-lg', 'font-display font-bold')}>
                  {event.title}
                </h1>
                {event.niche && compact && (
                  <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {event.niche}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {dateLine && (
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 opacity-60" strokeWidth={1.75} />
                    <span className="capitalize">{dateLine}</span>
                  </p>
                )}
                {locationLine && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 opacity-60" strokeWidth={1.75} />
                    {locationLine}
                  </p>
                )}
              </div>
              {event.niche && !compact && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 font-semibold">
                  {event.niche}
                </Badge>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="shrink-0 gap-2 rounded-xl"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              Editar
            </Button>
          </div>
        </header>

        <Card className="uanabi-panel gap-0 py-0">
          <CardHeader className="border-b border-border-subtle px-6 pt-6 pb-5 sm:px-8">
            <SponsorTabs active={activeTab} onChange={setActiveTab} />
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {activeTab === 'invited' ? (
              <section className="space-y-8">
                <p className="type-small">
                  Marcas contactadas para este evento — estados de invitación en tiempo real.
                </p>
                {pendingCasesForEvent.length > 0 && (
                  <div className="rounded-2xl border border-orange-200/80 bg-orange-50/80 p-5">
                    <p className="text-sm font-semibold text-orange-950">
                      Evento finalizado: tenés {pendingCasesForEvent.length} patrocinio
                      {pendingCasesForEvent.length !== 1 ? 's' : ''} por cerrar
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="mt-4 rounded-xl"
                      onClick={() => onCloseCaseForBrand?.(pendingCasesForEvent[0].brandId)}
                    >
                      Cerrar Caso
                    </Button>
                  </div>
                )}
                <EventInvitedSponsors
                  sponsors={invitedBrands}
                  onInformContact={() => onOpenChat?.()}
                />
              </section>
            ) : (
              <section className="space-y-6">
                <p className="type-small max-w-2xl leading-relaxed text-muted-foreground">
                  Cruzamos tu evento con lo que cada marca declara buscar (tipo, audiencia, zona,
                  formato). Las etiquetas verdes muestran por qué encajan.
                </p>
                {suggestedBrands.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border-subtle py-16 text-center">
                    <p className="uanabi-meta">
                      No hay más marcas recomendadas para este evento
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {suggestedBrands.map((brand) => (
                      <SuggestedSponsorCard
                        key={brand.id}
                        brand={brand}
                        event={event}
                        onInvite={onInvite}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </CardContent>
        </Card>
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
