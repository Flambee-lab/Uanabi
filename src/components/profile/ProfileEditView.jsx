import { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin, MessageCircle, Pencil } from 'lucide-react'
import {
  createEmptyCollaboration,
  getProfileDisplayName,
  getProfileInitial,
  HOST_LOCATION,
  HOST_LOCATION_HINT,
  mergeProfileForSave,
  PROFILE_EDIT_SECTIONS,
} from '../../data/hostProfile'
import IdentityTagPills from './IdentityTagPills'
import ProfileAnchorTabs from './ProfileAnchorTabs'
import ProfileEditCollaborations from './ProfileEditCollaborations'
import ProfileSuggestionsSidebar from './ProfileSuggestionsSidebar'
import { ProfileField, profileEditInputClass } from './wizard/ProfileField'

function initDraft(profile) {
  const stories = profile.successStories ?? []
  return {
    fullName: profile.fullName ?? getProfileDisplayName(profile),
    displayName: profile.displayName ?? '',
    tagline: profile.tagline ?? '',
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? null,
    location: profile.location ?? HOST_LOCATION,
    categories: profile.categories?.length ? [...profile.categories] : [],
    whatsapp: profile.whatsapp ?? '',
    instagram: profile.instagram ?? '',
    tiktok: profile.tiktok ?? '',
    socialMetrics: {
      totalFollowers: profile.socialMetrics?.totalFollowers ?? '',
      engagementPercent: profile.socialMetrics?.engagementPercent ?? '',
    },
    successStories: stories.length > 0 ? stories : [createEmptyCollaboration()],
  }
}

export default function ProfileEditView({ profile, onSave, onPreview, onReopenWizard }) {
  const [draft, setDraft] = useState(() => initDraft(profile))
  const [activeTab, setActiveTab] = useState(PROFILE_EDIT_SECTIONS[0].id)
  const sectionRefs = useRef({})
  const avatarInputRef = useRef(null)
  const scrollRootRef = useRef(null)

  useEffect(() => {
    setDraft(initDraft(profile))
  }, [profile])

  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }))
  const updateMetrics = (patch) =>
    setDraft((prev) => ({
      ...prev,
      socialMetrics: { ...prev.socialMetrics, ...patch },
    }))

  const scrollToSection = useCallback((id) => {
    setActiveTab(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const root = scrollRootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveTab(visible.target.id)
      },
      { root, rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] },
    )

    PROFILE_EDIT_SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleAvatar = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setDraft((prev) => {
      if (prev.avatarUrl?.startsWith('blob:')) URL.revokeObjectURL(prev.avatarUrl)
      return { ...prev, avatarUrl: url }
    })
  }

  const persistDraft = () => mergeProfileForSave(profile, draft)

  const handleSave = () => {
    onSave?.(persistDraft())
  }

  const handlePreview = () => {
    onSave?.(persistDraft())
    onPreview?.()
  }

  const displayInitial = getProfileInitial({ ...profile, fullName: draft.fullName })

  return (
    <div ref={scrollRootRef} className="min-h-full overflow-y-auto bg-[#fafafa]">
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <p className="text-xs font-medium text-neutral-400">
              <span className="text-neutral-500">Home</span>
              <span className="mx-1.5 text-neutral-300">›</span>
              <span className="text-neutral-600">Edit Profile</span>
            </p>
            <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
              Edit Profile
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onReopenWizard && (
              <button
                type="button"
                onClick={onReopenWizard}
                className="text-xs font-semibold text-neutral-400 hover:text-neutral-700"
              >
                Wizard guiado
              </button>
            )}
            <button
              type="button"
              onClick={handlePreview}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 transition hover:border-neutral-300"
            >
              Preview Public Profile
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800"
            >
              Guardar cambios
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <ProfileAnchorTabs activeId={activeTab} onSelect={scrollToSection} />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-3 lg:px-10">
        <div className="space-y-16 lg:col-span-2">
          <section
            id="basic"
            ref={(el) => {
              sectionRefs.current.basic = el
            }}
            className="scroll-mt-28"
          >
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatar(e.target.files?.[0])}
                />
                {draft.avatarUrl ? (
                  <img
                    src={draft.avatarUrl}
                    alt=""
                    className="h-28 w-28 rounded-2xl object-cover shadow-sm ring-1 ring-neutral-100"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-neutral-900 font-display text-3xl font-black text-white shadow-sm">
                    {displayInitial}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:text-neutral-900"
                  aria-label="Editar foto"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-bold text-neutral-900">Basic Information</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Última actualización:{' '}
                  {profile.joinedAt
                    ? new Date(profile.joinedAt).toLocaleDateString('es-AR')
                    : 'Pendiente'}
                </p>
              </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8">
              <ProfileField label="Full Name" required>
                <input
                  className={profileEditInputClass}
                  value={draft.fullName}
                  onChange={(e) => update({ fullName: e.target.value })}
                  placeholder="Milena Belén Miranda"
                />
              </ProfileField>
              <ProfileField
                label="Nombre público del Host / colectivo"
                hint="Cómo aparecés en convocatorias y búsquedas de sponsors"
              >
                <input
                  className={profileEditInputClass}
                  value={draft.displayName}
                  onChange={(e) => update({ displayName: e.target.value })}
                  placeholder="Neon Collective"
                />
              </ProfileField>
              <ProfileField label="WhatsApp comercial" required>
                <div className="relative">
                  <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    className={`${profileEditInputClass} pl-10`}
                    value={draft.whatsapp}
                    onChange={(e) => update({ whatsapp: e.target.value })}
                    placeholder="11 2345 6789"
                    type="tel"
                  />
                </div>
              </ProfileField>
              <ProfileField label="Ubicación">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    className={`${profileEditInputClass} cursor-not-allowed bg-neutral-100 pl-10 text-neutral-600`}
                    value={HOST_LOCATION}
                    readOnly
                  />
                </div>
                <p className="text-[11px] text-neutral-500">{HOST_LOCATION_HINT}</p>
              </ProfileField>
              <ProfileField label="Tags de identificación" required>
                <IdentityTagPills
                  selected={draft.categories}
                  onChange={(categories) => update({ categories })}
                />
              </ProfileField>
              <ProfileField label="Bio" hint="250–500 caracteres recomendados para la vista pública">
                <textarea
                  className={`${profileEditInputClass} min-h-[120px] resize-y`}
                  value={draft.bio}
                  onChange={(e) => update({ bio: e.target.value })}
                  placeholder="Contá quién sos, qué eventos producís y qué tipo de sponsors buscás..."
                  rows={5}
                />
                <p className="text-[10px] text-neutral-400">{draft.bio.length} caracteres</p>
              </ProfileField>
              <ProfileField label="Tagline">
                <input
                  className={profileEditInputClass}
                  value={draft.tagline}
                  onChange={(e) => update({ tagline: e.target.value })}
                  placeholder="Experiencias gaming y cultura digital en CABA"
                />
              </ProfileField>
            </div>
          </section>

          <section
            id="channels"
            ref={(el) => {
              sectionRefs.current.channels = el
            }}
            className="scroll-mt-28"
          >
            <h2 className="mb-6 font-display text-lg font-bold text-neutral-900">
              Channels & Metrics
            </h2>
            <div className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8">
              <ProfileField label="Instagram">
                <input
                  className={profileEditInputClass}
                  value={draft.instagram}
                  onChange={(e) => update({ instagram: e.target.value })}
                  placeholder="@usuario o URL completa"
                />
              </ProfileField>
              <ProfileField label="TikTok">
                <input
                  className={profileEditInputClass}
                  value={draft.tiktok}
                  onChange={(e) => update({ tiktok: e.target.value })}
                  placeholder="@usuario o URL completa"
                />
              </ProfileField>
              <div className="grid gap-6 sm:grid-cols-2">
                <ProfileField label="Alcance estimado (seguidores)" required>
                  <input
                    className={profileEditInputClass}
                    value={draft.socialMetrics.totalFollowers}
                    onChange={(e) => updateMetrics({ totalFollowers: e.target.value })}
                    placeholder="24500"
                    inputMode="numeric"
                  />
                </ProfileField>
                <ProfileField label="% Engagement aprox.">
                  <input
                    className={profileEditInputClass}
                    value={draft.socialMetrics.engagementPercent}
                    onChange={(e) => updateMetrics({ engagementPercent: e.target.value })}
                    placeholder="4.2%"
                  />
                </ProfileField>
              </div>
            </div>
          </section>

          <section
            id="collaborations"
            ref={(el) => {
              sectionRefs.current.collaborations = el
            }}
            className="scroll-mt-28"
          >
            <h2 className="mb-2 font-display text-lg font-bold text-neutral-900">
              Past Collaborations
            </h2>
            <p className="mb-6 text-xs text-neutral-500">
              Agregaste {draft.successStories.filter((s) => s.title?.trim()).length} colaboración
              {draft.successStories.filter((s) => s.title?.trim()).length !== 1 ? 'es' : ''}.
            </p>
            <ProfileEditCollaborations
              items={draft.successStories}
              onChange={(successStories) => update({ successStories })}
              showBrands
            />
          </section>
        </div>

        <div className="lg:col-span-1">
          <ProfileSuggestionsSidebar />
        </div>
      </div>
    </div>
  )
}
