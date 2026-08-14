/**
 * Devotional artwork. Public domain only — this repo is public and the images
 * ship inside it. Licence checks are recorded in `public/art/CREDITS.md`.
 */
const base = import.meta.env.BASE_URL

export interface DeviArtwork {
  id: 'shyamala' | 'saraswati'
  src: string
  alt: string
  title: string
  caption: string
}

export const DEVI_ARTWORKS: readonly DeviArtwork[] = [
  {
    id: 'shyamala',
    src: `${base}art/shyamala-devi.jpg`,
    alt: 'Śyāmalā Devī seated with a veena and her green parrot',
    title: 'Śyāmalā Devī',
    caption: 'Rāja Mātaṅgī with the veena · Thanjavur, c. 1820',
  },
  {
    id: 'saraswati',
    src: `${base}art/saraswati-ravivarma.jpg`,
    alt: 'Sarasvatī playing the veena beside a river',
    title: 'Sarasvatī',
    caption: 'Raja Ravi Varma, 1894',
  },
]

export function artworkById(id: string | null | undefined): DeviArtwork {
  return DEVI_ARTWORKS.find((a) => a.id === id) ?? DEVI_ARTWORKS[0]
}

/** Lay the chosen image faintly behind every page. */
export function applyDeviWatermark(id: string | null | undefined): void {
  document.documentElement.style.setProperty(
    '--devi-watermark',
    `url("${artworkById(id).src}")`,
  )
}
