import { ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROPOSAL_FILTER } from '../../utils/proposalFilters'

const BASE_TABS = [
  { id: PROPOSAL_FILTER.ALL, label: 'Todas', widthClass: 'uanabi-proposal-filter-tab--sm' },
  {
    id: PROPOSAL_FILTER.APPROVED,
    label: 'Aprobadas',
    widthClass: 'uanabi-proposal-filter-tab--md',
    icon: Zap,
  },
  {
    id: PROPOSAL_FILTER.DECLINED,
    label: 'Rechazadas',
    widthClass: 'uanabi-proposal-filter-tab--lg',
  },
  {
    id: PROPOSAL_FILTER.IN_REVIEW,
    label: 'En revisión',
    widthClass: 'uanabi-proposal-filter-tab--xl',
  },
]

function FilterTab({ tab, isActive, onChange, disabled = false }) {
  const TabIcon = tab.icon
  const hasApprovedWin =
    tab.id === PROPOSAL_FILTER.APPROVED && (tab.count ?? 0) > 0
  const hasRecommendedHighlight =
    tab.id === PROPOSAL_FILTER.RECOMMENDED && (tab.count ?? 0) > 0

  const button = (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      aria-controls={`proposal-panel-${tab.id}`}
      disabled={disabled}
      onClick={() => onChange(tab.id)}
      className={cn(
        'uanabi-proposal-filter-tab',
        tab.widthClass,
        hasApprovedWin && 'uanabi-proposal-filter-tab-approved-highlight',
        isActive && !hasApprovedWin && 'uanabi-proposal-filter-tab-active',
        disabled && 'uanabi-proposal-filter-tab-disabled',
      )}
    >
      {TabIcon && (
        <TabIcon
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            hasApprovedWin
              ? 'text-emerald-600'
              : hasRecommendedHighlight
                ? 'text-primary'
                : isActive
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/70',
          )}
          strokeWidth={2.25}
          aria-hidden
        />
      )}
      <span
        className={cn('whitespace-nowrap', hasApprovedWin && 'font-semibold text-emerald-900')}
      >
        {tab.label}
      </span>
      <span
        className={cn(
          hasApprovedWin && !isActive && 'text-emerald-700/80',
          isActive ? 'text-muted-foreground' : 'text-muted-foreground/80',
        )}
      >
        {tab.count}
      </span>
    </button>
  )

  return button
}

export default function ProposalFilterTabs({
  active,
  onChange,
  counts,
  showRecommended = true,
  recommendedOnly = false,
  recommendedDescription,
  verificationOnly = false,
  verificationDescription,
}) {
  const primaryTabs = BASE_TABS.map((tab) => ({
    ...tab,
    count: counts[tab.id] ?? 0,
  }))

  const recommendedTab = {
    id: PROPOSAL_FILTER.RECOMMENDED,
    label: 'Recomendadas',
    count: counts[PROPOSAL_FILTER.RECOMMENDED] ?? 0,
    widthClass: 'uanabi-proposal-filter-tab--xl',
    icon: Sparkles,
  }

  if (verificationOnly) {
    const verificationCount = counts[PROPOSAL_FILTER.VERIFICATION] ?? 0
    const hasVerificationHighlight = verificationCount > 0

    const verificationChip = (
      <div
        className={cn(
          'uanabi-proposal-filter-tab uanabi-proposal-filter-tab--xl',
          'uanabi-proposal-filter-tab-active shrink-0',
          hasVerificationHighlight
            ? 'uanabi-proposal-filter-tab-verification-highlight w-fit'
            : 'w-fit',
        )}
        role="tab"
        aria-selected="true"
        aria-controls={`proposal-panel-${PROPOSAL_FILTER.VERIFICATION}`}
      >
        <ShieldCheck
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            hasVerificationHighlight ? 'text-orange-600' : 'text-muted-foreground',
          )}
          strokeWidth={2.25}
          aria-hidden
        />
        <span
          className={cn(
            'whitespace-nowrap',
            hasVerificationHighlight && 'font-semibold text-orange-900',
          )}
        >
          Verificación
        </span>
        <span
          className={cn(hasVerificationHighlight ? 'text-orange-700/80' : 'text-muted-foreground')}
        >
          {verificationCount}
        </span>
      </div>
    )

    return (
      <div
        className="flex flex-row items-center gap-3 sm:gap-4"
        role="tablist"
        aria-label="Verificación de patrocinios"
      >
        {verificationChip}
        {verificationDescription && (
          <p className="type-small min-w-0 flex-1 leading-relaxed text-muted-foreground">
            {verificationDescription}
          </p>
        )}
      </div>
    )
  }

  if (recommendedOnly && showRecommended) {
    const hasRecommendedHighlight = (recommendedTab.count ?? 0) > 0
    const TabIcon = recommendedTab.icon

    return (
      <div
        className="flex flex-row items-center gap-3 sm:gap-4"
        role="tablist"
        aria-label="Marcas recomendadas para tu evento"
      >
        <div
          className={cn(
            'uanabi-proposal-filter-tab uanabi-proposal-filter-tab--xl',
            'uanabi-proposal-filter-tab-active w-fit shrink-0',
          )}
          role="tab"
          aria-selected="true"
          aria-controls={`proposal-panel-${PROPOSAL_FILTER.RECOMMENDED}`}
        >
          {TabIcon && (
            <TabIcon
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                hasRecommendedHighlight ? 'text-primary' : 'text-muted-foreground',
              )}
              strokeWidth={2.25}
              aria-hidden
            />
          )}
          <span className="whitespace-nowrap">{recommendedTab.label}</span>
          <span className="text-muted-foreground">{recommendedTab.count}</span>
        </div>
        {recommendedDescription && (
          <p className="type-small min-w-0 flex-1 leading-relaxed text-muted-foreground">
            {recommendedDescription}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className="uanabi-proposal-filters"
      role="tablist"
      aria-label="Filtrar propuestas enviadas"
    >
      <div className="uanabi-proposal-filters-primary">
        {primaryTabs.map((tab) => (
          <FilterTab
            key={tab.id}
            tab={tab}
            isActive={active === tab.id}
            onChange={onChange}
          />
        ))}
      </div>

      {showRecommended && (
        <>
          <span className="uanabi-proposal-filters-divider" aria-hidden />
          <FilterTab
            tab={recommendedTab}
            isActive={active === recommendedTab.id}
            onChange={onChange}
          />
        </>
      )}
    </div>
  )
}
