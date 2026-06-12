/**
 * Contenido demo de redes del host (MVP — sin API de Instagram/TikTok).
 * Se muestra en el perfil interno como preview del feed.
 */

const IMG_HQ = 'auto=format&fit=crop&w=1200&q=90'

const IMG = {
  iceland: `https://images.unsplash.com/photo-1504829857797-ddff29c27927?${IMG_HQ}`,
  camper: `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?${IMG_HQ}`,
  coast: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?${IMG_HQ}`,
  mountains: `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?${IMG_HQ}`,
  city: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?${IMG_HQ}`,
  sunset: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?${IMG_HQ}`,
}

/** Clip HQ subido por el equipo (public/videos). */
const VIDEO_HQ = '/videos/iceland-camper.mp4'

export const HOST_SOCIAL_FEED = {
  instagram: [
    {
      id: 'ig-1',
      imageUrl: IMG.iceland,
      caption: 'Primera parada: cascadas y camper en la ring road',
      likes: '3.4k',
      type: 'post',
    },
    {
      id: 'ig-2',
      imageUrl: IMG.sunset,
      caption: 'Amanecer en la costa antes de seguir ruta',
      likes: '2.1k',
      type: 'post',
    },
    {
      id: 'ig-3',
      imageUrl: IMG.iceland,
      videoUrl: VIDEO_HQ,
      startAt: 2,
      caption: 'Behind the scenes — armando el camper',
      likes: '4.8k',
      type: 'reel',
    },
    {
      id: 'ig-4',
      imageUrl: IMG.mountains,
      caption: 'Vista desde el techo del camper, día 4',
      likes: '1.9k',
      type: 'post',
    },
    {
      id: 'ig-5',
      imageUrl: IMG.camper,
      caption: 'La comunidad que me acompaña en cada tramo',
      likes: '2.6k',
      type: 'post',
    },
    {
      id: 'ig-6',
      imageUrl: IMG.city,
      caption: 'Recap en stories — próximo destino en camino',
      likes: '890',
      type: 'story',
    },
  ],
  tiktok: [
    {
      id: 'tt-1',
      imageUrl: IMG.iceland,
      videoUrl: VIDEO_HQ,
      startAt: 2,
      caption: '10 días en camper dando la vuelta a Islandia',
      likes: '8.1k',
      type: 'reel',
    },
    {
      id: 'tt-2',
      imageUrl: IMG.iceland,
      videoUrl: VIDEO_HQ,
      startAt: 9,
      caption: 'Amanecer en la ring road',
      likes: '12k',
      type: 'reel',
    },
    {
      id: 'tt-3',
      imageUrl: IMG.iceland,
      videoUrl: VIDEO_HQ,
      startAt: 18,
      caption: 'Documentando el viaje — día 6',
      likes: '5.6k',
      type: 'reel',
    },
    {
      id: 'tt-4',
      imageUrl: IMG.iceland,
      videoUrl: VIDEO_HQ,
      startAt: 26,
      caption: 'Última parada antes de volver',
      likes: '3.2k',
      type: 'reel',
    },
  ],
}

export function getActiveSocialPlatforms(profile) {
  const platforms = []
  if (profile?.instagram?.trim()) platforms.push('instagram')
  if (profile?.tiktok?.trim()) platforms.push('tiktok')
  return platforms
}

/** Mezcla contenido de todas las redes con feed conectado (máx. 6). */
export function getProfileFeaturedPosts(profile, limit = 6) {
  const platforms = getActiveSocialPlatforms(profile)
  const buckets = platforms.map((platform) =>
    (HOST_SOCIAL_FEED[platform] ?? []).map((post) => ({ ...post, platform })),
  )

  const merged = []
  let index = 0
  while (merged.length < limit && buckets.some((bucket) => bucket[index])) {
    for (const bucket of buckets) {
      if (merged.length >= limit) break
      if (bucket[index]) merged.push(bucket[index])
    }
    index += 1
  }

  return merged
}

/** Posts recientes para preview del hero (prioriza Instagram). */
export function getProfileSocialPreviewPosts(profile, limit = 4) {
  return {
    posts: getProfileFeaturedPosts(profile, limit),
    platform: null,
  }
}

