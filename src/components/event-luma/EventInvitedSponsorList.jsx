import { useState } from 'react'
import { INVITATION_STATUS_LABELS } from '../../utils/eventSponsorMatch'

function SponsorLogo({ name, logo, muted }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-700 ${muted ? 'opacity-50' : ''}`}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <img
      src={logo}
      alt=""
      className={`h-11 w-11 shrink-0 rounded-full border border-neutral-100 object-cover ${muted ? 'opacity-50 grayscale' : ''}`}
      onError={() => setFailed(true)}
    />
  )
}

function statusLabel(status) {
  if (status === 'declinado') return 'Declinada'
  return INVITATION_STATUS_LABELS[status] ?? status
}

function statusStyles(status) {
  if (status === 'match_aceptado') return 'bg-[#f4f6e9] text-[#1d230d]'
  if (status === 'invitada') return 'bg-neutral-100 text-neutral-600'
  return 'bg-neutral-50 text-neutral-400'
}

export default function EventInvitedSponsorList({ sponsors }) {
  if (!sponsors.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-14 text-center">
        <p className="text-sm font-medium text-neutral-600">Ningún Uanabi en tu evento todavía</p>
        <p className="mt-1 text-xs text-neutral-400">
          Pasá a la pestaña Sugeridos para invitar partners a tu evento.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-100 bg-white">
      {sponsors.map((sponsor) => {
        const isMatch = sponsor.invitationStatus === 'match_aceptado'

        return (
          <li
            key={sponsor.id}
            className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-neutral-50/80"
          >
            <SponsorLogo
              name={sponsor.name}
              logo={sponsor.logo}
              muted={sponsor.invitationStatus === 'declinado'}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">{sponsor.name}</p>
              <p className="truncate text-xs text-neutral-500">{sponsor.industry}</p>
            </div>
            <span
              className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold sm:inline ${statusStyles(sponsor.invitationStatus)}`}
            >
              {statusLabel(sponsor.invitationStatus)}
            </span>
            {isMatch ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#f4f6e9] px-3 py-2 text-[11px] font-bold text-[#1d230d]">
                Match activo
              </span>
            ) : (
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold sm:hidden ${statusStyles(sponsor.invitationStatus)}`}
              >
                {statusLabel(sponsor.invitationStatus)}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
