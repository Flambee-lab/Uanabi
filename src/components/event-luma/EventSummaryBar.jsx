export default function EventSummaryBar({ event, onEdit }) {
  const locationLine = event.venueAddress ?? event.location
  const dateLine = [event.date, event.time].filter(Boolean).join(' · ')

  return (
    <div className="mb-6 flex w-full items-center justify-between rounded-2xl border border-border-subtle bg-secondary p-4">
      <div className="min-w-0 pr-4">
        <h1 className="text-sm font-bold text-foreground">{event.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {dateLine}
          {dateLine && locationLine ? ' · ' : ''}
          {locationLine}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-xs font-semibold text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline"
      >
        Editar información
      </button>
    </div>
  )
}
