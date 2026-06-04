export const profileInputClass =
  'w-full rounded-xl border border-transparent bg-neutral-50 px-4 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-0'

export const profileEditInputClass =
  'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-0'

export function ProfileField({ label, hint, children, required }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-neutral-800">
        {label}
        {required && <span className="text-neutral-400"> *</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-neutral-500">{hint}</p>}
    </div>
  )
}

export function WizardSection({ step, title, description, children }) {
  return (
    <section className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm sm:p-10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        Paso {step}
      </p>
      <h2 className="mt-2 font-display text-xl font-black tracking-tight text-neutral-900">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">{description}</p>
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  )
}
