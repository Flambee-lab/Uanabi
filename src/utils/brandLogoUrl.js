/**
 * URLs de logos para marcas en mock/demo.
 * Clearbit Logo API (logo.clearbit.com) ya no está disponible.
 */

export function brandLogoFavicon(domain) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
}

/** Icono SVG de Simple Icons (cdn.simpleicons.org). */
export function simpleIconsLogo(slug, colorHex) {
  const base = `https://cdn.simpleicons.org/${slug}`
  if (!colorHex) return base
  return `${base}/${String(colorHex).replace(/^#/, '')}`
}

const cover = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`

/** Portadas de producto por marca (catálogo Inicio). */
export const BRAND_COVER_IMAGES = {
  'brand-001': cover('1607929712810-f4218da8053f'), // Coca-Cola botella
  'brand-002': cover('1445605081472-9788fb3bc02f'), // Red Bull — motocross en el aire
  'brand-003': cover('1460353581641-37baddab0fa2'), // Nike zapatillas
  'brand-004': cover('1511707171634-5f897ff02aa9'), // smartphones
  'brand-005': cover('1464822759023-fed622ff2c3b'), // Patagonia outdoor
  'brand-006': cover('1436075260927-0dfae8dd4c96'), // cerveza en botella
  'brand-007': cover('1558618666-fcd25c85cd64'), // cerveza servida
  'brand-008': cover('1556742049-0cfed4f6a45d'), // compra / paquetes
  'brand-009': cover('1511381939419-a44016acbaad'), // chocolates y snacks
  'brand-010': cover('1542291026-7eec264c27ff'), // Adidas sneaker
  'brand-011': cover('1563013544-824ae1b704d3'), // tarjetas de crédito
  'brand-012':
    'https://images.pexels.com/photos/264869/pexels-photo-264869.jpeg?auto=compress&cs=tinysrgb&w=1200', // energy drink latas
  'brand-013': cover('1596462502279-4ed4d5f7ffee'), // skincare / belleza
  'brand-014': cover('1493225457124-a3eb161ffa5f'), // música / eventos
}
