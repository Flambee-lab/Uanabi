import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RotateCcw,
  Search,
} from 'lucide-react'
import BrandDiscoverCard from '../components/explore/BrandDiscoverCard'
import GeoSearch from './GeoSearch'
import { EXPLORE_CATEGORIES } from '../data/mockEvents'
import { CABA_SUGGESTIONS } from '../utils/geoMap'

const BUDGET_OPTIONS = [
  { id: 'all', label: 'Cualquier trato' },
  { id: 'canje', label: 'Canje' },
  { id: 'efectivo', label: 'Presupuesto efectivo' },
]

const STATUS_OPTIONS = [
  { id: 'all', label: 'Todas las marcas' },
  { id: 'disponible', label: 'Abiertas a postular' },
  { id: 'enviada', label: 'Ya postulaste' },
]

function matchesBudgetFilter(budgetType, filter) {
  if (filter === 'all') return true
  if (filter === 'canje') return budgetType === 'Canje' || budgetType === 'Híbrido'
  if (filter === 'efectivo') return budgetType === 'Presupuesto Efectivo' || budgetType === 'Híbrido'
  return true
}

function FilterDropdown({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-[#e5e7eb] bg-white py-2 pl-4 pr-9 text-sm font-medium text-[#374151] outline-none transition-colors hover:border-[#d1d5db] focus:border-[#111827]"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]"
        strokeWidth={1.75}
      />
    </div>
  )
}

function CategoryScroller({ selected, onSelect }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  return (
    <div className="relative border-b border-[#eef0f2]">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth px-1 pb-0 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {EXPLORE_CATEGORIES.map((cat) => {
          const isActive = cat.id === 'all' ? selected === 'all' : selected === cat.id

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className="group flex shrink-0 flex-col items-center gap-2 pb-4 pt-1"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-lg transition-transform group-hover:scale-105 ${cat.color} ${isActive ? 'ring-2 ring-[#111827] ring-offset-2' : ''}`}
              >
                {cat.icon}
              </div>
              <span
                className={`whitespace-nowrap text-sm font-semibold ${
                  isActive ? 'text-[#111827]' : 'text-[#6b7280]'
                }`}
              >
                {cat.label}
              </span>
              <span
                className={`h-0.5 w-full rounded-full transition-colors ${
                  isActive ? 'bg-[#111827]' : 'bg-transparent'
                }`}
              />
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute right-0 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white shadow-md transition-transform hover:scale-105"
        aria-label="Ver más categorías"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#eef0f2] bg-white text-[#111827] shadow-sm transition-transform hover:scale-105"
        aria-label="Categorías anteriores"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}

export default function ExploreHome({ brands, onApply, onOpenChat, onGeoModeChange }) {
  const [viewMode, setViewMode] = useState('browse')
  const [searchWhat, setSearchWhat] = useState('')
  const [searchWhere, setSearchWhere] = useState('Buenos Aires')
  const [locationFocused, setLocationFocused] = useState(false)
  const [category, setCategory] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    onGeoModeChange?.(viewMode === 'geo')
  }, [viewMode, onGeoModeChange])

  const locationSuggestions = useMemo(() => {
    const q = searchWhere.toLowerCase().trim()
    if (!q) return CABA_SUGGESTIONS.slice(0, 5)
    return CABA_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 6)
  }, [searchWhere])

  const hasFilters =
    category !== 'all' ||
    budgetFilter !== 'all' ||
    statusFilter !== 'all' ||
    searchWhat.trim() !== ''

  const filteredBrands = useMemo(() => {
    let list = brands

    if (category !== 'all') {
      list = list.filter((b) => b.industry === category)
    }

    list = list.filter((b) => matchesBudgetFilter(b.budgetType, budgetFilter))

    if (statusFilter !== 'all') {
      list = list.filter((b) => b.applicationStatus === statusFilter)
    }

    if (searchWhat.trim()) {
      const q = searchWhat.toLowerCase()
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.industry.toLowerCase().includes(q) ||
          b.seeks.some((s) => s.toLowerCase().includes(q)) ||
          b.offers.some((o) => o.toLowerCase().includes(q)),
      )
    }

    return list
  }, [brands, category, budgetFilter, statusFilter, searchWhat])

  const pageTitle = useMemo(() => {
    if (searchWhat.trim()) return `Marcas para "${searchWhat.trim()}"`
    if (category !== 'all') {
      const cat = EXPLORE_CATEGORIES.find((c) => c.id === category)
      return `Marcas de ${cat?.label ?? category}`
    }
    return `Marcas activas en ${searchWhere || 'Buenos Aires'}`
  }, [searchWhat, category, searchWhere])

  const resetFilters = () => {
    setSearchWhat('')
    setCategory('all')
    setBudgetFilter('all')
    setStatusFilter('all')
  }

  const handleLocationSearch = () => {
    if (!searchWhere.trim()) return
    setViewMode('geo')
    setLocationFocused(false)
  }

  const handleLocationKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLocationSearch()
    }
  }

  if (viewMode === 'geo') {
    return (
      <GeoSearch
        brands={brands}
        onApply={onApply}
        onBack={() => setViewMode('browse')}
        locationQuery={searchWhere}
        zonePresetId="caba"
        locationLabel={searchWhere.trim() || 'Capital Federal'}
      />
    )
  }

  return (
    <div className="min-h-full bg-white">
      <div className="border-b border-[#eef0f2] bg-white px-6 py-5 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-stretch overflow-hidden rounded-full border border-[#e5e7eb] bg-white shadow-sm transition-shadow focus-within:border-[#111827] focus-within:shadow-md">
            <div className="flex min-w-0 flex-1 flex-col justify-center border-r border-[#eef0f2] px-4 py-2.5 sm:px-5 sm:py-3">
              <label
                htmlFor="search-what"
                className="text-[10px] font-bold uppercase tracking-wider text-[#111827]"
              >
                Marca o nicho
              </label>
              <input
                id="search-what"
                type="text"
                value={searchWhat}
                onChange={(e) => setSearchWhat(e.target.value)}
                placeholder="Ej: bebidas, gaming, moda..."
                className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none"
              />
            </div>

            <div className="relative flex min-w-0 flex-1 flex-col justify-center px-4 py-2.5 sm:px-5 sm:py-3">
              <label
                htmlFor="search-where"
                className="text-[10px] font-bold uppercase tracking-wider text-[#111827]"
              >
                Ubicación
              </label>
              <input
                id="search-where"
                type="text"
                value={searchWhere}
                onChange={(e) => setSearchWhere(e.target.value)}
                onFocus={() => setLocationFocused(true)}
                onBlur={() => setTimeout(() => setLocationFocused(false), 150)}
                onKeyDown={handleLocationKeyDown}
                placeholder="Buenos Aires, Palermo..."
                className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none"
                autoComplete="off"
              />

              {locationFocused && locationSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[#eef0f2] bg-white py-1 shadow-lg">
                  {locationSuggestions.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#374151] hover:bg-[#f9fafb]"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setSearchWhere(suggestion)
                        }}
                      >
                        <MapPin className="h-3.5 w-3.5 text-[#9ca3af]" strokeWidth={1.75} />
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={handleLocationSearch}
              disabled={!searchWhere.trim()}
              className="m-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-40 sm:m-2 sm:h-12 sm:w-12"
              aria-label="Buscar por ubicación en Capital Federal"
              title="Ver mapa en Capital Federal"
            >
              <Search className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 sm:px-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-[28px]">
            {pageTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#6b7280] underline-offset-2 hover:text-[#111827] hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                Restablecer
              </button>
            )}
            <FilterDropdown
              label="Tipo de trato"
              value={budgetFilter}
              options={BUDGET_OPTIONS}
              onChange={setBudgetFilter}
            />
            <FilterDropdown
              label="Estado"
              value={statusFilter}
              options={STATUS_OPTIONS}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        <CategoryScroller selected={category} onSelect={setCategory} />

        <div className="mt-8">
          {filteredBrands.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#eef0f2] py-24 text-center">
              <p className="font-display text-base font-bold text-[#374151]">
                No hay marcas con estos filtros
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-sm font-semibold text-[#111827] hover:underline"
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
                  onOpenChat={onOpenChat}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
