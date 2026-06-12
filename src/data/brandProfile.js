export const BRAND_PROFILE_STORAGE_KEY = 'uanabi_brand_profile'

/** Código demo para verificación de correo corporativo (modo local) */
export const BRAND_MOCK_VERIFICATION_CODE = '123456'

export const BRAND_CATEGORIES = [
  'Bebidas',
  'Deportes',
  'Alimentos',
  'Tecnología',
  'Moda',
  'Entretenimiento',
  'Gastronomía',
  'Lifestyle',
]

export const DEFAULT_REJECTION_TEMPLATES = {
  stock:
    '¡Hola! Muchas gracias por la propuesta para tu evento. En este momento tenemos la agenda de patrocinios completa para estas fechas y no podemos asistir, pero nos encantaría que nos tengas en cuenta para tus próximos proyectos. ¡Gracias por hacernos parte de la comunidad UANABI!',
  audiencia:
    '¡Hola! Agradecemos mucho que hayas pensado en nosotros. Por el momento priorizamos eventos con una escala de audiencia distinta a la de tu propuesta, pero nos encantaría reconectar cuando tengas fechas futuras. ¡Éxitos con la producción!',
  nicho:
    '¡Hola! Gracias por contactarnos. En esta ocasión el nicho del evento no se alinea con nuestras líneas de patrocinio actuales, pero valoramos tu propuesta y te invitamos a escribirnos en futuros proyectos más afines a nuestra marca.',
}

export const BRAND_EVENT_NICHES = [
  'Gaming',
  'Esports',
  'Música',
  'Moda',
  'Gastronomía',
  'Lifestyle',
  'Deportes',
  'Arte',
]

export const DEFAULT_BRAND_PRODUCTS = [
  { id: 'prod-1', nombre: 'Energética Classic', descripcion: 'Lata 473ml — cafeína y taurina' },
  { id: 'prod-2', nombre: 'Isotónica Zero', descripcion: 'Botella 500ml — sin azúcar' },
]

export const DEFAULT_BRAND_PROFILE = {
  role: 'brand',
  marcaNombre: 'VitalSport',
  razonSocial: '',
  cuit: '',
  website: 'https://vitalsport.com',
  category: 'Bebidas',
  corporateEmail: '',
  corporateEmailVerified: false,
  contactName: '',
  contactRole: '',
  contactPhone: '',
  description: '',
  logoUrl: null,
  instagram: '',
  tiktok: '',
  linkedin: '',
  contactWhatsapp: '',
  products: DEFAULT_BRAND_PRODUCTS,
  preferredNiches: ['Gaming', 'Deportes'],
  verificationSubmitted: false,
  verificationStatus: null,
  isVerified: false,
  templateStock: DEFAULT_REJECTION_TEMPLATES.stock,
  templateAudiencia: DEFAULT_REJECTION_TEMPLATES.audiencia,
  templateNicho: DEFAULT_REJECTION_TEMPLATES.nicho,
}

export function loadStoredBrandProfile() {
  try {
    const raw = sessionStorage.getItem(BRAND_PROFILE_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_BRAND_PROFILE }
    return { ...DEFAULT_BRAND_PROFILE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_BRAND_PROFILE }
  }
}

export function saveStoredBrandProfile(profile) {
  sessionStorage.setItem(BRAND_PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

/** Wizard completado — puede acceder al panel aunque esté en revisión */
export function isBrandOnboardingComplete(profile) {
  return Boolean(profile?.verificationSubmitted || profile?.isVerified)
}

/** Marca aprobada por el equipo UANABI */
export function isBrandProfileVerified(profile) {
  return Boolean(profile?.isVerified)
}

export function isBrandPendingReview(profile) {
  return profile?.verificationStatus === 'pending_review' && !profile?.isVerified
}

export function extractWebsiteDomain(website) {
  const raw = (website ?? '').trim()
  if (!raw) return null
  try {
    const url = raw.startsWith('http') ? raw : `https://${raw}`
    return new URL(url).hostname.replace(/^www\./i, '').toLowerCase()
  } catch {
    return null
  }
}

export function extractEmailDomain(email) {
  const parts = (email ?? '').trim().toLowerCase().split('@')
  return parts.length === 2 ? parts[1] : null
}

export function corporateEmailMatchesWebsite(email, website) {
  const webDomain = extractWebsiteDomain(website)
  const emailDomain = extractEmailDomain(email)
  if (!webDomain || !emailDomain) return false
  return emailDomain === webDomain || emailDomain.endsWith(`.${webDomain}`)
}

export function isValidCorporateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email ?? '').trim())
}
