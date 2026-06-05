import { cn } from '@/lib/utils'

/** Misma superficie que las Cards del perfil de marca (Marcas → detalle). */
export const UANABI_PROFILE_CARD_CLASS =
  'overflow-hidden rounded-2xl border-border-subtle shadow-none'

/** Contenedor de portada compacta del perfil de marca. */
export const UANABI_PROFILE_COVER_CLASS =
  'relative aspect-[2.4/1] max-h-28 w-full overflow-hidden bg-muted sm:max-h-32'

export function UanabiProfilePage({ children, className, innerClassName }) {
  return (
    <div className={cn('uanabi-page min-h-full', className)}>
      <div
        className={cn(
          'mx-auto max-w-6xl space-y-8 px-6 pb-8 pt-4 sm:px-10 sm:pb-10 sm:pt-5',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
