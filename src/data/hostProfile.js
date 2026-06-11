export const WHATSAPP_PREFILL_MESSAGE =
  'Hola, vi tu perfil en Uanabi y nos interesa analizar una propuesta de patrocinio.'

export const DEFAULT_ACCOUNT_USER = {
  fullName: 'Celeste Rojas',
  role: 'Host',
}

export const HOST_LOCATION = 'CABA'
export const HOST_LOCATION_HINT = 'Solo CABA — Próximamente más zonas'

export const HOST_IDENTITY_TAGS = [
  'Viajes',
  'Fotografía',
  'Gaming',
  'Esports',
  'Moda',
  'Gastronomía',
  'Arte',
  'Música',
  'Estilo de Vida',
]

export const HOST_PROFILE_STORAGE_KEY = 'uanabi_host_profile'

/** Incrementar cuando cambien defaults de demo que deben propagarse a perfiles guardados. */
const HOST_PROFILE_DATA_VERSION = 7

function stripLegacyOnbrandHandle(value) {
  if (!value?.trim()) return value
  return value
    .replace(/milena\.onbrand/gi, 'milena.uanabi')
    .replace(/milenaonbrand/gi, 'milenauanabi')
    .replace(/onbrand/gi, 'uanabi')
}

export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', field: 'instagram' },
  { key: 'tiktok', label: 'TikTok', field: 'tiktok' },
  { key: 'twitter', label: 'X (Twitter)', field: 'twitter' },
  { key: 'facebook', label: 'Facebook', field: 'facebook' },
  { key: 'youtube', label: 'YouTube', field: 'youtube' },
  { key: 'twitch', label: 'Twitch', field: 'twitch' },
]

export const DEFAULT_HOST_PROFILE = {
  fullName: DEFAULT_ACCOUNT_USER.fullName,
  displayName: '',
  avatarUrl: null,
  coverGradient: 'from-violet-200/70 via-pink-100/60 to-amber-50/80',
  location: HOST_LOCATION,
  categories: ['Viajes', 'Estilo de Vida'],
  instagram: 'celeste.uanabi',
  tiktok: 'celeste.uanabi',
  youtube: 'celeste.uanabi',
  twitch: '',
  twitter: 'celeste.uanabi',
  facebook: 'celeste.uanabi',
  whatsapp: '1123456789',
  pastBrandNames: [],
  socialMetrics: {
    totalFollowers: '24.5k',
    engagementPercent: '4.8',
    platformFollowers: {
      instagram: '18.2k',
      tiktok: '12.4k',
      twitter: '980',
      facebook: '340',
      youtube: '8.2k',
      twitch: '',
    },
  },
  bio: 'Creo contenido de viajes y documento recorridos por el mundo en camper, ruta y experiencias locales. Trabajo con marcas que buscan historias auténticas: activaciones en destino, sampling on-the-road y cobertura que surge del viaje. Ya produje experiencias con Red Bull y Samsung, con foco en engagement alto y una audiencia que sigue el recorrido en tiempo real.',
  validatedLinks: {
    instagram: false,
    tiktok: false,
  },
  successStories: [
    {
      id: 'story-demo-1',
      title: 'Roadtrip Islandia con activación Red Bull',
      referenceLink: '',
      evidencePhotos: [
        'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=800&q=80',
      ],
      brandNames: ['Red Bull'],
      attendance: '2.1M views en TikTok',
    },
    {
      id: 'story-demo-2',
      title: 'Cobertura Samsung Galaxy en festival al aire libre',
      referenceLink: '',
      evidencePhotos: [
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
      ],
      brandNames: ['Samsung'],
      attendance: '340k alcance en IG',
    },
  ],
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
  if (platform === 'youtube') return `https://youtube.com/@${handle}`
  if (platform === 'twitch') return `https://twitch.tv/${handle}`
  if (platform === 'twitter') return `https://x.com/${handle}`
  if (platform === 'facebook') return `https://facebook.com/${handle}`
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

export function loadStoredHostProfile() {
  try {
    const raw = localStorage.getItem(HOST_PROFILE_STORAGE_KEY)
    if (!raw) {
      return hydratePlatformFollowers({ ...DEFAULT_HOST_PROFILE, isConfigured: false })
    }
    const parsed = JSON.parse(raw)
    const { tagline: _legacyTagline, ...parsedWithoutTagline } = parsed
    const storedVersion = parsed._dataVersion ?? 1
    const merged = {
      ...DEFAULT_HOST_PROFILE,
      ...parsedWithoutTagline,
      isConfigured: Boolean(parsed.isConfigured),
    }

    if (storedVersion < HOST_PROFILE_DATA_VERSION) {
      if (storedVersion < 2) merged.bio = DEFAULT_HOST_PROFILE.bio
      if (storedVersion < 3) {
        merged.socialMetrics = {
          ...DEFAULT_HOST_PROFILE.socialMetrics,
          ...merged.socialMetrics,
          platformFollowers: {
            ...DEFAULT_HOST_PROFILE.socialMetrics.platformFollowers,
            ...merged.socialMetrics?.platformFollowers,
          },
        }
      }
      if (storedVersion < 4) {
        for (const { field } of SOCIAL_PLATFORMS) {
          if (merged[field]) merged[field] = stripLegacyOnbrandHandle(merged[field])
        }
      }
      if (storedVersion < 5) {
        merged.successStories = DEFAULT_HOST_PROFILE.successStories
      }
      if (storedVersion < 6) {
        merged.socialMetrics = {
          ...merged.socialMetrics,
          platformFollowers: {
            ...DEFAULT_HOST_PROFILE.socialMetrics.platformFollowers,
            ...merged.socialMetrics?.platformFollowers,
            tiktok:
              merged.socialMetrics?.platformFollowers?.tiktok?.trim() ||
              DEFAULT_HOST_PROFILE.socialMetrics.platformFollowers.tiktok,
          },
        }
      }
      if (storedVersion < 7) {
        merged.fullName = DEFAULT_HOST_PROFILE.fullName
        merged.bio = DEFAULT_HOST_PROFILE.bio
        merged.categories = DEFAULT_HOST_PROFILE.categories
        for (const { field } of SOCIAL_PLATFORMS) {
          merged[field] = DEFAULT_HOST_PROFILE[field]
        }
        merged.successStories = DEFAULT_HOST_PROFILE.successStories
        merged.socialMetrics = {
          ...DEFAULT_HOST_PROFILE.socialMetrics,
          platformFollowers: {
            ...DEFAULT_HOST_PROFILE.socialMetrics.platformFollowers,
          },
        }
      }
      merged._dataVersion = HOST_PROFILE_DATA_VERSION
      saveStoredHostProfile(merged)
    }

    return hydratePlatformFollowers(merged)
  } catch {
    return hydratePlatformFollowers({ ...DEFAULT_HOST_PROFILE, isConfigured: false })
  }
}

export function saveStoredHostProfile(profile) {
  try {
    const { tagline: _legacyTagline, ...profileWithoutTagline } = profile ?? {}
    localStorage.setItem(HOST_PROFILE_STORAGE_KEY, JSON.stringify(profileWithoutTagline))
  } catch {
    /* ignore */
  }
}

export function seedProfileFromAuth(profile, authUser) {
  if (!authUser) return profile
  const hasName = Boolean(profile.fullName?.trim() || profile.displayName?.trim())
  return {
    ...profile,
    fullName: hasName ? profile.fullName : (authUser.fullName ?? profile.fullName),
  }
}

export function validateProfileEssentials(form) {
  const errors = {}
  if (!form.fullName?.trim() && !form.displayName?.trim()) {
    errors.name = 'Ingresá tu nombre o el nombre de tu colectivo'
  }
  if (!form.whatsapp?.trim()) {
    errors.whatsapp = 'El WhatsApp comercial es indispensable para que las marcas te contacten'
  }
  if ((form.categories?.length ?? 0) === 0) {
    errors.tags = 'Seleccioná al menos un tag de identificación'
  }
  return errors
}

export function isProfileConfigured(profile) {
  return Boolean(profile?.isConfigured)
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

  const { tagline: _legacyTagline, ...formWithoutTagline } = form
  const { tagline: _profileTagline, ...profileWithoutTagline } = profile

  return {
    ...profileWithoutTagline,
    ...formWithoutTagline,
    fullName,
    displayName,
    location: form.location ?? HOST_LOCATION,
    categories: form.categories ?? profile.categories ?? [],
    socialMetrics: {
      ...(profile.socialMetrics ?? {}),
      ...(form.socialMetrics ?? {}),
      platformFollowers: {
        ...(profile.socialMetrics?.platformFollowers ?? {}),
        ...(form.socialMetrics?.platformFollowers ?? {}),
      },
    },
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

function hydratePlatformFollowers(profile) {
  const platformFollowers = {
    ...DEFAULT_HOST_PROFILE.socialMetrics.platformFollowers,
    ...profile?.socialMetrics?.platformFollowers,
  }

  for (const { key, field } of SOCIAL_PLATFORMS) {
    if (profile?.[field]?.trim() && !platformFollowers[key]?.trim()) {
      const fallback = DEFAULT_HOST_PROFILE.socialMetrics.platformFollowers[key]
      if (fallback?.trim()) platformFollowers[key] = fallback
    }
  }

  return {
    ...profile,
    socialMetrics: {
      ...DEFAULT_HOST_PROFILE.socialMetrics,
      ...profile?.socialMetrics,
      platformFollowers,
    },
  }
}

export function getPlatformFollowers(profile, platform) {
  const hydrated = hydratePlatformFollowers(profile ?? {})
  const value = hydrated.socialMetrics?.platformFollowers?.[platform]
  if (value?.trim()) return value.trim()
  if (platform === 'instagram' && hydrated.socialMetrics?.totalFollowers?.trim()) {
    return hydrated.socialMetrics.totalFollowers.trim()
  }
  return null
}

export function getConnectedSocialChannels(profile) {
  return SOCIAL_PLATFORMS.filter((platform) => profile?.[platform.field]?.trim()).map(
    (platform) => ({
      ...platform,
      handle: profile[platform.field],
      followers: getPlatformFollowers(profile, platform.key),
      verified: Boolean(profile?.validatedLinks?.[platform.key]),
      url: normalizeSocialUrl(platform.key, profile[platform.field]),
    }),
  )
}
