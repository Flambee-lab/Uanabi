import { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  createEmptyCollaboration,
  getProfileDisplayName,
  getProfileInitial,
  HOST_LOCATION,
  HOST_LOCATION_HINT,
  mergeProfileForSave,
  PROFILE_EDIT_SECTIONS,
  SOCIAL_PLATFORMS,
} from '../../data/hostProfile'
import ProfileAvatar from './ProfileAvatar'
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
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? null,
    location: profile.location ?? HOST_LOCATION,
    categories: profile.categories?.length ? [...profile.categories] : [],
    whatsapp: profile.whatsapp ?? '',
    instagram: profile.instagram ?? '',
    tiktok: profile.tiktok ?? '',
    youtube: profile.youtube ?? '',
    twitch: profile.twitch ?? '',
    twitter: profile.twitter ?? '',
    facebook: profile.facebook ?? '',
    socialMetrics: {
      totalFollowers: profile.socialMetrics?.totalFollowers ?? '',
      engagementPercent: profile.socialMetrics?.engagementPercent ?? '',
      platformFollowers: {
        instagram: profile.socialMetrics?.platformFollowers?.instagram ?? '',
        tiktok: profile.socialMetrics?.platformFollowers?.tiktok ?? '',
        twitter: profile.socialMetrics?.platformFollowers?.twitter ?? '',
        facebook: profile.socialMetrics?.platformFollowers?.facebook ?? '',
        youtube: profile.socialMetrics?.platformFollowers?.youtube ?? '',
        twitch: profile.socialMetrics?.platformFollowers?.twitch ?? '',
      },
    },
    successStories: stories.length > 0 ? stories : [createEmptyCollaboration()],
  }
}

export default function ProfileEditView({ profile, onSave, onBack, initialSection }) {
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
  const updatePlatformFollowers = (platform, value) =>
    setDraft((prev) => ({
      ...prev,
      socialMetrics: {
        ...prev.socialMetrics,
        platformFollowers: {
          ...prev.socialMetrics.platformFollowers,
          [platform]: value,
        },
      },
    }))

  const scrollToSection = useCallback((id) => {
    setActiveTab(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    if (!initialSection) return
    const frame = requestAnimationFrame(() => scrollToSection(initialSection))
    return () => cancelAnimationFrame(frame)
  }, [initialSection, scrollToSection])

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

  const displayInitial = getProfileInitial({ ...profile, fullName: draft.fullName })

  return (
    <div ref={scrollRootRef} className="uanabi-page overflow-y-auto">
      <div className="border-b border-border-subtle bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            >
              ← Volver al perfil
            </button>
            <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Editar perfil
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSave}>
              Guardar y volver
            </Button>
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
              <div className="shrink-0">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatar(e.target.files?.[0])}
                />
                <ProfileAvatar
                  src={draft.avatarUrl}
                  initial={displayInitial}
                  onEdit={() => avatarInputRef.current?.click()}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-bold text-foreground">Basic Information</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Última actualización:{' '}
                  {profile.joinedAt
                    ? new Date(profile.joinedAt).toLocaleDateString('es-AR')
                    : 'Pendiente'}
                </p>
              </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-border-subtle bg-white p-6 sm:p-8">
              <ProfileField label="Full Name" required>
                <input
                  className={profileEditInputClass}
                  value={draft.fullName}
                  onChange={(e) => update({ fullName: e.target.value })}
                  placeholder="Celeste Rojas"
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
                  <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className={`${profileEditInputClass} cursor-not-allowed bg-secondary pl-10 text-muted-foreground`}
                    value={HOST_LOCATION}
                    readOnly
                  />
                </div>
                <p className="type-small text-muted-foreground">{HOST_LOCATION_HINT}</p>
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
                <p className="type-small text-muted-foreground">{draft.bio.length} caracteres</p>
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
            <h2 className="mb-6 font-display text-lg font-bold text-foreground">
              Channels & Metrics
            </h2>
            <div className="space-y-6 rounded-2xl border border-border-subtle bg-white p-6 sm:p-8">
              {SOCIAL_PLATFORMS.map((platform) => (
                <div key={platform.key} className="space-y-4 border-b border-border-subtle/80 pb-6 last:border-0 last:pb-0">
                  <ProfileField label={platform.label}>
                    <input
                      className={profileEditInputClass}
                      value={draft[platform.field] ?? ''}
                      onChange={(e) => update({ [platform.field]: e.target.value })}
                      placeholder="@usuario o URL completa"
                    />
                  </ProfileField>
                  {draft[platform.field]?.trim() && (
                    <ProfileField
                      label={`Seguidores en ${platform.label}`}
                      hint="Estimado por ahora — se verificará con la API de cada red"
                    >
                      <input
                        className={profileEditInputClass}
                        value={draft.socialMetrics.platformFollowers?.[platform.key] ?? ''}
                        onChange={(e) => updatePlatformFollowers(platform.key, e.target.value)}
                        placeholder="18.2k"
                        inputMode="text"
                      />
                    </ProfileField>
                  )}
                </div>
              ))}
              <ProfileField label="% Engagement aprox.">
                <input
                  className={profileEditInputClass}
                  value={draft.socialMetrics.engagementPercent}
                  onChange={(e) => updateMetrics({ engagementPercent: e.target.value })}
                  placeholder="4.2%"
                />
              </ProfileField>
            </div>
          </section>

          <section
            id="collaborations"
            ref={(el) => {
              sectionRefs.current.collaborations = el
            }}
            className="scroll-mt-28"
          >
            <h2 className="mb-2 font-display text-lg font-bold text-foreground">
              Past Collaborations
            </h2>
            <p className="mb-6 text-xs text-muted-foreground">
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
