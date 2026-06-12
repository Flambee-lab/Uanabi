/** Covers de fallback por industria para cards y perfil público de marca. */
const COVER_BY_INDUSTRY = {
  Bebidas:
    'https://images.unsplash.com/photo-1629203857988-ef7dd06ae83c?auto=format&fit=crop&w=1200&q=80',
  Tecnología:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  Indumentaria:
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
  Gastronomía:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  Entretenimiento:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
}

export function getBrandCoverSrc(brand) {
  return brand?.coverImage ?? COVER_BY_INDUSTRY[brand?.industry] ?? null
}
