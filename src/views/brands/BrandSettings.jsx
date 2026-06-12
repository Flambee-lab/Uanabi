import { useRef, useState } from 'react'
import {
  AtSign,
  BadgeCheck,
  Clock,
  ImagePlus,
  Lightbulb,
  MessageCircle,
  Package,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '../../context/AuthProvider'
import { BrandPanelShell, BRAND_INPUT_CLASS } from '../../components/brands/BrandPanelShell'
import { TEMPLATE_OPTIONS } from '../../components/brands/DeclineTemplateModal'
import { BRAND_CATEGORIES, BRAND_EVENT_NICHES } from '../../data/brandProfile'
import Toast from '../../components/ui/Toast'

const PROFILE_SECTIONS = [
  { id: 'identidad', label: 'Identidad' },
  { id: 'canales', label: 'Canales y contacto' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'preferencias', label: 'Preferencias' },
  { id: 'templates', label: 'Templates' },
]

const TEMPLATE_META = {
  templateStock: {
    title: 'Falta de stock / agenda completa',
    hint: 'Cuando no podés patrocinar por capacidad operativa o fechas.',
  },
  templateAudiencia: {
    title: 'Audiencia insuficiente',
    hint: 'Cuando el volumen o perfil de público no calza con tu estrategia.',
  },
  templateNicho: {
    title: 'Incompatibilidad de nicho',
    hint: 'Cuando la categoría del evento no se alinea con tu marca.',
  },
}

function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-bold text-slate-800">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

export default function BrandSettings() {
  const { brandProfile, saveBrandProfile, logout } = useAuth()
  const logoInputRef = useRef(null)
  const sectionRefs = useRef({})
  const [activeTab, setActiveTab] = useState(PROFILE_SECTIONS[0].id)
  const [form, setForm] = useState({
    marcaNombre: brandProfile?.marcaNombre ?? '',
    website: brandProfile?.website ?? '',
    category: brandProfile?.category ?? 'Bebidas',
    description: brandProfile?.description ?? '',
    logoUrl: brandProfile?.logoUrl ?? null,
    instagram: brandProfile?.instagram ?? '',
    tiktok: brandProfile?.tiktok ?? '',
    linkedin: brandProfile?.linkedin ?? '',
    contactWhatsapp: brandProfile?.contactWhatsapp ?? '',
    products: brandProfile?.products ?? [],
    preferredNiches: brandProfile?.preferredNiches ?? [],
    templateStock: brandProfile?.templateStock ?? '',
    templateAudiencia: brandProfile?.templateAudiencia ?? '',
    templateNicho: brandProfile?.templateNicho ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const marcaNombre = brandProfile?.marcaNombre ?? 'VitalSport'

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }))

  const scrollToSection = (id) => {
    setActiveTab(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setField('logoUrl', reader.result)
    reader.readAsDataURL(file)
  }

  const addProduct = () => {
    setField('products', [
      ...form.products,
      { id: `prod-${Date.now()}`, nombre: '', descripcion: '' },
    ])
  }

  const updateProduct = (id, key, value) => {
    setField(
      'products',
      form.products.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    )
  }

  const removeProduct = (id) => {
    setField('products', form.products.filter((p) => p.id !== id))
  }

  const toggleNiche = (niche) => {
    setField(
      'preferredNiches',
      form.preferredNiches.includes(niche)
        ? form.preferredNiches.filter((n) => n !== niche)
        : [...form.preferredNiches, niche],
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const cleanProducts = form.products.filter((p) => p.nombre.trim())
      await saveBrandProfile({ ...brandProfile, ...form, products: cleanProducts })
      setField('products', cleanProducts)
      setToast({ title: 'Perfil guardado', message: 'Los cambios quedaron actualizados.' })
    } finally {
      setSaving(false)
    }
  }

  const verificationBadge = brandProfile?.isVerified
    ? { label: 'Marca verificada', className: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: BadgeCheck }
    : brandProfile?.verificationSubmitted
      ? { label: 'Verificación en revisión', className: 'border-amber-200 bg-amber-50 text-amber-800', icon: Clock }
      : { label: 'Pendiente de validación', className: 'border-slate-200 bg-slate-50 text-slate-600', icon: Clock }

  const BadgeIcon = verificationBadge.icon

  return (
    <BrandPanelShell brandName={marcaNombre} activeNav="settings" onLogout={logout}>
      <div className="space-y-0">
        {/* Header estilo perfil de host: identidad + acciones */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="group relative shrink-0"
              aria-label="Cambiar logo"
            >
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt=""
                  className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                  <ImagePlus className="h-6 w-6 text-slate-400" />
                </span>
              )}
              <span className="absolute inset-0 hidden items-center justify-center rounded-2xl bg-black/40 text-[10px] font-bold text-white group-hover:flex">
                Cambiar
              </span>
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleLogoChange}
            />
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">
                {form.marcaNombre || 'Perfil de marca'}
              </h1>
              <span
                className={cn(
                  'mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                  verificationBadge.className,
                )}
              >
                <BadgeIcon className="h-3.5 w-3.5" />
                {verificationBadge.label}
              </span>
            </div>
          </div>
          <Button
            type="button"
            className="rounded-full bg-emerald-500 px-6 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
            disabled={saving}
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>

        {/* Anchor tabs estilo perfil de host */}
        <div className="sticky top-0 z-10 -mx-1 mt-5 border-b border-slate-200 bg-slate-50 px-1">
          <div className="flex gap-1 overflow-x-auto">
            {PROFILE_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={cn(
                  'shrink-0 border-b-2 px-3.5 py-3 text-xs font-bold transition',
                  activeTab === id
                    ? 'border-emerald-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            {/* Identidad */}
            <section
              id="identidad"
              ref={(el) => {
                sectionRefs.current.identidad = el
              }}
              className="scroll-mt-20"
            >
              <h2 className="font-display text-lg font-bold text-slate-900">Identidad</h2>
              <p className="mt-1 text-xs text-slate-500">
                Esta información la ven los hosts cuando interactúan con tu marca.
              </p>
              <div className="mt-5 space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
                <Field label="Nombre de la marca" htmlFor="bp-nombre">
                  <input
                    id="bp-nombre"
                    className={BRAND_INPUT_CLASS}
                    value={form.marcaNombre}
                    onChange={(e) => setField('marcaNombre', e.target.value)}
                  />
                </Field>

                <Field
                  label="Descripción corta"
                  htmlFor="bp-desc"
                  hint="Aparece en las propuestas que respondés y en tu perfil público."
                >
                  <textarea
                    id="bp-desc"
                    className={`${BRAND_INPUT_CLASS} min-h-[90px] resize-y`}
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    placeholder="Bebidas energéticas e isotónicas para eventos deportivos y culturales."
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Sitio web" htmlFor="bp-web">
                    <input
                      id="bp-web"
                      type="url"
                      className={BRAND_INPUT_CLASS}
                      value={form.website}
                      onChange={(e) => setField('website', e.target.value)}
                    />
                  </Field>
                  <Field label="Categoría" htmlFor="bp-cat">
                    <select
                      id="bp-cat"
                      className={BRAND_INPUT_CLASS}
                      value={form.category}
                      onChange={(e) => setField('category', e.target.value)}
                    >
                      {BRAND_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </section>

            {/* Canales y contacto */}
            <section
              id="canales"
              ref={(el) => {
                sectionRefs.current.canales = el
              }}
              className="scroll-mt-20"
            >
              <h2 className="font-display text-lg font-bold text-slate-900">Canales y contacto</h2>
              <p className="mt-1 text-xs text-slate-500">
                Tus redes oficiales y el WhatsApp donde coordinás los tratos.
              </p>
              <div className="mt-5 space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { key: 'instagram', label: 'Instagram', placeholder: 'vitalsport.ar' },
                    { key: 'tiktok', label: 'TikTok', placeholder: 'vitalsport' },
                    { key: 'linkedin', label: 'LinkedIn', placeholder: 'vitalsport' },
                  ].map((social) => (
                    <Field key={social.key} label={social.label} htmlFor={`bp-${social.key}`}>
                      <div className="relative">
                        <AtSign className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id={`bp-${social.key}`}
                          className={`${BRAND_INPUT_CLASS} pl-10`}
                          value={form[social.key]}
                          onChange={(e) => setField(social.key, e.target.value.replace('@', ''))}
                          placeholder={social.placeholder}
                        />
                      </div>
                    </Field>
                  ))}
                </div>

                <Field
                  label="WhatsApp comercial"
                  htmlFor="bp-wsp"
                  hint="Los hosts te contactan acá cuando aceptás un trato."
                >
                  <div className="relative">
                    <MessageCircle className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="bp-wsp"
                      type="tel"
                      className={`${BRAND_INPUT_CLASS} pl-10`}
                      value={form.contactWhatsapp}
                      onChange={(e) => setField('contactWhatsapp', e.target.value)}
                      placeholder="11 2345 6789"
                    />
                  </div>
                </Field>
              </div>
            </section>

            {/* Catálogo */}
            <section
              id="catalogo"
              ref={(el) => {
                sectionRefs.current.catalogo = el
              }}
              className="scroll-mt-20"
            >
              <h2 className="font-display text-lg font-bold text-slate-900">
                Catálogo de productos
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Los productos que tu marca puede ofrecer en patrocinios. Los hosts los verán al
                armar propuestas.
              </p>
              <div className="mt-5 space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
                {form.products.length === 0 && (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-sm text-slate-400">
                    Todavía no cargaste productos.
                  </p>
                )}
                {form.products.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3"
                  >
                    <span className="mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Package className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <input
                        className={BRAND_INPUT_CLASS}
                        value={product.nombre}
                        onChange={(e) => updateProduct(product.id, 'nombre', e.target.value)}
                        placeholder={`Producto ${index + 1} — ej: Energética Classic`}
                        aria-label="Nombre del producto"
                      />
                      <input
                        className={BRAND_INPUT_CLASS}
                        value={product.descripcion ?? ''}
                        onChange={(e) => updateProduct(product.id, 'descripcion', e.target.value)}
                        placeholder="Descripción breve (presentación, tamaño...)"
                        aria-label="Descripción del producto"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="mt-3 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={addProduct}
                >
                  <Plus className="h-4 w-4" />
                  Agregar producto
                </Button>
              </div>
            </section>

            {/* Preferencias */}
            <section
              id="preferencias"
              ref={(el) => {
                sectionRefs.current.preferencias = el
              }}
              className="scroll-mt-20"
            >
              <h2 className="font-display text-lg font-bold text-slate-900">
                Preferencias de patrocinio
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Qué tipo de eventos le interesan a tu marca. Ayuda a filtrar propuestas afines.
              </p>
              <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
                <div className="flex flex-wrap gap-2">
                  {BRAND_EVENT_NICHES.map((niche) => {
                    const selected = form.preferredNiches.includes(niche)
                    return (
                      <button
                        key={niche}
                        type="button"
                        onClick={() => toggleNiche(niche)}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium transition',
                          selected
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-400/20'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200',
                        )}
                      >
                        {niche}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Templates */}
            <section
              id="templates"
              ref={(el) => {
                sectionRefs.current.templates = el
              }}
              className="scroll-mt-20"
            >
              <h2 className="font-display text-lg font-bold text-slate-900">
                Templates de rechazo amigable
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Los mensajes que enviás al declinar una propuesta. El host los ve en su panel y
                podés ajustarlos antes de enviar cada uno.
              </p>
              <div className="mt-5 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
                {TEMPLATE_OPTIONS.map((opt) => {
                  const meta = TEMPLATE_META[opt.field]
                  return (
                    <div key={opt.id}>
                      <label htmlFor={opt.field} className="block">
                        <span className="text-sm font-bold text-slate-900">{meta.title}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{meta.hint}</span>
                      </label>
                      <textarea
                        id={opt.field}
                        className={`${BRAND_INPUT_CLASS} mt-3 min-h-[110px] resize-y`}
                        value={form[opt.field]}
                        onChange={(e) => setField(opt.field, e.target.value)}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Sidebar estilo perfil de host */}
          <aside className="space-y-4 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Estado de la cuenta
              </p>
              <span
                className={cn(
                  'mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
                  verificationBadge.className,
                )}
              >
                <BadgeIcon className="h-3.5 w-3.5" />
                {verificationBadge.label}
              </span>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {brandProfile?.corporateEmail && (
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    Correo corporativo {brandProfile?.corporateEmailVerified ? 'verificado' : 'cargado'}
                  </li>
                )}
                {form.website && (
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    Sitio web oficial cargado
                  </li>
                )}
                {form.products.filter((p) => p.nombre?.trim()).length > 0 && (
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {form.products.filter((p) => p.nombre?.trim()).length} producto
                    {form.products.filter((p) => p.nombre?.trim()).length !== 1 ? 's' : ''} en
                    catálogo
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-200/70 bg-sky-50/50 p-5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                <Lightbulb className="h-4 w-4 text-sky-600" />
                Tips para recibir mejores propuestas
              </p>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-sky-950/75">
                <li>
                  Un catálogo completo ayuda a que los hosts pidan productos y cantidades realistas.
                </li>
                <li>
                  Las preferencias de nicho filtran las propuestas que no van con tu marca.
                </li>
                <li>
                  Personalizá los templates de rechazo: mantienen la relación con el host para
                  futuros eventos.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {toast && (
        <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />
      )}
    </BrandPanelShell>
  )
}
