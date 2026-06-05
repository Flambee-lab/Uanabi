import { cn } from '@/lib/utils'

/** Cajita sutil para bloques del perfil de marca (busca / aporta). */
export default function BrandProfileInset({ children, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border-subtle bg-secondary/40 px-5 py-5 sm:px-6 sm:py-6',
        className,
      )}
    >
      {children}
    </div>
  )
}
