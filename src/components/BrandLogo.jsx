import { useState } from 'react'

export default function BrandLogo({ name, logo, size = 'md' }) {
  const [failed, setFailed] = useState(false)

  const sizes = {
    sm: { wrapper: 'h-10 w-10 rounded-xl', text: 'text-xs', img: 'h-6 w-6' },
    md: { wrapper: 'h-14 w-14 rounded-2xl', text: 'text-sm', img: 'h-8 w-8' },
    lg: { wrapper: 'h-20 w-20 rounded-3xl', text: 'text-xl', img: 'h-12 w-12' },
  }

  const s = sizes[size] ?? sizes.md

  if (failed) {
    return (
      <div
        className={`flex ${s.wrapper} shrink-0 items-center justify-center border border-[#eef0f2] bg-[#fafafa] ${s.text} font-extrabold text-[#111827]`}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div
      className={`flex ${s.wrapper} shrink-0 items-center justify-center overflow-hidden border border-[#eef0f2] bg-[#fafafa] p-3`}
    >
      <img
        src={logo}
        alt={name}
        className={`${s.img} max-h-full max-w-full object-contain`}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
