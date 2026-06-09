import { useEffect, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import BrandDiscoverCard from '../components/explore/BrandDiscoverCard'
import ExploreSearchCapsule from '../components/explore/ExploreSearchCapsule'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  filterExploreBrands,
  hasActiveExploreFilters,
} from '../utils/exploreFilters'
import { exploreSearchDockProgress } from '../utils/exploreScrollDock'
import BrandPublicView from './BrandPublicView'

export default function ExploreHome({
  brands,
  hostEvents = [],
  onRequestPartnership,
  scrollRootRef,
  onSearchDockProgress,
  searchQuery: searchQueryProp,
  onSearchChange: onSearchChangeProp,
  selectedRubro: selectedRubroProp,
  onSelectRubro: onSelectRubroProp,
}) {
  const [searchQueryLocal, setSearchQueryLocal] = useState('')
  const [rubrosLocal, setRubrosLocal] = useState([])
  const [selectedBrandId, setSelectedBrandId] = useState(null)
  const [dockProgress, setDockProgress] = useState(0)

  const searchQuery = searchQueryProp ?? searchQueryLocal
  const setSearchQuery = onSearchChangeProp ?? setSearchQueryLocal
  const rubros =
    selectedRubroProp !== undefined
      ? selectedRubroProp
        ? [selectedRubroProp]
        : []
      : rubrosLocal
  const setRubros = (next) => {
    if (onSelectRubroProp) {
      onSelectRubroProp(next[0] ?? null)
    } else {
      setRubrosLocal(next)
    }
  }

  const filterState = { searchQuery, rubros }
  const hasFilters = hasActiveExploreFilters(filterState)

  const filteredBrands = useMemo(
    () => filterExploreBrands(brands, filterState),
    [brands, searchQuery, rubros],
  )

  const selectedRubro = rubros.length === 1 ? rubros[0] : null

  useEffect(() => {
    const root = scrollRootRef?.current
    if (!root || !onSearchDockProgress) return undefined

    const update = () => {
      const progress = exploreSearchDockProgress(root.scrollTop)
      setDockProgress(progress)
      onSearchDockProgress?.(progress)
    }

    update()
    root.addEventListener('scroll', update, { passive: true })
    return () => root.removeEventListener('scroll', update)
  }, [scrollRootRef, onSearchDockProgress])

  useEffect(() => {
    if (selectedBrandId) {
      setDockProgress(0)
      onSearchDockProgress?.(0)
    }
  }, [selectedBrandId, onSearchDockProgress])

  const resetFilters = () => {
    setSearchQuery('')
    setRubros([])
  }

  const handleRubroSelect = (rubroId) => {
    setRubros(rubroId ? [rubroId] : [])
  }

  const selectedBrand = selectedBrandId
    ? brands.find((b) => b.id === selectedBrandId)
    : null

  if (selectedBrand) {
    return (
      <BrandPublicView
        brand={selectedBrand}
        hostEvents={hostEvents}
        relatedBrands={filteredBrands}
        onSelectBrand={setSelectedBrandId}
        onBack={() => setSelectedBrandId(null)}
        onRequestPartnership={onRequestPartnership}
      />
    )
  }

  return (
    <div className="uanabi-page uanabi-page--glow">
      <div className="uanabi-page-hero px-6 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-10">
        <div className="mx-auto mb-8 w-full max-w-4xl text-center sm:mb-10">
          <h1 className="type-display">Encontrá un sponsor para tu próximo evento.</h1>
          <p className="mx-auto mt-2 max-w-xl type-body-muted">
            Estas son las marcas que quieren estar con vos en tu próximo evento.
          </p>
        </div>
        <div
          className={cn(
            'transition-[opacity,transform] duration-150 ease-out will-change-[opacity,transform]',
          )}
          style={{
            opacity: 1 - dockProgress,
            transform: `scale(${1 - dockProgress * 0.06})`,
            transformOrigin: 'center center',
            pointerEvents: dockProgress > 0.92 ? 'none' : 'auto',
          }}
        >
          <ExploreSearchCapsule
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRubro={selectedRubro}
            onSelectRubro={handleRubroSelect}
          />
        </div>
      </div>

      <div className="uanabi-section px-6 pt-5 pb-10 sm:px-10 sm:pt-6 sm:pb-12">
        {hasFilters && (
          <div className="mb-5 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={resetFilters}
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Restablecer
            </Button>
          </div>
        )}

        {filteredBrands.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-border bg-transparent py-28 text-center shadow-none">
            <CardContent className="px-8">
              <p className="type-heading">No hay Uanabis con estos filtros</p>
              <p className="uanabi-meta mt-2">
                Probá otra categoría o ampliá la búsqueda en Capital Federal.
              </p>
              <Button type="button" variant="primary" size="lg" className="mt-6" onClick={resetFilters}>
                Restablecer filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="uanabi-brand-grid">
            {filteredBrands.map((brand) => (
              <BrandDiscoverCard
                key={brand.id}
                brand={brand}
                onSelect={setSelectedBrandId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
