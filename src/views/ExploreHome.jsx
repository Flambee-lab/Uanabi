import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import BrandDiscoverCard from '../components/explore/BrandDiscoverCard'
import ExploreSearchCapsule from '../components/explore/ExploreSearchCapsule'
import {
  filterExploreBrands,
  hasActiveExploreFilters,
  togglePill,
} from '../utils/exploreFilters'

export default function ExploreHome({ brands, onApply, onPropose, onOpenChat }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [rubros, setRubros] = useState([])
  const [formats, setFormats] = useState([])
  const [scales, setScales] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filterState = { searchQuery, rubros, formats, scales }
  const hasFilters = hasActiveExploreFilters(filterState)

  const filteredBrands = useMemo(
    () => filterExploreBrands(brands, filterState),
    [brands, searchQuery, rubros, formats, scales],
  )

  const pageTitle = useMemo(() => {
    if (searchQuery.trim()) return `Uanabis para "${searchQuery.trim()}"`
    if (rubros.length === 1) {
      const labels = {
        bebidas: 'Bebidas',
        tech: 'Tech & Gaming',
        moda: 'Moda & Diseño',
        gastro: 'Gastronomía',
        lifestyle: 'Estilo de Vida',
        belleza: 'Belleza',
      }
      return `Uanabis de ${labels[rubros[0]] ?? 'tu nicho'}`
    }
    return 'Uanabis en Capital Federal'
  }, [searchQuery, rubros])

  const resetFilters = () => {
    setSearchQuery('')
    setRubros([])
    setFormats([])
    setScales([])
  }

  return (
    <div className="min-h-full bg-white">
      <div className="border-b border-[#eef0f2] bg-white px-6 py-8 sm:px-10 sm:py-10">
        <ExploreSearchCapsule
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          rubros={rubros}
          onRubrosChange={(id) => setRubros((prev) => togglePill(prev, id))}
          formats={formats}
          onFormatsChange={(id) => setFormats((prev) => togglePill(prev, id))}
          scales={scales}
          onScalesChange={(id) => setScales((prev) => togglePill(prev, id))}
          isOpen={filtersOpen}
          onOpenChange={setFiltersOpen}
          onClear={() => {
            resetFilters()
            setFiltersOpen(false)
          }}
          hasActiveFilters={hasFilters}
        />
      </div>

      <div className="px-6 py-8 sm:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-[28px]">
              {pageTitle}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {filteredBrands.length} sponsor{filteredBrands.length !== 1 ? 's' : ''} en CABA
            </p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#6b7280] underline-offset-2 hover:text-[#111827] hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Restablecer
            </button>
          )}
        </div>

        {filteredBrands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#eef0f2] py-24 text-center">
            <p className="font-display text-base font-bold text-[#374151]">
              No hay Uanabis con estos filtros
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Probá otro rubro o ampliá la búsqueda en Capital Federal.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 text-sm font-semibold text-[#111827] hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBrands.map((brand) => (
              <BrandDiscoverCard
                key={brand.id}
                brand={brand}
                onApply={onApply}
                onPropose={onPropose}
                onOpenChat={onOpenChat}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
