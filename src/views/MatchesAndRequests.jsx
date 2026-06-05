import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  UANABI_PROFILE_CARD_CLASS,
  UANABI_PROFILE_COVER_CLASS,
  UanabiProfilePage,
} from '../components/layout/UanabiProfileLayout'
import EventAboutSection from '../components/events/EventAboutSection'
import EventCoverMedia from '../components/events/EventCoverMedia'
import EventFactsSheet from '../components/events/EventFactsSheet'
import EventPublicationStatusTag from '../components/events/EventPublicationStatusTag'
import { isEventPast } from '../utils/sponsorshipLifecycle'
import EventEditModal from '../components/event-luma/EventEditModal'
import EventInvitedSponsors from '../components/event-luma/EventInvitedSponsors'
import SuggestedSponsorCard from '../components/event-luma/SuggestedSponsorCard'

const SPONSOR_TABS = [
  { id: 'invited', label: 'Marcas invitadas' },
  { id: 'recommended', label: 'Recomendadas' },
]

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
}) {
  const [activeTab, setActiveTab] = useState('invited')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const isPastEvent = isEventPast(event)

  useEffect(() => {
    if (isPastEvent) setIsEditOpen(false)
  }, [event?.id, isPastEvent])

  if (!event) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="uanabi-meta">Seleccioná un evento para gestionar sponsors</p>
      </div>
    )
  }

  const handlePublicationStatusChange = (publicationStatus) => {
    onEventUpdate?.({ ...event, publicationStatus })
  }

  return (
    <UanabiProfilePage>
      <Card className={UANABI_PROFILE_CARD_CLASS}>
        <div className={UANABI_PROFILE_COVER_CLASS}>
          <EventCoverMedia event={event} variant="brandHero" />
        </div>

        <CardContent className="px-6 pb-5 pt-0 sm:px-8 sm:pb-6">
          <div className="flex items-start justify-between gap-4 pt-4">
            <div className="min-w-0 space-y-2">
              <EventPublicationStatusTag
                event={event}
                onStatusChange={handlePublicationStatusChange}
              />
              <h1 className="type-display font-display font-black tracking-tight text-foreground">
                {event.title}
              </h1>
            </div>
            {!isPastEvent ? (
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
            ) : (
              <p className="type-small max-w-[8rem] text-right text-muted-foreground">
                Evento finalizado — solo lectura
              </p>
            )}
          </div>

          <div className="mt-6 space-y-6 border-t border-border-subtle pt-6 sm:mt-7 sm:pt-7">
            <EventFactsSheet event={event} />
            <EventAboutSection event={event} />
          </div>
        </CardContent>
      </Card>

      <Card className={cn(UANABI_PROFILE_CARD_CLASS, 'gap-0 py-0')}>
        <CardContent className="p-6 sm:p-8">
          <h2 className="type-heading font-display font-bold text-foreground">Patrocinio</h2>
          <div className="mt-4 border-b border-border-subtle pb-4">
            <SponsorTabs active={activeTab} onChange={setActiveTab} />
          </div>

          <div className="pt-6">
            {activeTab === 'invited' ? (
              <section className="space-y-6">
                <p className="type-small text-muted-foreground">
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
                  <div className="rounded-2xl border border-dashed border-border-subtle bg-secondary/30 px-6 py-16 text-center">
                    <p className="type-body-muted">
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
          </div>
        </CardContent>
      </Card>

      {!isPastEvent && (
        <EventEditModal
          event={event}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={onEventUpdate}
        />
      )}
    </UanabiProfilePage>
  )
}
