export const WHATSAPP_PREFILL_MESSAGE =
  'Hola, vi tu perfil en Onbrand y nos interesa analizar una propuesta de patrocinio.'

export const DEFAULT_ACCOUNT_USER = {
  fullName: 'Milena Belén Miranda',
  role: 'Host',
}

export const HOST_LOCATION = 'CABA'
export const HOST_LOCATION_HINT = 'Solo CABA — Próximamente más zonas'

export const HOST_IDENTITY_TAGS = [
  'Gaming',
  'Esports',
  'Moda',
  'Gastronomía',
  'Arte',
  'Música',
  'Estilo de Vida',
]

export const DEFAULT_HOST_PROFILE = {
  fullName: DEFAULT_ACCOUNT_USER.fullName,
  displayName: '',
  tagline: '',
  bio: '',
  avatarUrl: null,
  location: HOST_LOCATION,
  categories: [],
  instagram: '',
  tiktok: '',
  whatsapp: '',
  pastBrandNames: [],
  socialMetrics: {
    totalFollowers: '',
    engagementPercent: '',
  },
  validatedLinks: {
    instagram: false,
    tiktok: false,
  },
  successStories: [],
  joinedAt: null,
  isConfigured: false,
  commercialContactEnabled: true,
}

export function getProfileDisplayName(profile) {
  return (
    profile?.fullName?.trim() ||
    profile?.displayName?.trim() ||
    DEFAULT_ACCOUNT_USER.fullName
  )
}

export function getProfileInitial(profile) {
  const name = getProfileDisplayName(profile)
  return name.charAt(0).toUpperCase()
}

export function buildWhatsAppUrl(phone, message = WHATSAPP_PREFILL_MESSAGE) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const normalized = digits.startsWith('54') ? digits : `54${digits.replace(/^0/, '')}`
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function normalizeSocialUrl(platform, value) {
  const v = value.trim()
  if (!v) return null
  if (v.startsWith('http')) return v
  const handle = v.replace(/^@/, '')
  if (platform === 'instagram') return `https://instagram.com/${handle}`
  if (platform === 'tiktok') return `https://tiktok.com/@${handle}`
  return v
}

export function validateSocialLink(platform, value) {
  const url = normalizeSocialUrl(platform, value)
  if (!url) return { ok: false, message: 'Ingresá un usuario o URL válida' }
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')
    if (platform === 'instagram' && !host.includes('instagram.com')) {
      return { ok: false, message: 'El enlace debe ser de Instagram' }
    }
    if (platform === 'tiktok' && !host.includes('tiktok.com')) {
      return { ok: false, message: 'El enlace debe ser de TikTok' }
    }
    return { ok: true, url }
  } catch {
    return { ok: false, message: 'URL no válida' }
  }
}

export function isProfileConfigured(profile) {
  if (!profile) return false
  if (profile.isConfigured) return true
  const hasName = Boolean(
    profile.fullName?.trim() || profile.displayName?.trim(),
  )
  const hasWhatsApp = Boolean(profile.whatsapp?.trim())
  const hasTags = (profile.categories?.length ?? 0) > 0
  return hasName && hasWhatsApp && hasTags
}

function parseReachFromAudience(audience) {
  if (!audience) return 0
  const match = audience.match(/([\d.,]+)\s*k/i)
  if (match) return Math.round(parseFloat(match[1].replace(',', '.')) * 1000)
  const num = audience.match(/([\d.,]+)\s*presenciales/i)
  if (num) return parseInt(num[1].replace(/\D/g, ''), 10) || 0
  return 0
}

export function computeHostStats(events, profile) {
  let matches = 0
  let totalReach = 0

  for (const event of events) {
    totalReach += parseReachFromAudience(event.audience)
    for (const invite of event.invitedBrands ?? []) {
      if (invite.status === 'match_aceptado') matches += 1
    }
  }

  const followers = parseInt(
    String(profile?.socialMetrics?.totalFollowers ?? '').replace(/\D/g, ''),
    10,
  )
  const platformReach = Number.isFinite(followers) ? followers : 0

  return {
    matches,
    totalReach: Math.max(totalReach, platformReach),
    eventsCount: events.length,
    engagement: profile?.socialMetrics?.engagementPercent ?? '—',
  }
}

export function resolvePastBrandLogos(names, catalog) {
  return (names ?? []).map((name) => {
    const brand = catalog.find((b) => b.name.toLowerCase() === name.toLowerCase())
    return { name, logo: brand?.logo ?? null }
  })
}

export function formatJoinedDate(iso) {
  if (!iso) return 'Recién unido'
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

export function createEmptySuccessStory() {
  return createEmptyCollaboration()
}

export function createEmptyCollaboration() {
  return {
    id: `colab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    referenceLink: '',
    evidencePhotos: [],
    brandNames: [],
    attendance: '',
  }
}

export function mergeProfileForSave(profile, form, { skipValidation = false } = {}) {
  const stories = form.successStories ?? profile.successStories ?? []
  const cleanedStories = skipValidation
    ? stories
    : stories.filter((s) => s.title?.trim())

  const displayName = form.displayName?.trim() || profile.displayName
  const fullName =
    form.fullName?.trim() ||
    displayName ||
    profile.fullName ||
    DEFAULT_ACCOUNT_USER.fullName

  return {
    ...profile,
    ...form,
    fullName,
    displayName,
    location: form.location ?? HOST_LOCATION,
    categories: form.categories ?? profile.categories ?? [],
    socialMetrics: { ...(profile.socialMetrics ?? {}), ...(form.socialMetrics ?? {}) },
    validatedLinks: { ...(profile.validatedLinks ?? {}), ...(form.validatedLinks ?? {}) },
    successStories: cleanedStories.length > 0 ? cleanedStories : stories,
    joinedAt: profile.joinedAt ?? new Date().toISOString(),
    isConfigured: true,
  }
}

export const PROFILE_EDIT_SECTIONS = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'channels', label: 'Channels & Metrics' },
  { id: 'collaborations', label: 'Past Collaborations' },
]

export const PROFILE_PUBLIC_TABS = [
  { id: 'historial', label: 'Colaboraciones' },
  { id: 'eventos', label: 'Próximos eventos' },
]

export function getProfileCategories(profile) {
  return profile?.categories?.length > 0 ? profile.categories : []
}
