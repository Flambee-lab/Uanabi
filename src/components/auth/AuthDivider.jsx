export default function AuthDivider({ label = 'o continuar con tu correo' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-neutral-100" />
      <span className="text-[10px] font-medium text-neutral-400">{label}</span>
      <div className="h-px flex-1 bg-neutral-100" />
    </div>
  )
}
