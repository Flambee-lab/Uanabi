import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import GeoBrandCard from '../components/geo/GeoBrandCard'
import GeoMapCanvas from '../components/geo/GeoMapCanvas'
import { filterBrandsByGeo } from '../utils/geoMap'

export default function GeoSearch({
  brands,
  onApply,
  onBack,
  locationQuery: controlledQuery = '',
  zonePresetId = 'caba',
  locationLabel = 'Capital Federal',
}) {
  const [searchQuery, setSearchQuery] = useState(controlledQuery)
  const [highlightedId, setHighlightedId] = useState(null)
  const [popoverId, setPopoverId] = useState(null)
  const cardRefs = useRef({})

  useEffect(() => {
    setSearchQuery(controlledQuery)
  }, [controlledQuery])

  const filteredBrands = useMemo(
    () => filterBrandsByGeo(brands, { searchQuery, zonePresetId }),
    [brands, searchQuery, zonePresetId],
  )

  useEffect(() => {
    if (highlightedId && !filteredBrands.find((b) => b.id === highlightedId)) {
      setHighlightedId(filteredBrands[0]?.id ?? null)
      setPopoverId(null)
    }
  }, [filteredBrands, highlightedId])

  useEffect(() => {
    if (highlightedId && cardRefs.current[highlightedId]) {
      cardRefs.current[highlightedId].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [highlightedId])

  const handlePinClick = (brandId) => {
    setHighlightedId(brandId)
    setPopoverId((prev) => (prev === brandId ? null : brandId))
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex h-full w-full flex-col border-r border-neutral-100 md:w-[35%]">
          <div className="shrink-0 space-y-3 border-b border-neutral-100 bg-white p-4 sm:p-6">
            <div className="flex items-start gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-0.5 rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                  aria-label="Volver al inicio"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                </button>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-lg font-extrabold tracking-tight text-neutral-900 sm:text-xl">
                  Sponsors en {locationLabel}
                </h1>
                <p className="mt-1 text-xs text-neutral-500">
                  Resultados delimitados a Capital Federal
                  {searchQuery.trim() ? ` · "${searchQuery.trim()}"` : ''}
                </p>
              </div>
            </div>

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por barrio en CABA..."
                className="w-full rounded-full border border-neutral-200 py-2.5 pl-10 pr-4 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <p className="text-[11px] font-medium text-neutral-400">
              {filteredBrands.length} marca{filteredBrands.length !== 1 ? 's' : ''} en el mapa
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {filteredBrands.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
                <p className="text-sm font-medium text-neutral-500">Sin marcas en esta zona</p>
                <p className="mt-1 text-xs text-neutral-400">Probá otro barrio dentro de CABA</p>
              </div>
            ) : (
              filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  ref={(el) => {
                    cardRefs.current[brand.id] = el
                  }}
                >
                  <GeoBrandCard
                    brand={brand}
                    isHighlighted={brand.id === highlightedId}
                    onSelect={(id) => {
                      setHighlightedId(id)
                      setPopoverId(null)
                    }}
                    onApply={onApply}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="relative hidden min-h-0 flex-1 bg-neutral-50 md:block">
          <GeoMapCanvas
            brands={filteredBrands}
            highlightedId={highlightedId}
            popoverBrandId={popoverId}
            onPinClick={handlePinClick}
            onApply={onApply}
          />
        </div>
      </div>

      <div className="relative h-56 shrink-0 border-t border-neutral-100 md:hidden">
        <GeoMapCanvas
          brands={filteredBrands}
          highlightedId={highlightedId}
          popoverBrandId={popoverId}
          onPinClick={handlePinClick}
          onApply={onApply}
        />
      </div>
    </div>
  )
}
