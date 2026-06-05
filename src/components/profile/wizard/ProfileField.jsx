export const profileInputClass =
  'w-full rounded-xl border border-transparent bg-secondary px-4 py-3 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none focus:ring-0'

export const profileEditInputClass =
  'w-full rounded-xl border border-border bg-secondary px-4 py-3 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none focus:ring-0'

export function ProfileField({ label, hint, children, required }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-foreground">
        {label}
        {required && <span className="text-muted-foreground"> *</span>}
      </label>
      {children}
      {hint && <p className="type-small leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function WizardSection({ step, title, description, children }) {
  return (
    <section className="rounded-[32px] border border-border-subtle bg-white p-8 shadow-sm sm:p-10">
      <p className="type-label ">
        Paso {step}
      </p>
      <h2 className="mt-2 font-display text-xl font-black tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  )
}
