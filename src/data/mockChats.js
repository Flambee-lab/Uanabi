export const mockConversations = [
  {
    id: 'chat-001',
    brandId: 'brand-003',
    brandName: 'Nike',
    brandLogo: 'https://logo.clearbit.com/nike.com',
    eventTitle: 'Runway Underground — Desfile Moda Independiente',
    lastMessage: 'Perfecto, coordinamos el envío de indumentaria esta semana.',
    lastMessageAt: '2026-05-30T14:22:00',
    unread: 2,
    messages: [
      {
        id: 'm1',
        sender: 'brand',
        text: 'Hola! Vimos tu evento Runway Underground y nos encanta el fit con Nike.',
        at: '2026-05-28T10:00:00',
      },
      {
        id: 'm2',
        sender: 'host',
        text: 'Gracias! Tenemos 30 modelos confirmados y cobertura de prensa especializada.',
        at: '2026-05-28T11:15:00',
      },
      {
        id: 'm3',
        sender: 'brand',
        text: 'Te proponemos indumentaria completa + goodie bags. ¿Te sirve un canje premium?',
        at: '2026-05-29T09:30:00',
      },
      {
        id: 'm4',
        sender: 'host',
        text: 'Sí, encaja perfecto. ¿Podemos definir cantidades y fechas de entrega?',
        at: '2026-05-30T12:00:00',
      },
      {
        id: 'm5',
        sender: 'brand',
        text: 'Perfecto, coordinamos el envío de indumentaria esta semana.',
        at: '2026-05-30T14:22:00',
      },
    ],
  },
]

export function buildConversationsFromBrands(brands, existing = mockConversations) {
  const matched = brands.filter((b) => b.applicationStatus === 'match_aceptado')
  const byBrandId = new Map(existing.map((c) => [c.brandId, c]))

  return matched.map((brand) => {
    if (byBrandId.has(brand.id)) return byBrandId.get(brand.id)
    return {
      id: `chat-${brand.id}`,
      brandId: brand.id,
      brandName: brand.name,
      brandLogo: brand.logo,
      eventTitle: 'Tu evento publicado',
      lastMessage: 'Match confirmado — iniciá la conversación.',
      lastMessageAt: new Date().toISOString(),
      unread: 0,
      messages: [
        {
          id: 'welcome',
          sender: 'brand',
          text: `¡Hola! Somos ${brand.name}. Tu match está activo, escribinos para cerrar el trato.`,
          at: new Date().toISOString(),
        },
      ],
    }
  })
}

export function formatChatTime(iso) {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  }

  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}
