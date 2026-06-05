import { ArrowUpRight, Calendar, User } from 'lucide-react'
import BrandLogo from '../BrandLogo'
import { countPartnershipsInProfile } from '../../utils/hostEventBuckets'

function PartnershipCard({ item, publishedInProfile, onSelectEvent, onGoToProfile }) {
  return (
    <article className="uanabi-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <BrandLogo name={item.brandName} logo={item.brandLogo} size="sm" />
        <div className="min-w-0">
          <p className="type-body font-semibold text-foreground">{item.brandName}</p>
          <p className="type-small mt-0.5 text-muted-foreground">
            {item.brandIndustry ?? 'Patrocinio'} · {item.statusLabel}
          </p>
          <p className="type-small mt-2 flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{item.eventTitle}</span>
          </p>
          {publishedInProfile && (
            <span className="mt-2 inline-flex rounded-full bg-match px-2 py-0.5 type-small font-semibold text-match-foreground">
              Visible en Mi Perfil
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectEvent?.(item.eventId)}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-border-subtle px-3 text-xs font-semibold text-foreground hover:bg-selection"
        >
          Ver evento
        </button>
        {!publishedInProfile && (
          <button
            type="button"
            onClick={onGoToProfile}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Publicar en perfil
            <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
          </button>
        )}
      </div>
    </article>
  )
}

export default function HostPartnershipsView({
  partnerships,
  profile,
  onGoToProfile,
  onSelectEvent,
}) {
  const inProfileCount = countPartnershipsInProfile(partnerships, profile?.successStories)
  const publishedBrands = new Set(
    (profile?.successStories ?? []).flatMap((s) =>
      (s.brandNames ?? []).map((n) => n.toLowerCase()),
    ),
  )

  if (partnerships.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
        <p className="type-heading font-display font-bold text-foreground">
          Todavía no tenés colaboraciones confirmadas
        </p>
        <p className="type-body-muted mx-auto mt-2 max-w-md">
          Cuando una marca acepte tu propuesta, el patrocinio aparecerá acá y podrás sumarlo a
          tu portfolio en Mi Perfil.
        </p>
        <button
          type="button"
          onClick={onGoToProfile}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-foreground hover:bg-selection"
        >
          <User className="h-4 w-4" strokeWidth={2} />
          Preparar Mi Perfil
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-6 sm:px-8">
      <p className="type-small text-muted-foreground">
        {inProfileCount} de {partnerships.length} publicadas en Mi Perfil
      </p>

      <div className="mt-4 space-y-3">
        {partnerships.map((item) => (
          <PartnershipCard
            key={item.id}
            item={item}
            publishedInProfile={publishedBrands.has(item.brandName.toLowerCase())}
            onSelectEvent={onSelectEvent}
            onGoToProfile={onGoToProfile}
          />
        ))}
      </div>
    </div>
  )
}
