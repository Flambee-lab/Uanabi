import { cn } from '@/lib/utils'

export default function EventAboutSection({ event, className }) {
  const text = event?.description?.trim()
  if (!text) return null

  return (
    <section className={cn(className)}>
      <h2 className="type-heading font-display font-bold text-foreground">Sobre el evento</h2>
      <p className="type-body mt-3 max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">
        {text}
      </p>
      {(event?.matchIndustries?.length ?? 0) > 0 && (
        <p className="type-small mt-4 text-muted-foreground">
          <span className="font-semibold text-foreground">Rubros del evento:</span>{' '}
          {event.matchIndustries.join(' · ')}
        </p>
      )}
    </section>
  )
}
