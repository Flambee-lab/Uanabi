import { useRef } from 'react'
import { ImagePlus, Link2, Plus, Trash2 } from 'lucide-react'
import { createEmptyCollaboration } from '../../../data/hostProfile'
import { ProfileField, profileInputClass } from './ProfileField'

export default function ProfileCollaborations({ items, onChange, error }) {
  const fileRefs = useRef({})

  const updateItem = (id, patch) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const handleEvidence = (id, fileList) => {
    const names = Array.from(fileList).map((f) => f.name)
    const item = items.find((i) => i.id === id)
    if (!item) return
    updateItem(id, {
      evidencePhotos: [...(item.evidencePhotos ?? []), ...names].slice(0, 6),
    })
  }

  const removeEvidence = (id, name) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    updateItem(id, {
      evidencePhotos: (item.evidencePhotos ?? []).filter((n) => n !== name),
    })
  }

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="space-y-5 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-neutral-700">Colaboración #{index + 1}</p>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i.id !== item.id))}
                className="text-neutral-400 transition hover:text-red-600"
                aria-label="Eliminar colaboración"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>

          <ProfileField label="Título de la colaboración" required>
            <input
              className={profileInputClass}
              value={item.title}
              onChange={(e) => updateItem(item.id, { title: e.target.value })}
              placeholder="Ej: Patrocinio Red Bull — Neon LAN 2025"
            />
          </ProfileField>

          <ProfileField
            label="Link de referencia / Drive"
            hint="Portfolio, carpeta compartida o post que respalde la colaboración"
          >
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                className={`${profileInputClass} pl-10`}
                value={item.referenceLink ?? ''}
                onChange={(e) => updateItem(item.id, { referenceLink: e.target.value })}
                placeholder="https://drive.google.com/..."
                type="url"
              />
            </div>
          </ProfileField>

          <div className="space-y-2">
            <input
              ref={(el) => {
                fileRefs.current[item.id] = el
              }}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleEvidence(item.id, e.target.files)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileRefs.current[item.id]?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white py-3.5 text-xs font-bold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              <ImagePlus className="h-4 w-4" strokeWidth={2} />
              + Añadir fotos de evidencia
            </button>
            {(item.evidencePhotos ?? []).length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {item.evidencePhotos.map((name) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] font-semibold text-neutral-600"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removeEvidence(item.id, name)}
                      className="text-neutral-400 hover:text-red-600"
                      aria-label={`Quitar ${name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, createEmptyCollaboration()])}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white py-4 text-xs font-bold text-neutral-700 transition hover:border-neutral-900"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Agregar otra colaboración
      </button>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}
