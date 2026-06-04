export default function ProfileViewToggle({ isPublicView, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 shadow-sm transition hover:border-neutral-300">
      <span className={!isPublicView ? 'text-neutral-900' : 'text-neutral-400'}>
        Vista privada
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isPublicView}
        onClick={() => onChange(!isPublicView)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          isPublicView ? 'bg-neutral-900' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            isPublicView ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </button>
      <span className={isPublicView ? 'text-neutral-900' : 'text-neutral-400'}>
        Ver perfil público
      </span>
    </label>
  )
}
