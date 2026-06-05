import { ArrowUpRight, MessageCircle } from 'lucide-react'
import BrandLogo from './BrandLogo'

const BUDGET_LABELS = {
  Canje: 'Canje',
  'Presupuesto Efectivo': 'Efectivo',
  Híbrido: 'Híbrido',
}

function HighlightText({ text }) {
  const parts = text.split(/(\$[\d.,]+k?|\$[\d.,]+)/gi)

  return (
    <>
      {parts.map((part, i) =>
        /^\$/.test(part) ? (
          <strong key={i} className="font-extrabold text-foreground">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

function InfoBlock({ label, items, highlight }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-background p-4">
      <p className="mb-2.5 type-label ">
        {label}
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-foreground/80">
            {highlight ? <HighlightText text={item} /> : item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ApplicationButton({ status, onApply, onOpenChat }) {
  if (status === 'match_aceptado') {
    return (
      <button
        type="button"
        onClick={onOpenChat}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-match px-5 py-3.5 text-sm font-bold text-match-foreground transition-all hover:bg-[#e8ecd8] active:scale-[0.98]"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2} />
        Ir al Chat Directo
        <ArrowUpRight className="h-4 w-4 opacity-60" strokeWidth={2} />
      </button>
    )
  }

  if (status === 'enviada') {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-default rounded-2xl border border-border-subtle bg-secondary px-5 py-3.5 text-sm font-medium text-muted-foreground"
      >
        Postulación Enviada
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onApply}
      className="w-full rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
    >
      Postular mi Evento
    </button>
  )
}

export default function BrandCard({ brand, onApply, onOpenChat, variant = 'explore' }) {
  const isChat = variant === 'chat'

  return (
    <article className="flex h-full flex-col rounded-3xl border border-border-subtle bg-white p-7 transition-all duration-300 hover:border-[#e5e7eb]">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <BrandLogo
            name={brand.name}
            logo={brand.logo}
            logoFallback={brand.logoFallback}
            size="lg"
          />
          <div>
            <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground">
              {brand.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{brand.industry}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-border-subtle bg-secondary px-3 py-1 text-xs font-bold text-foreground">
          {BUDGET_LABELS[brand.budgetType]}
        </span>
      </header>

      <div className="mb-6 flex flex-1 flex-col gap-3">
        <InfoBlock label="Qué busca" items={brand.seeks} />
        <InfoBlock label="Qué aporta" items={brand.offers} highlight />
      </div>

      <ApplicationButton
        status={isChat ? 'match_aceptado' : brand.applicationStatus}
        onApply={() => onApply?.(brand.id)}
        onOpenChat={() => onOpenChat?.(brand.id)}
      />
    </article>
  )
}
