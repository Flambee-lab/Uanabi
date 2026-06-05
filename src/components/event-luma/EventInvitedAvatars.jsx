import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { getInvitationStatusLabel } from '../../utils/eventSponsorMatch'

function SponsorAvatar({ brand, onSelect }) {
  const [failed, setFailed] = useState(false)
  const status = brand.invitationStatus
  const isMatch = status === 'match_aceptado'
  const label = getInvitationStatusLabel(status)

  const Wrapper = isMatch ? 'button' : 'div'

  return (
    <Wrapper
      type={isMatch ? 'button' : undefined}
      onClick={isMatch ? () => onSelect(brand) : undefined}
      className={`flex w-[96px] flex-col items-center gap-2 text-center ${
        isMatch ? 'cursor-pointer rounded-2xl p-1 transition hover:bg-secondary' : ''
      }`}
    >
      {failed ? (
        <div className="brand-logo-surface h-12 w-12 rounded-full border-2 border-white text-sm font-bold text-foreground/80 shadow-sm">
          {brand.name.charAt(0)}
        </div>
      ) : (
        <div
          className={`brand-logo-surface h-12 w-12 rounded-full border-2 border-white p-1.5 shadow-sm ${
            status === 'declinado' ? 'opacity-50 grayscale' : ''
          }`}
        >
          <img
            src={brand.logo}
            alt=""
            className="h-full w-full object-contain"
            onError={() => setFailed(true)}
          />
        </div>
      )}
      <span className="line-clamp-2 w-full type-small font-semibold leading-tight text-foreground">
        {brand.name}
      </span>
      <span
        className={`type-small font-medium ${
          isMatch
            ? 'text-match-foreground'
            : status === 'invitada'
              ? 'text-muted-foreground'
              : 'text-muted-foreground'
        }`}
      >
        {label}
      </span>
    </Wrapper>
  )
}

export default function EventInvitedAvatars({ sponsors, onOpenChat }) {
  const [chatTarget, setChatTarget] = useState(null)

  if (!sponsors.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-secondary/50 py-12 text-center text-sm text-muted-foreground">
        Todavía no invitaste sponsors a este evento.
      </p>
    )
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-6">
        {sponsors.map((sponsor) => (
          <SponsorAvatar
            key={sponsor.id}
            brand={sponsor}
            onSelect={(brand) => setChatTarget(brand)}
          />
        ))}
      </div>

      {chatTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-border-subtle bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="type-label ">
                  Match concretado
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  {chatTarget.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChatTarget(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              La negociación con este sponsor está lista para continuar por chat.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setChatTarget(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenChat?.(chatTarget.id)
                  setChatTarget(null)
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-match py-2.5 text-xs font-bold text-match-foreground transition hover:bg-[#e8ecd8]"
              >
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                Ir al chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
