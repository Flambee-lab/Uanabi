/** Packs de producto por marca — en Uanabi todas las marcas aportan producto */
const SWATCHES = [
  'from-rose-50 to-orange-50',
  'from-sky-50 to-cyan-50',
  'from-amber-50 to-yellow-50',
  'from-emerald-50 to-teal-50',
  'from-fuchsia-50 to-pink-50',
]

function packs(brandId, items) {
  return items.map((item, i) => ({
    id: `pack-${brandId}-${i}`,
    name: item.name,
    fullName: item.fullName,
    image: item.image ?? null,
    swatch: item.swatch ?? SWATCHES[i % SWATCHES.length],
  }))
}

const COCA_PACK_IMAGES = '/images/product-packs/coca-cola'

export const BRAND_PRODUCT_PACKS = {
  'brand-001': packs('brand-001', [
    {
      name: 'Pack 6 Diet',
      fullName: 'Six-pack Diet Coke para barra o sampling',
      image: `${COCA_PACK_IMAGES}/pack-diet-6.png`,
    },
    {
      name: 'Lata Zero',
      fullName: 'Coca-Cola Zero 330 ml — lata individual',
      image: `${COCA_PACK_IMAGES}/pack-zero-light.png`,
    },
    {
      name: 'Lata Light',
      fullName: 'Coca-Cola Light 330 ml — sin calorías',
      image: `${COCA_PACK_IMAGES}/pack-zero-light.png`,
    },
    {
      name: 'Classic 354ml',
      fullName: 'Lata Coca-Cola Classic 354 ml para barra y sampling',
      image: `${COCA_PACK_IMAGES}/pack-classic.png`,
    },
  ]),
  'brand-002': packs('brand-002', [
    { name: 'Lata 250ml', fullName: 'Latas edición estándar para torneos y festivales' },
    { name: 'Pack 4 u.', fullName: 'Four-pack para premios y influencers' },
    { name: 'Cooler evento', fullName: 'Cooler con hielo y stock para zona gaming' },
    { name: 'Merch Red Bull', fullName: 'Gorras y lanyards de producto sellado' },
  ]),
  'brand-003': packs('brand-003', [
    { name: 'Remeras run', fullName: 'Remeras técnicas para participantes' },
    { name: 'Goodie bag', fullName: 'Bolsas con calzado y accesorios de canje' },
    { name: 'Medias Nike', fullName: 'Medias performance por corrida o torneo' },
    { name: 'Vincha & gear', fullName: 'Vincha, muñequeras y botellas co-brand' },
  ]),
  'brand-004': packs('brand-004', [
    { name: 'Auriculares', fullName: 'Auriculares para sorteos en LAN o conferencias' },
    { name: 'Wearables', fullName: 'Relojes y bands para demo en stand' },
    { name: 'Cargadores', fullName: 'Cargadores y cables promocionales' },
    { name: 'Tablets demo', fullName: 'Tablets con app pre-instalada para expo' },
  ]),
  'brand-005': packs('brand-005', [
    { name: 'Capas shell', fullName: 'Capas impermeables para outdoor y retiros' },
    { name: 'Bolsos técnico', fullName: 'Mochilas día para asistentes' },
    { name: 'Merch sustentable', fullName: 'Botellas y kits reutilizables Patagonia' },
  ]),
  'brand-006': packs('brand-006', [
    { name: 'Barra cerveza', fullName: 'Barril y línea Quilmes para evento' },
    { name: 'Latas 473ml', fullName: 'Latas para público general' },
    { name: 'Vasos litro', fullName: 'Vasos returnables para barra' },
    { name: 'Merch cervecero', fullName: 'Destapadores y coolers con logo' },
  ]),
  'brand-007': packs('brand-007', [
    { name: 'Barril Andes', fullName: 'Barril para eventos barriales' },
    { name: 'Pack latas', fullName: 'Six-pack para premios amateur' },
    { name: 'Merch local', fullName: 'Remeras y gorras con stock de producto' },
  ]),
  'brand-008': packs('brand-008', [
    { name: 'Kit swag', fullName: 'Tote con termo y snacks partners' },
    { name: 'Termo ML', fullName: 'Termos co-branded Mercado Libre' },
    { name: 'Snacks pack', fullName: 'Selección snacks para stand digital' },
    { name: 'Cupones físicos', fullName: 'Tarjetas con QR + producto sorpresa' },
  ]),
  'brand-009': packs('brand-009', [
    { name: 'Caja chocolates', fullName: 'Tabletas y bombones Arcor para ferias' },
    { name: 'Galletitas', fullName: 'Display galletitas para familias' },
    { name: 'Caramelos bulk', fullName: 'Bolsas bulk para sampling' },
    { name: 'Mix snack', fullName: 'Mix salado para degustación en stand' },
  ]),
  'brand-010': packs('brand-010', [
    { name: 'Remera dry-fit', fullName: 'Remeras deportivas para corredores' },
    { name: 'Buzo training', fullName: 'Buzos para equipos amateur' },
    { name: 'Medias 3/4', fullName: 'Medias técnicas por participante' },
    { name: 'Mochila gym', fullName: 'Mochilas con producto sellado' },
  ]),
  'brand-011': packs('brand-011', [
    { name: 'Kit bienvenida', fullName: 'Caja con termo, libreta y snacks partners' },
    { name: 'Termo premium', fullName: 'Termo acero para eventos corporativos' },
    { name: 'Snacks gourmet', fullName: 'Selección productos para networking VIP' },
    { name: 'Merch Galicia', fullName: 'Pines y tote con regalo físico' },
  ]),
  'brand-012': packs('brand-012', [
    { name: 'Lata Monster', fullName: 'Latas Green y Ultra para gaming' },
    { name: 'Pack 4 u.', fullName: 'Four-pack para streamers y premios' },
    { name: 'Merch gaming', fullName: 'Hoodies y mousepads con stock lata' },
    { name: 'Cooler stage', fullName: 'Cooler escenario con producto frío' },
  ]),
  'brand-013': packs('brand-013', [
    { name: 'Kit skincare', fullName: 'Crema + limpiador tamaño evento' },
    { name: 'SPF facial', fullName: 'Protector solar para activaciones outdoor' },
    { name: 'Sampling tubs', fullName: 'Tubs individuales para ferias' },
    { name: 'Body lotion', fullName: 'Loción mini para goodie bags' },
  ]),
  'brand-014': packs('brand-014', [
    { name: 'Merch artista', fullName: 'Remeras edición show limitada' },
    { name: 'Pines & stickers', fullName: 'Pack físico merch musical' },
    { name: 'Pulseras RFID', fullName: 'Pulseras con chip para acceso + regalo' },
    { name: 'Termo co-brand', fullName: 'Termos Spotify x artista en venue' },
  ]),
}

/** Placeholder hasta definir producto e imágenes por marca */
export function getDefaultBrandProductPacks(brandId) {
  return packs(brandId, [
    { name: 'Pack evento', fullName: 'Producto en canje según alcance del evento' },
    { name: 'Sampling', fullName: 'Muestras y degustación en el venue' },
    { name: 'Kit asistentes', fullName: 'Kits para público o participantes' },
    { name: 'Merch marca', fullName: 'Merchandising y regalos con producto sellado' },
  ])
}
