import { ArrowUpRight, MessageCircle } from 'lucide-react'
import BrandLogo from '../BrandLogo'

const STATUS_STYLES = {
  pendiente: 'bg-amber-50 text-amber-800 border-amber-100',
  rechazado: 'bg-secondary text-muted-foreground border-border-subtle',
  aceptado: 'bg-match text-match-foreground border-match/30',
}

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  rechazado: 'Rechazado',
  aceptado: 'Match confirmado',
}

export default function OutboundApplicationCard({ application, onOpenChat }) {
  const isAccepted = application.status === 'aceptado'

  return (
    <article className="rounded-3xl border border-border-subtle bg-white p-8 transition-all hover:border-[#e5e7eb]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-5">
          <BrandLogo name={application.brandName} logo={application.brandLogo} size="md" />

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground">
                {application.brandName}
              </h3>
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STATUS_STYLES[application.status]}`}
              >
                {STATUS_LABELS[application.status]}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Postulaste con{' '}
              <span className="font-semibold text-foreground">{application.eventTarget}</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(application.date).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {isAccepted && (
          <button
            type="button"
            onClick={() => onOpenChat?.(application.id)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-match px-6 py-3 text-sm font-bold text-match-foreground transition-all hover:bg-[#e8ecd8] active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            Ir al Chat Directo
            <ArrowUpRight className="h-4 w-4 opacity-60" strokeWidth={2} />
          </button>
        )}
      </div>
    </article>
  )
}
