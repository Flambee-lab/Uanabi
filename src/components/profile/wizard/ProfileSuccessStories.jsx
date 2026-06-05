import { useState } from 'react'
import { Plus, Sparkles, Trash2, X } from 'lucide-react'
import { createEmptySuccessStory } from '../../../data/hostProfile'
import { ProfileField, profileInputClass } from './ProfileField'

export default function ProfileSuccessStories({ stories, onChange }) {
  const [brandDraft, setBrandDraft] = useState({})

  const updateStory = (id, patch) => {
    onChange(stories.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const addBrand = (storyId) => {
    const name = (brandDraft[storyId] ?? '').trim()
    if (!name) return
    const story = stories.find((s) => s.id === storyId)
    if (!story || story.brandNames.includes(name)) return
    updateStory(storyId, { brandNames: [...story.brandNames, name] })
    setBrandDraft((prev) => ({ ...prev, [storyId]: '' }))
  }

  const removeBrand = (storyId, name) => {
    const story = stories.find((s) => s.id === storyId)
    if (!story) return
    updateStory(storyId, { brandNames: story.brandNames.filter((n) => n !== name) })
  }

  return (
    <div className="space-y-6">
      {stories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/80 py-10 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-neutral-300" strokeWidth={1.5} />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Sumá al menos un evento pasado con marcas reales
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Esto valida tu trayectoria ante nuevos sponsors en Uanabi.
          </p>
        </div>
      )}

      {stories.map((story, index) => (
        <div
          key={story.id}
          className="space-y-5 rounded-[24px] border border-border-subtle bg-secondary/50 p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-foreground/80">Caso #{index + 1}</p>
            <button
              type="button"
              onClick={() => onChange(stories.filter((s) => s.id !== story.id))}
              className="text-muted-foreground transition hover:text-red-600"
              aria-label="Eliminar caso"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <ProfileField label="Título del evento pasado" required>
            <input
              className={profileInputClass}
              value={story.title}
              onChange={(e) => updateStory(story.id, { title: e.target.value })}
              placeholder="Ej: Festival Neon LAN 2025"
            />
          </ProfileField>

          <ProfileField
            label="Marcas que lo acompañaron"
            hint="Enter para agregar cada marca patrocinadora"
            required
          >
            <div className="flex gap-2">
              <input
                className={profileInputClass}
                value={brandDraft[story.id] ?? ''}
                onChange={(e) =>
                  setBrandDraft((prev) => ({ ...prev, [story.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addBrand(story.id)
                  }
                }}
                placeholder="Coca-Cola, Samsung..."
              />
              <button
                type="button"
                onClick={() => addBrand(story.id)}
                className="flex h-[42px] w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white hover:bg-secondary"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            {story.brandNames.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {story.brandNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 type-small font-semibold text-foreground/80"
                  >
                    {name}
                    <button type="button" onClick={() => removeBrand(story.id, name)}>
                      <X className="h-3 w-3" strokeWidth={2} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </ProfileField>

          <ProfileField label="Asistencia real" hint="Número verificable de personas" required>
            <input
              className={profileInputClass}
              value={story.attendance}
              onChange={(e) => updateStory(story.id, { attendance: e.target.value })}
              placeholder="Ej: 420 asistentes"
            />
          </ProfileField>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...stories, createEmptySuccessStory()])}
        className="flex w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-border bg-white py-4 text-xs font-bold text-foreground/80 transition hover:border-primary hover:text-foreground"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Agregar caso de éxito
      </button>
    </div>
  )
}
