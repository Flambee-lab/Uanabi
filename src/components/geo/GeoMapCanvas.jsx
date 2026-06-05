import { useState } from 'react'
import { Map } from 'lucide-react'
import { coordsToPercent, getPinLabel } from '../../utils/geoMap'

function PinLogo({ logo, name }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className="type-small font-bold">{name.charAt(0)}</span>
  return (
    <span className="brand-logo-surface h-5 w-5 rounded-md p-0.5">
      <img
        src={logo}
        alt=""
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  )
}

export default function GeoMapCanvas({
  brands,
  highlightedId,
  popoverBrandId,
  onPinClick,
  onApply,
}) {
  const popoverBrand = brands.find((b) => b.id === popoverBrandId)

  return (
    <div className="relative h-full w-full overflow-hidden bg-secondary">
      {/* Mapa estilizado AMBA (capa base) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#e8eef4] via-[#dce8f0] to-[#d4e4dc]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(200,220,200,0.4) 0%, transparent 45%),
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* Río / costanera sugerida */}
      <div
        className="absolute right-[8%] top-[15%] h-[70%] w-[12%] rounded-full bg-[#a8c8e8]/40 blur-sm"
        aria-hidden
      />

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 type-small font-semibold text-muted-foreground shadow-sm backdrop-blur-sm">
        <Map className="h-3.5 w-3.5" strokeWidth={1.75} />
        AMBA · Buenos Aires
      </div>

      {/* Pines */}
      {brands.map((brand) => {
        const pos = coordsToPercent(brand.coordinates)
        const isActive = brand.id === highlightedId || brand.id === popoverBrandId

        return (
          <button
            key={brand.id}
            type="button"
            style={{ left: pos.left, top: pos.top }}
            onClick={() => onPinClick(brand.id)}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border bg-white px-2.5 py-1 font-bold type-small text-foreground shadow-md transition-all hover:scale-105 ${
              isActive
                ? 'z-20 scale-110 border-primary ring-2 ring-primary/20'
                : 'border-border-subtle hover:border-border'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <PinLogo logo={brand.logo} name={brand.name} />
              {getPinLabel(brand.budgetType)}
            </span>
          </button>
        )
      })}

      {/* Popover inmersivo */}
      {popoverBrand && (
        <div
          className="absolute bottom-6 left-1/2 z-30 w-56 max-w-[90%] -translate-x-1/2 rounded-2xl border border-border-subtle bg-white p-4 shadow-xl sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <p className="font-display text-sm font-bold text-foreground">{popoverBrand.name}</p>
          <p className="mt-0.5 type-small text-muted-foreground">{popoverBrand.zone}</p>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {popoverBrand.offers?.[0]}
          </p>
          {popoverBrand.applicationStatus === 'disponible' ? (
            <button
              type="button"
              onClick={() => onApply?.(popoverBrand.id)}
              className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-bold text-white hover:bg-primary/90"
            >
              Postular mi Evento
            </button>
          ) : (
            <p className="mt-3 text-center text-xs font-medium text-muted-foreground">
              Postulación enviada
            </p>
          )}
        </div>
      )}

      {brands.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
            No hay marcas en esta zona
          </p>
        </div>
      )}
    </div>
  )
}
