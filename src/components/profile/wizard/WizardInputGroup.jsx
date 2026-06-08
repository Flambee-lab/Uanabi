import { cn } from '@/lib/utils'
import { FieldInput } from '@/components/ui/form-field'

export function WizardInputGroup({ icon: Icon, children, className }) {
  return (
    <div className={cn('relative', className)}>
      {Icon && (
        <Icon
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
        />
      )}
      {children}
    </div>
  )
}

export function WizardInput({ className, hasIcon = false, ...props }) {
  return (
    <FieldInput
      className={cn(
        'h-11 bg-card shadow-xs transition-shadow focus:shadow-sm',
        hasIcon && 'pl-11',
        className,
      )}
      {...props}
    />
  )
}
