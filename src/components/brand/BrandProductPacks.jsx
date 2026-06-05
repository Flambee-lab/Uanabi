import { cn } from '@/lib/utils'
import { getBrandProductPacks } from '../../data/brandProfileExtras'
import BrandProfileInset from './BrandProfileInset'

function ProductPackCard({ pack, isOverflow }) {
  return (
    <div
      className={cn(
        'relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-neutral-300 bg-card',
        'aspect-[3/4] max-w-[132px]',
      )}
      title={pack.fullName ?? pack.name}
    >
      <div className="flex flex-1 items-center justify-center bg-white p-3">
        {pack.image ? (
          <img
            src={pack.image}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br font-display text-xs font-bold text-foreground/50',
              pack.swatch,
            )}
          >
            {pack.label}
          </div>
        )}
      </div>
      <p className="border-t border-border-subtle bg-card px-2 py-2.5 text-center type-small font-medium text-muted-foreground">
        <span className="line-clamp-2 leading-snug">{pack.name}</span>
      </p>
      {isOverflow && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
          <span className="font-display text-xl font-bold text-white">
            {pack.overflowLabel}
          </span>
        </div>
      )}
    </div>
  )
}

export default function BrandProductPacks({ brand }) {
  const { visible, overflowCount } = getBrandProductPacks(brand)

  if (visible.length === 0) return null

  return (
    <BrandProfileInset>
      <p className="type-heading font-display font-bold text-foreground">
        Qué podría ofrecer para tu evento
      </p>
      <p className="type-small mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        Producto en canje según el alcance de tu evento. Estos son algunos packs que
        la marca suele poner a disposición de los hosts.
      </p>
      <div className="mt-4 flex gap-2 sm:gap-3">
        {visible.map((pack) => (
          <ProductPackCard
            key={pack.id}
            pack={pack}
            isOverflow={Boolean(pack.overflowLabel)}
          />
        ))}
      </div>
      {overflowCount > 0 && !visible.some((p) => p.overflowLabel) && (
        <p className="type-small mt-2 text-muted-foreground">
          +{overflowCount} packs más
        </p>
      )}
    </BrandProfileInset>
  )
}
