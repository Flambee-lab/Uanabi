export default function ProfileViewToggle({ isPublicView, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-border">
      <span className={!isPublicView ? 'text-foreground' : 'text-muted-foreground'}>
        Vista privada
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isPublicView}
        onClick={() => onChange(!isPublicView)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          isPublicView ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            isPublicView ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </button>
      <span className={isPublicView ? 'text-foreground' : 'text-muted-foreground'}>
        Ver perfil público
      </span>
    </label>
  )
}
