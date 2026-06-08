import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'

export function FieldLabel({ className, children, htmlFor, ...props }) {
  return (
    <label htmlFor={htmlFor} className={cn('type-label mb-2 block', className)} {...props}>
      {children}
    </label>
  )
}

export function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  className,
  children,
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <FieldLabel htmlFor={id} className="mb-0">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      {hint && <p className="type-small -mt-0.5 text-muted-foreground">{hint}</p>}
      {children}
      {error && <p className="type-small font-medium text-destructive">{error}</p>}
    </div>
  )
}

export function FieldInput({ className, ...props }) {
  return (
    <Input
      className={cn('type-body rounded-2xl border-border bg-background', className)}
      {...props}
    />
  )
}

export function FieldTextarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'type-body min-h-[100px] w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/40',
        className,
      )}
      {...props}
    />
  )
}

/** @deprecated Usar FieldLabel + FieldInput */
export const INPUT_CLASS =
  'type-body w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/40'

/** @deprecated Usar FieldLabel */
export const LABEL_CLASS = 'type-label mb-2 block'
