import { ArrowUpRight, BadgeCheck, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  countPartnershipsInProfile,
  getHostPartnerships,
  splitEventsByTimeline,
} from '../../utils/hostEventBuckets'
import { computeHostStats } from '../../data/hostProfile'

export default function HostEventsProfileBridge({
  events,
  profile,
  catalog,
  className,
  onGoToProfile,
  onShowPartnerships,
}) {
  const { upcoming, past } = splitEventsByTimeline(events)
  const partnerships = getHostPartnerships(events, catalog)
  const stats = computeHostStats(events, profile)
  const inProfile = countPartnershipsInProfile(partnerships, profile?.successStories)

  return (
    <div
      className={cn(
        'uanabi-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="type-small font-semibold text-foreground">
          Tu actividad alimenta{' '}
          <span className="font-display">Mi Perfil</span>
        </p>
        <p className="type-small mt-1 max-w-xl leading-relaxed text-muted-foreground">
          Los patrocinios confirmados y tus eventos próximos son lo que las marcas ven cuando
          revisan tu perfil público.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-secondary/80 px-2.5 py-1 type-small font-semibold text-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-match-foreground" strokeWidth={2} />
            {partnerships.length} colaboración{partnerships.length !== 1 ? 'es' : ''}
          </span>
          <span className="rounded-full border border-border-subtle bg-secondary/80 px-2.5 py-1 type-small font-semibold text-muted-foreground">
            {upcoming.length} próximo{upcoming.length !== 1 ? 's' : ''}
          </span>
          <span className="rounded-full border border-border-subtle bg-secondary/80 px-2.5 py-1 type-small font-semibold text-muted-foreground">
            {past.length} pasado{past.length !== 1 ? 's' : ''}
          </span>
          <span className="rounded-full border border-border-subtle bg-secondary/80 px-2.5 py-1 type-small font-semibold text-muted-foreground">
            {stats.matches} match{stats.matches !== 1 ? 'es' : ''} activo
            {stats.matches === 1 ? '' : 's'}
          </span>
        </div>
        {partnerships.length > 0 && inProfile < partnerships.length && (
          <p className="type-small mt-2 text-muted-foreground">
            {inProfile === 0
              ? 'Ninguna colaboración publicada en tu portfolio todavía.'
              : `${inProfile} de ${partnerships.length} ya figuran en tu perfil.`}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {partnerships.length > 0 && (
          <button
            type="button"
            onClick={onShowPartnerships}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-subtle px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-selection"
          >
            Ver colaboraciones
          </button>
        )}
        <button
          type="button"
          onClick={onGoToProfile}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <User className="h-4 w-4" strokeWidth={2} />
          Ir a Mi Perfil
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
