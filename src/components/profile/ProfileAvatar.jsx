import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

const SIZES = {
  md: {
    box: 'h-28 w-28 sm:h-32 sm:w-32',
    initial: 'text-4xl',
  },
  sm: {
    box: 'h-24 w-24',
    initial: 'text-2xl',
  },
}

export default function ProfileAvatar({
  src,
  initial,
  size = 'md',
  onEdit,
  editLabel = 'Editar foto de perfil',
  editIcon: EditIcon = Pencil,
  className,
}) {
  const s = SIZES[size]

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt=""
          className={cn(
            s.box,
            'rounded-full border border-border-subtle object-cover shadow-sm',
          )}
        />
      ) : (
        <div
          className={cn(
            s.box,
            'flex items-center justify-center rounded-full border border-border-subtle bg-foreground font-display font-extrabold text-background shadow-sm',
            s.initial,
          )}
        >
          {initial}
        </div>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-card text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground"
        >
          <EditIcon className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
