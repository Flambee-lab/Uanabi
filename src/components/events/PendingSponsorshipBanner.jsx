export default function PendingSponsorshipBanner({ count, onCloseCase }) {
  if (count < 1) return null

  const label =
    count === 1
      ? 'Tienes 1 patrocinio pendiente de cierre para validar tus marcas'
      : `Tienes ${count} patrocinios pendientes de cierre para validar tus marcas`

  return (
    <div className="animate-pulse-once mb-6 flex w-full flex-col gap-4 rounded-2xl bg-neutral-900 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <p className="text-sm font-medium leading-relaxed">{label}</p>
      <button
        type="button"
        onClick={onCloseCase}
        className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-neutral-900 transition hover:bg-neutral-100"
      >
        Cerrar Caso
      </button>
    </div>
  )
}
