import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  EXPLORE_CATEGORY_OPTIONS,
  getExploreCategoryLabel,
} from '../../utils/exploreFilters'
import {
  EXPLORE_CATEGORY_ICONS,
  EXPLORE_CATEGORY_ICON_TONES,
} from './exploreCategoryIcons'

const EXPLORE_LOCATIONS = [
  { id: 'caba', label: 'Capital Federal', available: true },
  { id: 'more', label: 'Más zonas', available: false },
]

function SearchSegment({ active, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'uanabi-search-segment h-full px-4 py-2 sm:px-5',
        active && 'uanabi-search-segment-active',
        className,
      )}
      {...props}
    />
  )
}

function SegmentLabel({ children }) {
  return <span className="uanabi-search-segment-label">{children}</span>
}

function SegmentValue({ className, children }) {
  return (
    <span
      className={cn(
        'uanabi-search-segment-value flex items-center gap-1 truncate',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default function ExploreSearchCapsule({
  searchQuery,
  onSearchChange,
  selectedRubro,
  onSelectRubro,
  variant = 'hero',
  className,
}) {
  const isCompact = variant === 'compact'
  const rootRef = useRef(null)
  const [locationOpen, setLocationOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [brandFocused, setBrandFocused] = useState(false)
  const selectedLocation = EXPLORE_LOCATIONS[0]
  const categoryLabel = getExploreCategoryLabel(selectedRubro)
  const panelOpen = locationOpen || categoryOpen

  useEffect(() => {
    if (!panelOpen) return

    const handlePointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setLocationOpen(false)
        setCategoryOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setLocationOpen(false)
        setCategoryOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [panelOpen])

  const closePanels = () => {
    setLocationOpen(false)
    setCategoryOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative mx-auto w-full', isCompact ? 'max-w-none' : 'max-w-4xl', className)}
    >
      <div
        className={cn(
          'uanabi-search-bar hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]',
          isCompact ? 'uanabi-search-bar-compact' : 'h-[4.25rem]',
          panelOpen && 'uanabi-search-bar-open',
        )}
      >
        {/* Ubicación */}
        <div className="relative shrink-0">
          <SearchSegment
            active={locationOpen}
            className={cn(
              'uanabi-search-segment-first',
              isCompact ? 'min-w-[5.5rem] sm:min-w-[6.5rem]' : 'min-w-[6.5rem] sm:min-w-[9.5rem]',
            )}
            onClick={() => {
              setLocationOpen((o) => !o)
              setCategoryOpen(false)
            }}
            aria-expanded={locationOpen}
            aria-haspopup="listbox"
            aria-controls="explore-location-menu"
          >
            <SegmentLabel>Ubicación</SegmentLabel>
            <SegmentValue>
              {selectedLocation.label}
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                  locationOpen && 'rotate-180 text-foreground/70',
                )}
                strokeWidth={2}
              />
            </SegmentValue>
          </SearchSegment>

          {locationOpen && (
            <Card
              id="explore-location-menu"
              role="listbox"
              className="absolute top-[calc(100%+0.65rem)] left-0 z-50 min-w-[15rem] gap-0 overflow-hidden rounded-2xl border-border-subtle py-1.5 shadow-xl ring-0"
            >
              <CardContent className="p-1.5">
                {EXPLORE_LOCATIONS.map((option) => (
                  <div
                    key={option.id}
                    role="option"
                    aria-selected={option.available}
                    aria-disabled={!option.available}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm',
                      option.available
                        ? 'uanabi-menu-item-active'
                        : 'text-muted-foreground',
                    )}
                  >
                    <span>{option.label}</span>
                    {!option.available && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full border-0 bg-sky-100 px-2 py-0.5 text-[0.625rem] font-semibold text-sky-700"
                      >
                        Próximamente
                      </Badge>
                    )}
                  </div>
                ))}
                <p className="px-3 pb-2 pt-1 text-xs leading-relaxed text-muted-foreground">
                  Estamos sumando más zonas del AMBA.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="my-3 w-px shrink-0 bg-border" aria-hidden />

        {/* Categoría */}
        <div
          className={cn(
            'relative min-w-0 shrink-0',
            isCompact ? 'sm:min-w-[6.5rem]' : 'sm:min-w-[8.5rem]',
          )}
        >
          <SearchSegment
            active={categoryOpen}
            className="w-full min-w-[5.5rem]"
            onClick={() => {
              setCategoryOpen((o) => !o)
              setLocationOpen(false)
            }}
            aria-expanded={categoryOpen}
            aria-haspopup="listbox"
            aria-controls="explore-category-menu"
          >
            <SegmentLabel>Categoría</SegmentLabel>
            <SegmentValue>
              <span className="truncate">{categoryLabel}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                  categoryOpen && 'rotate-180 text-foreground/70',
                )}
                strokeWidth={2}
              />
            </SegmentValue>
          </SearchSegment>

          {categoryOpen && (
            <Card
              id="explore-category-menu"
              role="listbox"
              className="absolute top-[calc(100%+0.65rem)] left-0 z-50 w-[min(100vw-2rem,22rem)] gap-0 overflow-hidden rounded-2xl border-border-subtle py-2 shadow-xl ring-0 sm:left-1/2 sm:w-[22rem] sm:-translate-x-1/2"
            >
              <CardContent className="max-h-[min(20rem,55vh)] space-y-0.5 overflow-y-auto p-2">
                {EXPLORE_CATEGORY_OPTIONS.map((option) => {
                  const Icon = EXPLORE_CATEGORY_ICONS[option.id] ?? EXPLORE_CATEGORY_ICONS.all
                  const isSelected =
                    option.rubroId === null
                      ? selectedRubro === null
                      : selectedRubro === option.rubroId
                  const toneClass =
                    EXPLORE_CATEGORY_ICON_TONES[option.iconTone] ??
                    EXPLORE_CATEGORY_ICON_TONES.violet

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectRubro(option.rubroId)
                        closePanels()
                      }}
                      className={cn(
                        'uanabi-menu-item flex items-center gap-3 px-2 py-2.5',
                        isSelected && 'uanabi-menu-item-active',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                          toneClass,
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {option.label}
                        </span>
                        <span className="block text-xs leading-snug text-muted-foreground">
                          {option.hint}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="my-3 w-px shrink-0 bg-border" aria-hidden />

        {/* Marca */}
        <label
          className={cn(
            'uanabi-search-segment flex min-w-0 flex-1 cursor-text flex-col px-4 py-2 sm:px-5',
            brandFocused && 'uanabi-search-segment-active',
          )}
        >
          <SegmentLabel>Marca</SegmentLabel>
          <input
            id="explore-brand-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => {
              setBrandFocused(true)
              closePanels()
            }}
            onBlur={() => setBrandFocused(false)}
            placeholder="Nombre o rubro"
            className={cn(
              'uanabi-search-segment-value mt-1 w-full border-0 bg-transparent p-0 outline-none placeholder:font-normal placeholder:text-muted-foreground',
              (brandFocused || searchQuery.trim()) && 'text-foreground',
            )}
          />
        </label>

        <div className={cn('flex shrink-0 items-center', isCompact ? 'pr-1.5' : 'pr-2 sm:pr-3')}>
          <Button
            type="button"
            size="icon"
            className={cn(
              'shrink-0 rounded-full shadow-sm',
              isCompact ? 'h-8 w-8' : 'h-11 w-11',
            )}
            aria-label="Buscar marcas"
            onClick={() => document.getElementById('explore-brand-search')?.focus()}
          >
            <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
          </Button>
        </div>
      </div>
    </div>
  )
}
