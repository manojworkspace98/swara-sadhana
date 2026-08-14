import { z } from 'zod'
import { RAGAS } from './ragas'
import { TALAS } from './talas'
import {
  notationLineSchema,
  type Lesson,
  type LessonKind,
  type NotationLine,
  type ValidationResult,
} from './schema'

/**
 * Where a piece's notation came from.
 *
 * Carnatic notation is not one fixed text. The same keerthana is written
 * differently by different schools, and every printed version is somebody's
 * patantara rather than the composition itself. So a song in this app must say
 * whose version it is teaching, and the app shows that to the singer. A piece
 * with no source is a piece nobody can check, and this app will not carry one.
 */
export interface PatantaraSource {
  sourceName: string
  url: string
  /** The school or lineage as the source itself describes it. */
  school: string
  encodedBy: string
  /** True once a human has compared this encoding against the source. */
  verified: boolean
  notes?: string
}

export type SectionKind =
  | 'pallavi'
  | 'anupallavi'
  | 'charanam'
  | 'muktayi-swara'
  | 'chittaswara'
  | 'jati'
  | 'madhyamakala'

export interface SongSection {
  id: string
  kind: SectionKind
  label: string
  lines: NotationLine[]
}

export interface Song {
  id: string
  title: string
  composer: string
  language: 'sanskrit' | 'telugu' | 'kannada' | 'tamil'
  ragaId: string
  talaId: string
  sections: SongSection[]
  source: PatantaraSource
}

export const patantaraSourceSchema = z.object({
  sourceName: z.string().min(1),
  url: z.string().url(),
  school: z.string().min(1),
  encodedBy: z.string().min(1),
  verified: z.boolean(),
  notes: z.string().optional(),
})

export const sectionKindSchema = z.enum([
  'pallavi',
  'anupallavi',
  'charanam',
  'muktayi-swara',
  'chittaswara',
  'jati',
  'madhyamakala',
])

export const songSectionSchema = z.object({
  id: z.string().min(1),
  kind: sectionKindSchema,
  label: z.string().min(1),
  lines: z.array(notationLineSchema).min(1),
})

export const songSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  composer: z.string().min(1),
  language: z.enum(['sanskrit', 'telugu', 'kannada', 'tamil']),
  ragaId: z.string().min(1),
  talaId: z.string().min(1),
  sections: z.array(songSectionSchema).min(1),
  source: patantaraSourceSchema,
})

/** Also a compile-time guard: the zod shape and the interface cannot drift. */
function asSong(parsed: z.infer<typeof songSchema>): Song {
  return parsed
}

/**
 * The same gate the varisai pass, applied to a hand-encoded piece.
 *
 * Hand encoding is where mistakes enter: a dropped karvai leaves a line that
 * cannot close, and a mistyped letter puts a swara in the piece that its raga
 * has no name for. Both are caught here rather than by a confused singer.
 */
export function validateSong(song: unknown): ValidationResult {
  const parsed = songSchema.safeParse(song)
  if (!parsed.success) {
    return {
      ok: false,
      problems: parsed.error.issues.map((issue) => {
        const where = issue.path.length > 0 ? issue.path.join('.') : '(root)'
        return `${where}: ${issue.message}`
      }),
    }
  }

  const value = asSong(parsed.data)
  const problems: string[] = []

  const tala = TALAS[value.talaId]
  if (!tala) problems.push(`unknown tala "${value.talaId}"`)

  const raga = RAGAS[value.ragaId]
  if (!raga) problems.push(`unknown raga "${value.ragaId}"`)

  const seenSectionIds = new Set<string>()
  const seenLineIds = new Set<string>()

  for (const section of value.sections) {
    if (seenSectionIds.has(section.id)) problems.push(`duplicate section id "${section.id}"`)
    seenSectionIds.add(section.id)

    for (const line of section.lines) {
      if (seenLineIds.has(line.id)) problems.push(`duplicate line id "${line.id}"`)
      seenLineIds.add(line.id)

      if (tala) {
        const sum = line.elements.reduce((total, el) => total + el.duration, 0)
        const wanted = line.avartanas * tala.aksharaCount
        if (Math.abs(sum - wanted) > 1e-9) {
          problems.push(
            `line "${line.id}" spans ${sum} aksharas but claims ${line.avartanas} avartana(s) of ${tala.aksharaCount} (${wanted})`,
          )
        }
      }

      for (let i = 0; i < line.elements.length; i += 1) {
        const el = line.elements[i]
        const at = `line "${line.id}" element ${i + 1}`
        if (el.swara === null && el.rest !== true) {
          problems.push(`${at} has no swara and is not marked as a rest`)
        }
        if (el.swara !== null && raga && !raga.letters.includes(el.swara)) {
          problems.push(`${at} uses ${el.swara}, which ${raga.name} does not contain`)
        }
      }
    }
  }

  return problems.length === 0 ? { ok: true } : { ok: false, problems }
}

export function sectionAksharas(section: SongSection): number {
  return section.lines.reduce(
    (total, line) => total + line.elements.reduce((sum, el) => sum + el.duration, 0),
    0,
  )
}

export function sectionHasSahitya(section: SongSection): boolean {
  return section.lines.some((line) => line.elements.some((el) => el.sahitya))
}

/**
 * Mastery for a sung piece.
 *
 * A keerthana asks for more than a varisai does, and asks for it in a different
 * currency: the notes are fewer and slower, so accuracy expectations rise, and
 * the words have to land on the beat, which the swara exercises never tested.
 */
const SUNG_MASTERY: Record<string, { pitch: number; rhythm: number; syllable: number }> = {
  geetam: { pitch: 85, rhythm: 85, syllable: 75 },
  swarajati: { pitch: 86, rhythm: 86, syllable: 78 },
  varnam: { pitch: 88, rhythm: 88, syllable: 80 },
  kriti: { pitch: 88, rhythm: 85, syllable: 80 },
  'project-section': { pitch: 90, rhythm: 88, syllable: 85 },
}

export interface SongLessonOptions {
  level: number
  kind: Extract<LessonKind, 'geetam' | 'swarajati' | 'varnam' | 'kriti' | 'project-section'>
  startOrdinal: number
  theoryCardIds?: string[]
  /** Lessons the first section waits for — usually the piece before this one. */
  prerequisites?: string[]
}

/**
 * Break a piece into one lesson per section.
 *
 * Nobody learns a keerthana whole. It arrives pallavi first, and a section is
 * only opened once the one before it holds together, which is what the
 * prerequisite chain below encodes.
 */
export function lessonsForSong(song: Song, options: SongLessonOptions): Lesson[] {
  const gates = SUNG_MASTERY[options.kind] ?? SUNG_MASTERY.kriti

  return song.sections.map((section, index) => {
    const id = `${song.id}.${section.id}`
    const previous = song.sections[index - 1]

    return {
      id,
      level: options.level,
      ordinal: options.startOrdinal + index,
      kind: options.kind,
      title: song.title,
      subtitle: section.label,
      ragaId: song.ragaId,
      talaId: song.talaId,
      notation: section.lines,
      // A sung line is taken slowly first and only then at speed; the third
      // kalam belongs to the varisai, not to a keerthana.
      speeds: [
        { kalam: 1, notesPerAkshara: 1, suggestedBpm: [40, 60], required: true },
        { kalam: 2, notesPerAkshara: 2, suggestedBpm: [40, 60], required: false },
      ],
      prerequisites: previous ? [`${song.id}.${previous.id}`] : (options.prerequisites ?? []),
      mastery: {
        pitchAccuracyPct: gates.pitch,
        centsTolerance: 35,
        rhythmAccuracyPct: gates.rhythm,
        ...(sectionHasSahitya(section) ? { syllableTimingPct: gates.syllable } : {}),
        cleanPasses: 3,
      },
      theoryCardIds: options.theoryCardIds ?? [],
      generated: false,
    }
  })
}
