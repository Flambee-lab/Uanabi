import { useState } from 'react'

/** Prueba logo → logoFallback → inicial (exhausted). */
export function useBrandLogoSrc(brand) {
  const sources = [brand?.logo, brand?.logoFallback].filter(Boolean)
  const [index, setIndex] = useState(0)
  const exhausted = index >= sources.length
  const src = exhausted ? null : sources[index]
  const onError = () => setIndex((i) => i + 1)

  return { src, exhausted, onError, key: `${brand?.id ?? brand?.name}-${index}` }
}
