/** Invitaciones demo para el panel de marcas (modo local) */
export const MOCK_BRAND_INVITACIONES = [
  {
    id: 'inv-mock-001',
    evento_id: 'evt-001',
    evento_titulo: 'Neon LAN Party — Torneo Valorant',
    evento_fecha: '2026-06-15',
    evento_ubicacion: 'Palermo, Buenos Aires',
    marca_nombre: 'VitalSport',
    host_nombre: 'Milena Belén Miranda',
    host_comunidad: 'CTRL+FEST — Comunidad Gamer BA',
    evento_audiencia: '1.200 presenciales / 25k reach',
    evento_nicho: 'Gaming',
    productos_solicitados: ['10× Energética Classic', '10× Isotónica Zero'],
    entregables_ofrecidos: ['Mención en redes del evento', 'Stand de sampling', 'Tag @VitalSport en stories'],
    fecha_limite_entrega: '2026-06-08',
    cantidad_estimada: '10× Energética Classic, 10× Isotónica Zero',
    direccion_entrega: 'Sarmiento 3131 · Palermo, Buenos Aires',
    whatsapp: '11 2345 6789',
    mensaje_extra: 'Acceso por calle lateral para camión de entrega.',
    estado: 'pendiente',
    mensaje_respuesta: null,
    created_at: '2026-06-04T10:00:00Z',
  },
  {
    id: 'inv-mock-002',
    evento_id: 'evt-002',
    evento_titulo: 'Rooftop Privado — Lanzamiento Exclusivo',
    evento_fecha: '2026-06-28',
    evento_ubicacion: 'Puerto Madero, Buenos Aires',
    marca_nombre: 'VitalSport',
    host_nombre: 'Studio Norte',
    host_comunidad: 'Studio Norte — Eventos Premium',
    evento_audiencia: '25 presenciales / 850 reach',
    evento_nicho: 'Lifestyle',
    productos_solicitados: ['20× Bebida Premium', '5× Hielera promocional'],
    entregables_ofrecidos: ['Branding en terraza', 'Contenido lifestyle', 'Acceso VIP para invitados de la marca'],
    fecha_limite_entrega: '2026-06-20',
    cantidad_estimada: '20× Bebida Premium',
    direccion_entrega: 'Juana Manso 1100 · Puerto Madero',
    whatsapp: '11 9876 5432',
    mensaje_extra: null,
    estado: 'pendiente',
    mensaje_respuesta: null,
    created_at: '2026-06-05T14:30:00Z',
  },
  {
    id: 'inv-mock-003',
    evento_id: 'evt-004',
    evento_titulo: 'Cena Degustación — Chefs Emergentes',
    evento_fecha: '2026-05-10',
    evento_ubicacion: 'San Telmo, Buenos Aires',
    marca_nombre: 'VitalSport',
    host_nombre: 'Mesa Emergente',
    host_comunidad: 'Mesa Emergente — Experiencias Foodie',
    evento_audiencia: '40 presenciales / 3.2k reach',
    evento_nicho: 'Gastronomía',
    productos_solicitados: ['15× Agua saborizada'],
    entregables_ofrecidos: ['Maridaje co-branded', 'Menciones en carta'],
    fecha_limite_entrega: '2026-05-03',
    direccion_entrega: 'Balcarce 748 · San Telmo',
    whatsapp: '11 4567 8901',
    mensaje_extra: 'Evento íntimo, 40 comensales.',
    estado: 'aceptado',
    mensaje_respuesta: null,
    created_at: '2026-05-28T09:00:00Z',
  },
  {
    id: 'inv-mock-004',
    evento_id: 'evt-005',
    evento_titulo: 'After Office — Networking Startups',
    evento_fecha: '2026-05-22',
    evento_ubicacion: 'Microcentro, Buenos Aires',
    marca_nombre: 'VitalSport',
    host_nombre: 'Comunidad Founders BA',
    host_comunidad: 'Founders BA — Networking & Tech',
    evento_audiencia: '90 presenciales / 5k reach',
    evento_nicho: 'Tecnología',
    productos_solicitados: ['60× Energética Zero Azúcar'],
    entregables_ofrecidos: ['Logo en pantalla principal', '2 stories del evento'],
    fecha_limite_entrega: '2026-05-15',
    direccion_entrega: 'Av. Corrientes 800 · Microcentro',
    whatsapp: '11 5555 1234',
    mensaje_extra: null,
    estado: 'rechazado',
    mensaje_respuesta: null,
    created_at: '2026-05-10T11:00:00Z',
  },
]

// v3: agrega invitación declinada de ejemplo — invalida caches viejos
const LOCAL_INVITACIONES_KEY = 'uanabi_brand_invitaciones_local_v3'

export function loadLocalBrandInvitaciones() {
  try {
    const raw = sessionStorage.getItem(LOCAL_INVITACIONES_KEY)
    if (raw) return JSON.parse(raw)
    sessionStorage.setItem(LOCAL_INVITACIONES_KEY, JSON.stringify(MOCK_BRAND_INVITACIONES))
    return [...MOCK_BRAND_INVITACIONES]
  } catch {
    return [...MOCK_BRAND_INVITACIONES]
  }
}

export function saveLocalBrandInvitaciones(rows) {
  sessionStorage.setItem(LOCAL_INVITACIONES_KEY, JSON.stringify(rows))
}

export function mapInvitacionRow(row, eventsById = {}) {
  const event = eventsById[row.evento_id]
  return {
    id: row.id,
    eventoId: row.evento_id,
    eventoTitulo: row.evento_titulo ?? event?.title ?? 'Evento',
    eventoFecha: row.evento_fecha ?? event?.date ?? null,
    eventoUbicacion: row.evento_ubicacion ?? event?.location ?? null,
    eventoAudiencia: row.evento_audiencia ?? event?.audience ?? null,
    eventoNicho: row.evento_nicho ?? event?.niche ?? null,
    hostNombre: row.host_nombre ?? event?.organizer?.name ?? null,
    hostComunidad: row.host_comunidad ?? event?.hostCommunity?.name ?? null,
    marcaNombre: row.marca_nombre,
    productosSolicitados: row.productos_solicitados ?? [],
    entregablesOfrecidos: row.entregables_ofrecidos ?? [],
    fechaLimiteEntrega: row.fecha_limite_entrega,
    cantidadEstimada: row.cantidad_estimada,
    direccionEntrega: row.direccion_entrega,
    whatsapp: row.whatsapp,
    mensajeExtra: row.mensaje_extra,
    estado: row.estado,
    mensajeRespuesta: row.mensaje_respuesta,
    createdAt: row.created_at,
  }
}
