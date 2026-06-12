import { useMemo } from 'react'
import { BadgeCheck, Calendar, ChevronRight, Infinity, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  getProfileCategories,
  getProfileDisplayName,
  getProfileInitial,
  HOST_LOCATION,
} from '../../data/hostProfile'
import {
  getEventPartnerBrands,
  getSelfReportedCollabBrands,
  getVerifiedPartnerBrands,
  getVerifiedPartnerEventCounts,
} from '../../utils/profileBrands'
import { splitEventsByTimeline } from '../../utils/hostEventBuckets'
import ProfileAvatar from './ProfileAvatar'
import ProfileHeroSocialGrid from './ProfileHeroSocialGrid'
import ProfileLinkedInCard from './ProfileLinkedInCard'
import ProfileSocialChannels from './ProfileSocialChannels'
import ProfileSocialContent from './ProfileSocialContent'
import SponsorBrandPill from './SponsorBrandPill'

function isPlatformEvent(event) {
  return Boolean(event?.id)
}

function PastEventRow({ event, brandCatalog, onSelectEvent }) {
  const partners = getEventPartnerBrands(event, brandCatalog)
  const dateLine = [event.date, event.time].filter(Boolean).join(' · ')
  const canOpenSheet = isPlatformEvent(event) && onSelectEvent

  return (
    <div className="flex items-start gap-4 border-b border-border-subtle py-4 first:pt-0 last:border-0">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
        <Calendar className="h-4 w-4" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        {canOpenSheet ? (
          <button
            type="button"
            onClick={() => onSelectEvent(event.id)}
            className="group inline-flex max-w-full items-center gap-1 text-left"
          >
            <span className="type-body font-semibold text-foreground transition group-hover:text-primary group-hover:underline">
              {event.title}
            </span>
            <ChevronRight
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:text-primary"
              strokeWidth={2.5}
              aria-hidden
            />
          </button>
        ) : (
          <p className="type-body font-semibold">{event.title}</p>
        )}
        <p className="type-body-muted mt-0.5">{dateLine}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {event.niche && (
            <Badge variant="secondary" className="font-normal">
              {event.niche}
            </Badge>
          )}
          {partners.map((brand) => (
            <SponsorBrandPill key={brand.id} brand={brand} verified />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProfileInternalView({
  profile,
  events = [],
  brands = [],
  onEdit,
  onSelectEvent,
}) {
  const fullName = getProfileDisplayName(profile)
  const initial = getProfileInitial(profile)
  const categories = getProfileCategories(profile)
  const successStories = (profile.successStories ?? []).filter((s) => s.title?.trim())
  const { past: pastEvents } = splitEventsByTimeline(events)

  const verifiedBrands = useMemo(
    () => getVerifiedPartnerBrands(events, brands),
    [events, brands],
  )

  const eventCounts = useMemo(
    () => getVerifiedPartnerEventCounts(events, brands),
    [events, brands],
  )

  const pastCollabBrands = useMemo(
    () => getSelfReportedCollabBrands(successStories, brands, verifiedBrands),
    [successStories, brands, verifiedBrands],
  )

  const headline =
    categories.length > 0 ? categories.join(' · ') : 'Host de eventos'

  const hasBrandChips = verifiedBrands.length > 0 || pastCollabBrands.length > 0

  return (
    <div className="uanabi-page overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 pb-14 pt-6 sm:px-10">
        <section className="uanabi-panel relative overflow-hidden px-5 pb-6 pt-5 sm:px-6 sm:pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <ProfileAvatar
                src={profile.avatarUrl}
                initial={initial}
                onEdit={() => onEdit?.('basic')}
              />

              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="type-title">{fullName}</h1>
                  {profile.isConfigured && (
                    <Badge variant="secondary" className="gap-1">
                      <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
                      Perfil verificado
                    </Badge>
                  )}
                </div>
                <p className="type-body mt-1">{headline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="type-small inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                    {profile.location || HOST_LOCATION}
                  </span>
                  <Badge variant="secondary" className="font-normal">
                    Host
                  </Badge>
                </div>
              </div>
            </div>

            <ProfileHeroSocialGrid
              profile={profile}
              onEdit={onEdit ? () => onEdit('channels') : undefined}
            />
          </div>
        </section>

        <div className="mt-4 space-y-4">
          <ProfileLinkedInCard
            title="Acerca de"
            onEdit={() => onEdit?.('basic')}
            bodyClassName="pt-0"
          >
            {profile.bio?.trim() ? (
              <p className="type-body whitespace-pre-line">{profile.bio}</p>
            ) : (
              <p className="type-body-muted">
                Contá quién sos y qué tipo de eventos organizás. Las marcas lo leen antes de
                responder tu propuesta.
              </p>
            )}
          </ProfileLinkedInCard>

          {hasBrandChips && (
            <ProfileLinkedInCard
              title="Collabs"
              onEdit={() => onEdit?.('collaborations')}
              bodyClassName="pt-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                {verifiedBrands.map((brand) => (
                  <SponsorBrandPill
                    key={brand.id}
                    brand={brand}
                    verified
                    eventCount={eventCounts.get(brand.id)}
                  />
                ))}
                {pastCollabBrands.map((brand) => (
                  <SponsorBrandPill key={brand.id ?? brand.name} brand={brand} />
                ))}
              </div>
              {verifiedBrands.length > 0 && (
                <p className="type-small mt-3 inline-flex flex-wrap items-center gap-1">
                  <Infinity
                    className="h-3 w-3 shrink-0 text-primary"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span>Patrocinio confirmado en tus eventos de Uanabi.</span>
                </p>
              )}
            </ProfileLinkedInCard>
          )}

          <ProfileLinkedInCard
            title="Redes sociales"
            onEdit={() => onEdit?.('channels')}
            bodyClassName="pt-0"
          >
            <ProfileSocialChannels profile={profile} />
          </ProfileLinkedInCard>

          <ProfileLinkedInCard
            title="Destacado"
            onEdit={() => onEdit?.('channels')}
            bodyClassName="pt-0"
          >
            <p className="type-body-muted mb-4">
              Tu contenido reciente — para que las marcas entiendan tu estilo antes de proponerte.
            </p>
            <ProfileSocialContent profile={profile} />
          </ProfileLinkedInCard>

          {pastEvents.length > 0 && (
            <ProfileLinkedInCard
              title="Experiencia"
              onEdit={() => onEdit?.('collaborations')}
              bodyClassName="pt-0"
            >
              {pastEvents.slice(0, 6).map((event) => (
                <PastEventRow
                  key={event.id}
                  event={event}
                  brandCatalog={brands}
                  onSelectEvent={onSelectEvent}
                />
              ))}
            </ProfileLinkedInCard>
          )}
        </div>
      </div>
    </div>
  )
}
