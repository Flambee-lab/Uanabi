import { ArrowUpRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RecommendedBrandsTagLegend({ className }) {
  return (
    <div
      className={cn(
        'uanabi-sponsor-stroke flex gap-2.5 rounded-xl bg-secondary/25 px-3 py-2.5',
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
      <p className="type-small leading-relaxed text-muted-foreground">
        Cada etiqueta es un criterio que la marca declara buscar. Las marcadas con{' '}
        <ArrowUpRight
          className="inline h-3.5 w-3.5 align-[-2px] text-emerald-600"
          strokeWidth={2.5}
          aria-hidden
        />{' '}
        <span className="font-medium text-foreground">encajan con tu evento</span> (tipo, audiencia,
        zona o formato). Las grises son criterios de la marca que no detectamos en tu ficha.
      </p>
    </div>
  )
}
