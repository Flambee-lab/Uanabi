import { useState } from 'react'
import { Info, X } from 'lucide-react'
import {
  getInvitationStatusLabel,
} from '../../utils/eventSponsorMatch'
import {
  getInvitationBadgeClass,
  INVITATION_SENT_COPY,
  SPONSORSHIP_STATUS,
} from '../../utils/sponsorshipLifecycle'

function InvitedSponsorCard({ brand }) {
  const [failed, setFailed] = useState(false)
  const status = brand.invitationStatus
  const label = getInvitationStatusLabel(status)
  const badgeClass = getInvitationBadgeClass(status)
  const showSentCopy = status === SPONSORSHIP_STATUS.INVITACION_ENVIADA
  const showVerification =
    status === SPONSORSHIP_STATUS.EN_VERIFICACION
  const showOpenCase = status === SPONSORSHIP_STATUS.CASO_ABIERTO

  return (
    <article className="rounded-2xl border border-neutral-100 bg-white p-6">
      <div className="flex items-start gap-4">
        {failed ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-bold text-neutral-700">
            {brand.name.charAt(0)}
          </div>
        ) : (
          <img
            src={brand.logo}
            alt=""
            className={`h-14 w-14 shrink-0 rounded-full border border-neutral-100 object-cover ${
              status === 'declinado' ? 'opacity-50 grayscale' : ''
            }`}
            onError={() => setFailed(true)}
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-bold text-neutral-900">{brand.name}</h3>
          <p className="mt-0.5 text-[11px] text-neutral-400">{brand.industry}</p>
          <span
            className={`mt-3 inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeClass}`}
          >
            {label}
          </span>
        </div>
      </div>

      {showSentCopy && (
        <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">{INVITATION_SENT_COPY}</p>
      )}

      {showOpenCase && (
        <p className="mt-4 text-[11px] leading-relaxed text-orange-700/90">
          Patrocinio acordado fuera de la app. Cerrá el caso con fotos y reseña para validar la marca
          en tu perfil.
        </p>
      )}

      {showVerification && (
        <p className="mt-4 text-[11px] leading-relaxed text-sky-700">
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
      <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-12 text-center text-sm text-neutral-400">
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
          <div className="w-full max-w-sm rounded-2xl border border-neutral-100 bg-white p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-neutral-500" strokeWidth={1.75} />
                <p className="font-display text-lg font-bold text-neutral-900">Contacto directo</p>
              </div>
              <button
                type="button"
                onClick={() => setInfoTarget(null)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-50"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
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
              className="mt-6 w-full rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-neutral-800"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
