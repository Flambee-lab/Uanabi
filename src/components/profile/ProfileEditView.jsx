import { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin, MessageCircle } from 'lucide-react'
import {
  createEmptyCollaboration,
  getProfileDisplayName,
  getProfileInitial,
  HOST_LOCATION,
  HOST_LOCATION_HINT,
  mergeProfileForSave,
  PROFILE_EDIT_SECTIONS,
  validateProfileEssentials,
} from '../../data/hostProfile'
import ProfileAvatar from './ProfileAvatar'
import IdentityTagPills from './IdentityTagPills'
import ProfileAnchorTabs from './ProfileAnchorTabs'
import ProfileEditActions from './ProfileEditActions'
import ProfileEditCollaborations from './ProfileEditCollaborations'
import ProfileEditSocialChannels from './ProfileEditSocialChannels'
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
    validatedLinks: { ...(profile.validatedLinks ?? {}) },
    successStories: stories.length > 0 ? stories : [createEmptyCollaboration()],
  }
}

export default function ProfileEditView({ profile, onSave, onBack, initialSection }) {
  const [draft, setDraft] = useState(() => initDraft(profile))
  const [activeTab, setActiveTab] = useState(PROFILE_EDIT_SECTIONS[0].id)
  const [errors, setErrors] = useState({})
  const sectionRefs = useRef({})
  const avatarInputRef = useRef(null)
  const scrollRootRef = useRef(null)
  const draftAvatarRef = useRef(null)

  useEffect(() => {
    setDraft(initDraft(profile))
  }, [profile])

  // Liberar el blob del avatar si se descarta la edición sin guardar
  useEffect(() => {
    return () => {
      if (
        draftAvatarRef.current?.startsWith('blob:') &&
        draftAvatarRef.current !== profile.avatarUrl
      ) {
        URL.revokeObjectURL(draftAvatarRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }))

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
    draftAvatarRef.current = url
    setDraft((prev) => {
      if (prev.avatarUrl?.startsWith('blob:') && prev.avatarUrl !== profile.avatarUrl) {
        URL.revokeObjectURL(prev.avatarUrl)
      }
      return { ...prev, avatarUrl: url }
    })
  }

  const handleSave = () => {
    const validationErrors = validateProfileEssentials(draft)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      scrollToSection('basic')
      return
    }
    draftAvatarRef.current = null
    onSave?.(mergeProfileForSave(profile, draft))
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
              className="type-small font-semibold text-muted-foreground transition hover:text-foreground"
            >
              ← Volver al perfil
            </button>
            <h1 className="type-display mt-2">Editar perfil</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ProfileEditActions onCancel={onBack} onSave={handleSave} />
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
                <h2 className="type-heading">Información básica</h2>
                <p className="mt-1 type-small text-muted-foreground">
                  Última actualización:{' '}
                  {profile.joinedAt
                    ? new Date(profile.joinedAt).toLocaleDateString('es-AR')
                    : 'Pendiente'}
                </p>
              </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-border-subtle bg-white p-6 sm:p-8">
              <ProfileField label="Nombre completo" required>
                <input
                  className={profileEditInputClass}
                  value={draft.fullName}
                  onChange={(e) => update({ fullName: e.target.value })}
                  placeholder="Celeste Salas"
                />
                {errors.name && (
                  <p className="type-small text-destructive">{errors.name}</p>
                )}
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
                {errors.whatsapp && (
                  <p className="type-small text-destructive">{errors.whatsapp}</p>
                )}
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
                {errors.tags && (
                  <p className="type-small text-destructive">{errors.tags}</p>
                )}
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
            <h2 className="type-heading mb-2">Redes sociales</h2>
            <p className="type-small mb-6 text-muted-foreground">
              Verificá tus cuentas para que las marcas confíen en tu alcance real.
            </p>
            <div className="rounded-2xl border border-border-subtle bg-white p-6 sm:p-8">
              <ProfileEditSocialChannels
                draft={draft}
                profile={profile}
                onUpdate={update}
              />
            </div>
          </section>

          <section
            id="collaborations"
            ref={(el) => {
              sectionRefs.current.collaborations = el
            }}
            className="scroll-mt-28"
          >
            <h2 className="type-heading mb-2">Colaboraciones pasadas</h2>
            <p className="mb-6 type-small text-muted-foreground">
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

      <div className="border-t border-border-subtle bg-white">
        <div className="mx-auto flex max-w-6xl justify-end px-6 py-6 sm:px-10 lg:px-10">
          <ProfileEditActions onCancel={onBack} onSave={handleSave} />
        </div>
      </div>
    </div>
  )
}
