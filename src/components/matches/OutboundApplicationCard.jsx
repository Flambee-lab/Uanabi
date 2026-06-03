import { ArrowUpRight, MessageCircle } from 'lucide-react'
import BrandLogo from '../BrandLogo'

const STATUS_STYLES = {
  pendiente: 'bg-amber-50 text-amber-800 border-amber-100',
  rechazado: 'bg-[#f9fafb] text-[#9ca3af] border-[#eef0f2]',
  aceptado: 'bg-[#f4f6e9] text-[#1d230d] border-[#e8ecd8]',
}

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  rechazado: 'Rechazado',
  aceptado: 'Match confirmado',
}

export default function OutboundApplicationCard({ application, onOpenChat }) {
  const isAccepted = application.status === 'aceptado'

  return (
    <article className="rounded-3xl border border-[#eef0f2] bg-white p-8 transition-all hover:border-[#e5e7eb]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-5">
          <BrandLogo name={application.brandName} logo={application.brandLogo} size="md" />

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-extrabold tracking-tight text-[#111827]">
                {application.brandName}
              </h3>
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STATUS_STYLES[application.status]}`}
              >
                {STATUS_LABELS[application.status]}
              </span>
            </div>

            <p className="text-sm text-[#6b7280]">
              Postulaste con{' '}
              <span className="font-semibold text-[#111827]">{application.eventTarget}</span>
            </p>
            <p className="mt-2 text-xs text-[#9ca3af]">
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
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#f4f6e9] px-6 py-3 text-sm font-bold text-[#1d230d] transition-all hover:bg-[#e8ecd8] active:scale-[0.98]"
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
