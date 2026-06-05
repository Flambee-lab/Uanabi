import {
  Calendar,
  MapPin,
  Package,
  Sparkles,
  Users,
  UsersRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getEventFacts } from '../../utils/eventDetailFormat'

const FACT_ICONS = {
  type: Sparkles,
  attendees: Users,
  date: Calendar,
  location: MapPin,
  gender: UsersRound,
  exchange: Package,
}

function EventFactRow({ id, label, value }) {
  const Icon = FACT_ICONS[id] ?? Sparkles

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-card">
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="type-body font-semibold leading-snug text-foreground">{label}</p>
        <p className="type-small mt-0.5 text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}

export default function EventFactsSheet({ event, className }) {
  const facts = getEventFacts(event)

  const rows = [
    { id: 'type', label: 'Tipo', value: facts.type },
    { id: 'attendees', label: 'Asistentes', value: facts.attendees },
    { id: 'date', label: 'Fecha', value: facts.date },
    { id: 'location', label: 'Ubicación', value: facts.location },
    { id: 'gender', label: 'Género', value: facts.gender },
    { id: 'exchange', label: 'Intercambio', value: facts.exchange },
  ]

  return (
    <section className={cn(className)}>
      <p className="type-small font-medium text-muted-foreground">Resumen</p>
      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        {rows.map((row) => (
          <EventFactRow key={row.id} {...row} />
        ))}
      </div>
    </section>
  )
}
