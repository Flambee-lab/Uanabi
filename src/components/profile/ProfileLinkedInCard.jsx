import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProfileSectionEditButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground"
    >
      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  )
}

export default function ProfileLinkedInCard({
  title,
  onEdit,
  editLabel,
  children,
  className,
  bodyClassName,
}) {
  return (
    <section className={cn('uanabi-panel overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
        <h2 className="type-heading">{title}</h2>
        {onEdit && (
          <ProfileSectionEditButton
            onClick={onEdit}
            label={editLabel ?? `Editar ${title}`}
          />
        )}
      </div>
      <div className={cn('px-5 pb-6 pt-0 sm:px-6', bodyClassName)}>{children}</div>
    </section>
  )
}
