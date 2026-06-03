export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-400 focus:ring-0 ${className}`}
      {...props}
    />
  )
}
