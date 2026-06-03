import { useEffect, useState } from 'react'
import { Check, Shield, X } from 'lucide-react'
import { ADMISSION_RUBROS } from '../../data/mockEvents'

function SelectablePill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
        active
          ? 'border-[#111827] bg-[#111827] text-white shadow-sm'
          : 'border-[#eef0f2] bg-white text-[#374151] hover:border-[#d1d5db] hover:bg-[#fafafa]'
      }`}
    >
      {active && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
      {children}
    </button>
  )
}

function ScaleToggle({ active, onChange, title, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
        active
          ? 'border-[#111827] bg-[#fafafa]'
          : 'border-[#eef0f2] bg-white hover:border-[#d1d5db]'
      }`}
    >
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          active ? 'border-[#111827] bg-[#111827]' : 'border-[#d1d5db] bg-white'
        }`}
      >
        {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#111827]">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">{description}</p>
      </div>
    </button>
  )
}

export default function AdmissionRulesModal({ isOpen, rules, onClose, onSave, onClear }) {
  const [draft, setDraft] = useState(rules)

  useEffect(() => {
    if (isOpen) setDraft(rules)
  }, [isOpen, rules])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const toggleRubro = (rubro) => {
    setDraft((prev) => {
      const current = prev.allowedRubros ?? []
      const next = current.includes(rubro)
        ? current.filter((r) => r !== rubro)
        : [...current, rubro]
      return { ...prev, allowedRubros: next }
    })
  }

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  const handleClear = () => {
    onClear()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="animate-backdrop-enter absolute inset-0 bg-[#111827]/20 backdrop-blur-md"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admission-rules-title"
        className="animate-modal-enter relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#eef0f2] bg-white shadow-2xl shadow-black/5"
      >
        <div className="border-b border-[#eef0f2] px-8 py-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f6e9]">
                <Shield className="h-5 w-5 text-[#1d230d]" strokeWidth={1.75} />
              </div>
              <div>
                <h2
                  id="admission-rules-title"
                  className="font-display text-xl font-extrabold tracking-tight text-[#111827]"
                >
                  Reglas de Admisión
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6b7280]">
                  Configurá qué marcas pueden enviarte propuestas. Solo verás las que pasen tu
                  gatekeeper.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-[#9ca3af] transition-colors hover:bg-[#f9fafb] hover:text-[#111827]"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] space-y-10 overflow-y-auto px-8 py-8">
          <section>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
              Rubros permitidos
            </p>
            <div className="flex flex-wrap gap-2.5">
              {ADMISSION_RUBROS.map((rubro) => (
                <SelectablePill
                  key={rubro}
                  active={draft.allowedRubros?.includes(rubro)}
                  onClick={() => toggleRubro(rubro)}
                >
                  {rubro}
                </SelectablePill>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#9ca3af]">
              Sin selección = todos los rubros son bienvenidos.
            </p>
          </section>

          <section>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
              Escala de la marca
            </p>
            <div className="space-y-3">
              <ScaleToggle
                active={draft.onlyCashBudget}
                onChange={(v) => setDraft((p) => ({ ...p, onlyCashBudget: v }))}
                title="Solo presupuesto en efectivo"
                description="Filtrá marcas que aporten dinero real además de visibilidad."
              />
              <ScaleToggle
                active={draft.onlyLogistics}
                onChange={(v) => setDraft((p) => ({ ...p, onlyLogistics: v }))}
                title="Solo marcas que aporten logística"
                description="Producto, stock, equipamiento o canje operativo para tu evento."
              />
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eef0f2] bg-[#fbfbfc] px-8 py-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-2xl px-5 py-3 text-sm font-medium text-[#6b7280] transition-colors hover:text-[#111827]"
          >
            Limpiar Filtros
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-[#111827] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#1f2937] active:scale-[0.98]"
          >
            Guardar Reglas
          </button>
        </div>
      </div>
    </div>
  )
}
