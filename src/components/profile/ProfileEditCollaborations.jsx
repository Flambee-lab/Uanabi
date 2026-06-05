import { useState } from 'react'
import { Link2, Plus, Trash2, X } from 'lucide-react'
import { createEmptyCollaboration } from '../../data/hostProfile'
import ProfileEvidenceUpload from './ProfileEvidenceUpload'
import { ProfileField, profileEditInputClass } from './wizard/ProfileField'

function normalizeEvidence(item) {
  const raw = item.evidencePhotos ?? []
  return raw.map((entry, i) => {
    if (typeof entry === 'string') {
      return { id: `legacy-${i}`, name: entry, previewUrl: null }
    }
    return entry
  })
}

export default function ProfileEditCollaborations({ items, onChange, showBrands = false }) {
  const [brandDraft, setBrandDraft] = useState({})

  const updateItem = (id, patch) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const addBrand = (itemId) => {
    const name = (brandDraft[itemId] ?? '').trim()
    if (!name) return
    const item = items.find((i) => i.id === itemId)
    if (!item || item.brandNames?.includes(name)) return
    updateItem(itemId, { brandNames: [...(item.brandNames ?? []), name] })
    setBrandDraft((prev) => ({ ...prev, [itemId]: '' }))
  }

  const removeBrand = (itemId, name) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return
    updateItem(itemId, {
      brandNames: (item.brandNames ?? []).filter((n) => n !== name),
    })
  }

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="space-y-5 rounded-2xl border border-border-subtle bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">Colaboración #{index + 1}</p>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i.id !== item.id))}
                className="text-muted-foreground transition hover:text-red-600"
                aria-label="Eliminar"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>

          <ProfileField label="Título de la colaboración" required>
            <input
              className={profileEditInputClass}
              value={item.title}
              onChange={(e) => updateItem(item.id, { title: e.target.value })}
              placeholder="Ej: Patrocinio Red Bull — Neon LAN 2025"
            />
          </ProfileField>

          {showBrands && (
            <ProfileField
              label="Marcas asociadas"
              hint="Enter para agregar cada marca patrocinadora"
            >
              <div className="flex gap-2">
                <input
                  className={profileEditInputClass}
                  value={brandDraft[item.id] ?? ''}
                  onChange={(e) =>
                    setBrandDraft((prev) => ({ ...prev, [item.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addBrand(item.id)
                    }
                  }}
                  placeholder="Red Bull, Samsung..."
                />
                <button
                  type="button"
                  onClick={() => addBrand(item.id)}
                  className="flex h-[42px] w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white hover:bg-secondary"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              {(item.brandNames ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.brandNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 type-small font-semibold text-foreground/80"
                    >
                      {name}
                      <button type="button" onClick={() => removeBrand(item.id, name)}>
                        <X className="h-3 w-3" strokeWidth={2} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </ProfileField>
          )}

          <ProfileField label="Link de respaldo / Drive">
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={`${profileEditInputClass} pl-10`}
                value={item.referenceLink ?? ''}
                onChange={(e) => updateItem(item.id, { referenceLink: e.target.value })}
                placeholder="https://drive.google.com/..."
                type="url"
              />
            </div>
          </ProfileField>

          <ProfileField label="Fotos de evidencia" hint="Arrastrá o cargá imágenes del intercambio con la marca">
            <ProfileEvidenceUpload
              photos={normalizeEvidence(item)}
              onChange={(evidencePhotos) => updateItem(item.id, { evidencePhotos })}
            />
          </ProfileField>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, createEmptyCollaboration()])}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-white py-4 text-xs font-bold text-foreground/80 transition hover:border-primary"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Agregar otra colaboración
      </button>
    </div>
  )
}
