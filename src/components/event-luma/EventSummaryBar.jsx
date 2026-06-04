export default function EventSummaryBar({ event, onEdit }) {
  const locationLine = event.venueAddress ?? event.location
  const dateLine = [event.date, event.time].filter(Boolean).join(' · ')

  return (
    <div className="mb-6 flex w-full items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
      <div className="min-w-0 pr-4">
        <h1 className="text-sm font-bold text-neutral-900">{event.title}</h1>
        <p className="mt-1 text-xs text-neutral-500">
          {dateLine}
          {dateLine && locationLine ? ' · ' : ''}
          {locationLine}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-xs font-semibold text-neutral-600 underline-offset-2 transition hover:text-neutral-900 hover:underline"
      >
        Editar información
      </button>
    </div>
  )
}
