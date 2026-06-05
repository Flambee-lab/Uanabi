import { useBrandLogoSrc } from '@/hooks/useBrandLogoSrc'

export default function BrandLogo({ name, logo, logoFallback, size = 'md' }) {
  const { src, exhausted, onError, key } = useBrandLogoSrc({ name, logo, logoFallback })

  const sizes = {
    sm: { wrapper: 'h-10 w-10 rounded-xl', text: 'text-xs', img: 'h-6 w-6' },
    md: { wrapper: 'h-14 w-14 rounded-2xl', text: 'text-sm', img: 'h-8 w-8' },
    lg: { wrapper: 'h-20 w-20 rounded-3xl', text: 'text-xl', img: 'h-12 w-12' },
  }

  const s = sizes[size] ?? sizes.md

  if (exhausted) {
    return (
      <div
        className={`brand-logo-surface ${s.wrapper} shrink-0 border border-border-subtle ${s.text} font-extrabold text-foreground`}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div
      className={`brand-logo-surface ${s.wrapper} shrink-0 border border-border-subtle p-3`}
    >
      <img
        key={key}
        src={src}
        alt={name}
        className={`${s.img} max-h-full max-w-full object-contain`}
        onError={onError}
      />
    </div>
  )
}
