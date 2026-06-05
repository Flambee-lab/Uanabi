import { brandLogoFavicon } from '../utils/brandLogoUrl'

const SPONSOR_POOL = [
  {
    brandName: 'Coca-Cola',
    brandLogo: brandLogoFavicon('coca-cola.com'),
    industry: 'Bebidas',
    rubro: 'Bebidas',
    budgetType: 'Híbrido',
    offers: ['Stock de producto', 'Activación en escenario', 'Branding digital'],
    seeks: ['Alcance masivo', 'Contenido UGC'],
  },
  {
    brandName: 'Red Bull',
    brandLogo: brandLogoFavicon('redbull.com'),
    industry: 'Bebidas',
    rubro: 'Bebidas',
    budgetType: 'Presupuesto Efectivo',
    offers: ['$350k en efectivo', 'Producción AV', 'DJ Booth'],
    seeks: ['Eventos extremos', 'Gaming'],
  },
  {
    brandName: 'Samsung',
    brandLogo: brandLogoFavicon('samsung.com'),
    industry: 'Tecnología',
    rubro: 'Gaming & Tech',
    budgetType: 'Presupuesto Efectivo',
    offers: ['Zona demo', 'Equipos para sorteos', '$180k'],
    seeks: ['LAN parties', 'Hackathons'],
  },
  {
    brandName: 'Nike',
    brandLogo: brandLogoFavicon('nike.com'),
    industry: 'Indumentaria',
    rubro: 'Moda & Diseño',
    budgetType: 'Canje',
    offers: ['Indumentaria', 'Goodie bags', 'Branding front row'],
    seeks: ['Deportes', 'Street culture'],
  },
  {
    brandName: 'Quilmes',
    brandLogo: brandLogoFavicon('quilmes.com.ar'),
    industry: 'Bebidas',
    rubro: 'Bebidas',
    budgetType: 'Canje',
    offers: ['Barra de bebidas', 'Merch exclusivo', '4 heladeras con producto'],
    seeks: ['Gastronomía', 'Eventos culturales'],
  },
  {
    brandName: 'Patagonia',
    brandLogo: brandLogoFavicon('patagonia.com'),
    industry: 'Indumentaria',
    rubro: 'Moda & Diseño',
    budgetType: 'Canje',
    offers: ['Canje indumentaria', 'Workshops sustentables'],
    seeks: ['Outdoor', 'Eventos eco'],
  },
  {
    brandName: 'Mercado Libre',
    brandLogo: brandLogoFavicon('mercadolibre.com'),
    industry: 'Tecnología',
    rubro: 'Gaming & Tech',
    budgetType: 'Híbrido',
    offers: ['$120k + cupones', 'Stand interactivo'],
    seeks: ['E-commerce activations', 'Gaming'],
  },
  {
    brandName: 'Andes',
    brandLogo: brandLogoFavicon('andes.com.ar'),
    industry: 'Bebidas',
    rubro: 'Bebidas',
    budgetType: 'Canje',
    offers: ['Barra cerveza', 'Merchandising'],
    seeks: ['Fiestas', 'Música en vivo'],
  },
]

const OFFER_SNIPPETS = [
  '4 heladeras con producto + DJ Booth',
  'Presupuesto $80k + producción de contenido',
  'Canje total de indumentaria para staff',
  'Zona de activación 40m² + sorteos',
  'Barra libre + influencers de la marca',
]

export function generateBulkProposals(count = 100) {
  return Array.from({ length: count }, (_, i) => {
    const base = SPONSOR_POOL[i % SPONSOR_POOL.length]
    const suffix = i >= SPONSOR_POOL.length ? ` · Regional ${Math.floor(i / SPONSOR_POOL.length) + 1}` : ''
    const offerSnippet = OFFER_SNIPPETS[i % OFFER_SNIPPETS.length]

    return {
      id: `prop-bulk-${String(i + 1).padStart(3, '0')}`,
      brandId: `brand-bulk-${i + 1}`,
      brandName: `${base.brandName}${suffix}`,
      brandLogo: base.brandLogo,
      industry: base.industry,
      rubro: base.rubro,
      budgetType: base.budgetType,
      offers: base.offers,
      seeks: base.seeks,
      textProposal: `${offerSnippet}. Queremos patrocinar tu evento con visibilidad premium.`,
      sponsorMessage:
        'Hola, vimos tu evento y creemos que hay un fit excelente con nuestra estrategia de activaciones en vivo este trimestre.',
      status: i === 2 ? 'aceptado' : 'pendiente',
    }
  })
}
