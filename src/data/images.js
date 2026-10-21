/**
 * Public demo imagery served from the Unsplash CDN (free-to-use licence).
 * Every <SmartImage> falls back to generated Meridian artwork if a URL fails.
 */
export const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export const portrait = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=320&h=320&q=70&crop=faces`

export const IMAGES = {
  hero: unsplash('photo-1522202176988-66273c2fd55f', 1200),
  business: unsplash('photo-1552664730-d307ca884978', 1200),
  about: unsplash('photo-1517245386807-bb43f82c33c4', 1200),
  studying: unsplash('photo-1434030216411-0b793f4b4173', 1200),
}

/** Sample video clip used for video lessons (CC0 clip hosted by MDN). */
export const DEMO_VIDEO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
