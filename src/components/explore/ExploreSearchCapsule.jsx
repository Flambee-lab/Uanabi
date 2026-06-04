import { useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import {
  EXPLORE_FORMATS,
  EXPLORE_RUBROS,
  EXPLORE_SCALES,
} from '../../utils/exploreFilters'

function FilterSection({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterPill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
        selected
          ? 'border-neutral-900 bg-neutral-900 font-medium text-white'
          : 'border-neutral-200 text-neutral-600 hover:border-neutral-900'
      }`}
    >
      {label}
    </button>
  )
}

export default function ExploreSearchCapsule({
  searchQuery,
  onSearchChange,
  rubros,
  onRubrosChange,
  formats,
  onFormatsChange,
  scales,
  onScalesChange,
  isOpen,
  onOpenChange,
  onClear,
  hasActiveFilters,
}) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        onOpenChange(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') onOpenChange(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onOpenChange])

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-xl">
      <p className="mb-3 text-center text-[11px] font-medium text-neutral-500">
        📍 Buscando sponsors en CABA — Próximamente más ubicaciones
      </p>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => onOpenChange(true)}
          onClick={() => onOpenChange(true)}
          placeholder="Buscar Uanabis por nombre, rubro o tipo de aporte..."
          className="block w-full rounded-full border border-neutral-200 bg-white py-3 pl-12 pr-6 text-xs text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:shadow-md"
          aria-expanded={isOpen}
          aria-controls="explore-filter-panel"
        />
      </div>

      {isOpen && (
        <div
          id="explore-filter-panel"
          className="absolute left-0 right-0 z-50 mt-2 space-y-5 rounded-3xl border border-neutral-100 bg-white p-6 shadow-xl"
        >
          <FilterSection title="Rubros">
            {EXPLORE_RUBROS.map((r) => (
              <FilterPill
                key={r.id}
                label={r.label}
                selected={rubros.includes(r.id)}
                onClick={() => onRubrosChange(r.id)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Formato de Sponsor">
            {EXPLORE_FORMATS.map((f) => (
              <FilterPill
                key={f.id}
                label={f.label}
                selected={formats.includes(f.id)}
                onClick={() => onFormatsChange(f.id)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Escala">
            {EXPLORE_SCALES.map((s) => (
              <FilterPill
                key={s.id}
                label={s.label}
                selected={scales.includes(s.id)}
                onClick={() => onScalesChange(s.id)}
              />
            ))}
          </FilterSection>

          {hasActiveFilters && (
            <div className="flex justify-end border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-semibold text-neutral-500 transition hover:text-neutral-900"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
