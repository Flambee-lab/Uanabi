import { useRef, useState } from 'react'
import { AtSign, ImagePlus, MessageCircle, Package, Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '../../context/AuthProvider'
import { BrandPanelShell, BRAND_INPUT_CLASS } from '../../components/brands/BrandPanelShell'
import { TEMPLATE_OPTIONS } from '../../components/brands/DeclineTemplateModal'
import { BRAND_CATEGORIES, BRAND_EVENT_NICHES } from '../../data/brandProfile'
import Toast from '../../components/ui/Toast'

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-bold text-slate-800">
        {label}
      </label>
      {children}
    </div>
  )
}

const TEMPLATE_META = {
  templateStock: {
    title: 'Template 1 — Falta de stock / agenda completa',
    hint: 'Cuando no podés patrocinar por capacidad operativa o fechas.',
  },
  templateAudiencia: {
    title: 'Template 2 — Audiencia insuficiente',
    hint: 'Cuando el volumen o perfil de público no calza con tu estrategia.',
  },
  templateNicho: {
    title: 'Template 3 — Incompatibilidad de nicho',
    hint: 'Cuando la categoría del evento no se alinea con tu marca.',
  },
}

export default function BrandSettings() {
  const { brandProfile, saveBrandProfile, logout } = useAuth()
  const logoInputRef = useRef(null)
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

  return (
    <BrandPanelShell brandName={marcaNombre} activeNav="settings" onLogout={logout}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">
              Perfil de marca
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Quién sos, qué productos ofrecés y cómo respondés a los hosts.
            </p>
          </div>
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold',
              brandProfile?.isVerified
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-800',
            )}
          >
            {brandProfile?.isVerified
              ? 'Marca verificada'
              : brandProfile?.verificationSubmitted
                ? 'Verificación en revisión'
                : 'Pendiente de validación'}
          </span>
        </div>

        <SectionCard
          title="Identidad"
          description="Esta información la ven los hosts cuando interactúan con tu marca."
        >
          <div className="space-y-4">
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
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
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
              <div className="min-w-0 flex-1">
                <Field label="Nombre de la marca" htmlFor="bp-nombre">
                  <input
                    id="bp-nombre"
                    className={BRAND_INPUT_CLASS}
                    value={form.marcaNombre}
                    onChange={(e) => setField('marcaNombre', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <Field label="Descripción corta" htmlFor="bp-desc">
              <textarea
                id="bp-desc"
                className={`${BRAND_INPUT_CLASS} min-h-[80px] resize-y`}
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

            <Field label="WhatsApp comercial" htmlFor="bp-wsp">
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
        </SectionCard>

        <SectionCard
          title="Catálogo de productos"
          description="Los productos que tu marca puede ofrecer en patrocinios. Los hosts los verán al armar propuestas."
        >
          <div className="space-y-3">
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
        </SectionCard>

        <SectionCard
          title="Preferencias de patrocinio"
          description="Qué tipo de eventos le interesan a tu marca. Ayuda a filtrar propuestas afines."
        >
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
        </SectionCard>

        <SectionCard
          title="Templates de rechazo amigable"
          description="Los mensajes que enviás al declinar una propuesta. El host los ve en su panel."
        >
          <div className="space-y-5">
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
        </SectionCard>

        <div className="sticky bottom-4 z-10">
          <Button
            type="button"
            className="w-full rounded-full bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 sm:w-auto sm:px-8"
            disabled={saving}
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando…' : 'Guardar perfil'}
          </Button>
        </div>
      </div>

      {toast && (
        <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />
      )}
    </BrandPanelShell>
  )
}
