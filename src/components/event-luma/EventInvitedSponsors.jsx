import { useState } from 'react'
import { Info, X } from 'lucide-react'
import BrandLogo from '../BrandLogo'
import {
  getInvitationStatusLabel,
} from '../../utils/eventSponsorMatch'
import {
  getInvitationBadgeClass,
  INVITATION_SENT_COPY,
  SPONSORSHIP_STATUS,
} from '../../utils/sponsorshipLifecycle'

function InvitedSponsorCard({ brand }) {
  const status = brand.invitationStatus
  const label = getInvitationStatusLabel(status)
  const badgeClass = getInvitationBadgeClass(status)
  const showSentCopy = status === SPONSORSHIP_STATUS.INVITACION_ENVIADA
  const showVerification =
    status === SPONSORSHIP_STATUS.EN_VERIFICACION
  const showOpenCase = status === SPONSORSHIP_STATUS.CASO_ABIERTO

  return (
    <article className="rounded-2xl border border-border-subtle bg-white p-6">
      <div className="flex items-start gap-4">
        <div className={status === 'declinado' ? 'opacity-50 grayscale' : ''}>
          <BrandLogo
            name={brand.name}
            logo={brand.logo}
            logoFallback={brand.logoFallback}
            size="md"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-bold text-foreground">{brand.name}</h3>
          <p className="mt-0.5 type-small text-muted-foreground">{brand.industry}</p>
          <span
            className={`mt-3 inline-block rounded-full border px-2.5 py-1 type-small font-medium ${badgeClass}`}
          >
            {label}
          </span>
        </div>
      </div>

      {showSentCopy && (
        <p className="mt-4 type-small leading-relaxed text-muted-foreground">{INVITATION_SENT_COPY}</p>
      )}

      {showOpenCase && (
        <p className="mt-4 type-small leading-relaxed text-orange-700/90">
          Patrocinio acordado fuera de la app. Cerrá el caso con fotos y reseña para validar la marca
          en tu perfil.
        </p>
      )}

      {showVerification && (
        <p className="mt-4 type-small leading-relaxed text-sky-700">
          Tus pruebas están en revisión. Onbrand validará el caso en las próximas 24 horas.
        </p>
      )}
    </article>
  )
}

export default function EventInvitedSponsors({ sponsors, onInformContact }) {
  const [infoTarget, setInfoTarget] = useState(null)

  if (!sponsors.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-secondary/50 py-12 text-center text-sm text-muted-foreground">
        Todavía no invitaste sponsors a este evento.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sponsors.map((sponsor) => (
          <InvitedSponsorCard key={sponsor.id} brand={sponsor} />
        ))}
      </div>

      {infoTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border-subtle bg-white p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
                <p className="font-display text-lg font-bold text-foreground">Contacto directo</p>
              </div>
              <button
                type="button"
                onClick={() => setInfoTarget(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              El chat integrado estará disponible pronto. Por ahora, la marca te contactará por
              WhatsApp comercial. Cuando el evento finalice, cerrá el caso desde el banner de Mis
              Eventos para validar la colaboración.
            </p>
            <button
              type="button"
              onClick={() => {
                onInformContact?.(infoTarget)
                setInfoTarget(null)
              }}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary/90"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
