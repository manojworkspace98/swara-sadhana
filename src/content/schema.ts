import { z } from 'zod'
import type { Sthayi, SwaraLetter } from '../engine/types'
import { RAGAS } from './ragas'
import { TALAS } from './talas'

/**
 * One written swara. `duration` is counted in aksharas at the first speed;
 * `buildTimeline` divides it down when the lesson is sung at a higher kalam,
 * so a line's notation never changes between speeds — only its clock does.
 */
export interface NotationElement {
  swara: SwaraLetter | null
  octave: Sthayi
  /** Aksharas at kalam 1. A karvai is simply a duration above 1. */
  duration: number
  /** True on the re-articulated second note of a janta pair. */
  janta?: boolean
  sahitya?: string
  rest?: boolean
}

/** One printed line of notation — normally one avartana of the tala. */
export interface NotationLine {
  id: string
  elements: NotationElement[]
  avartanas: number
  label?: string
}

/**
 * A speed. The tala tempo stays where it is and the note density doubles, so
 * `suggestedBpm` is an akshara tempo and stays comparable across the kalams.
 */
export interface TempoStage {
  kalam: 1 | 2 | 3
  notesPerAkshara: 1 | 2 | 4
  suggestedBpm: [number, number]
  required: boolean
}

export interface MasteryCriteria {
  pitchAccuracyPct: number
  centsTolerance: number
  rhythmAccuracyPct: number
  syllableTimingPct?: number
  cleanPasses: number
}

export type LessonKind =
  | 'voice-basic'
  | 'sarali'
  | 'janta'
  | 'dhatu'
  | 'sthayi'
  | 'alankara'
  | 'geetam'
  | 'swarajati'
  | 'varnam'
  | 'kriti'
  | 'project-section'

export interface Lesson {
  id: string
  level: number
  ordinal: number
  kind: LessonKind
  title: string
  subtitle?: string
  ragaId: string
  talaId: string
  notation: NotationLine[]
  speeds: TempoStage[]
  prerequisites: string[]
  mastery: MasteryCriteria
  theoryCardIds: string[]
  generated: boolean
}

const swaraLetterSchema = z.enum(['S', 'R', 'G', 'M', 'P', 'D', 'N'])
const sthayiSchema = z.union([z.literal(-1), z.literal(0), z.literal(1)])

export const notationElementSchema = z.object({
  swara: swaraLetterSchema.nullable(),
  octave: sthayiSchema,
  duration: z.number().positive(),
  janta: z.boolean().optional(),
  sahitya: z.string().optional(),
  rest: z.boolean().optional(),
})

export const notationLineSchema = z.object({
  id: z.string().min(1),
  elements: z.array(notationElementSchema).min(1),
  avartanas: z.number().int().positive(),
  label: z.string().optional(),
})

export const tempoStageSchema = z.object({
  kalam: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  notesPerAkshara: z.union([z.literal(1), z.literal(2), z.literal(4)]),
  suggestedBpm: z.tuple([z.number().positive(), z.number().positive()]),
  required: z.boolean(),
})

export const masteryCriteriaSchema = z.object({
  pitchAccuracyPct: z.number().min(0).max(100),
  centsTolerance: z.number().positive(),
  rhythmAccuracyPct: z.number().min(0).max(100),
  syllableTimingPct: z.number().min(0).max(100).optional(),
  cleanPasses: z.number().int().positive(),
})

export const lessonKindSchema = z.enum([
  'voice-basic',
  'sarali',
  'janta',
  'dhatu',
  'sthayi',
  'alankara',
  'geetam',
  'swarajati',
  'varnam',
  'kriti',
  'project-section',
])

export const lessonSchema = z.object({
  id: z.string().min(1),
  level: z.number().int().min(0),
  ordinal: z.number().int().min(0),
  kind: lessonKindSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ragaId: z.string().min(1),
  talaId: z.string().min(1),
  notation: z.array(notationLineSchema),
  speeds: z.array(tempoStageSchema).min(1),
  prerequisites: z.array(z.string()),
  mastery: masteryCriteriaSchema,
  theoryCardIds: z.array(z.string()),
  generated: z.boolean(),
})

/** Also a compile-time guard: the zod shape and the interface cannot drift. */
function asLesson(parsed: z.infer<typeof lessonSchema>): Lesson {
  return parsed
}

export type ValidationResult = { ok: true } | { ok: false; problems: string[] }

const NOTES_PER_AKSHARA: Record<1 | 2 | 3, 1 | 2 | 4> = { 1: 1, 2: 2, 3: 4 }

/**
 * The gate that catches encoding mistakes before a lesson ever reaches a
 * student: a line whose durations do not fill its avartanas is unsingable, and
 * a swara the raga does not contain is a typo every time.
 */
export function validateLesson(lesson: unknown): ValidationResult {
  const parsed = lessonSchema.safeParse(lesson)
  if (!parsed.success) {
    return {
      ok: false,
      problems: parsed.error.issues.map((issue) => {
        const where = issue.path.length > 0 ? issue.path.join('.') : '(root)'
        return `${where}: ${issue.message}`
      }),
    }
  }

  const value = asLesson(parsed.data)
  const problems: string[] = []

  const tala = TALAS[value.talaId]
  if (!tala) problems.push(`unknown tala "${value.talaId}"`)

  const raga = RAGAS[value.ragaId]
  if (!raga) problems.push(`unknown raga "${value.ragaId}"`)

  for (const stage of value.speeds) {
    const expected = NOTES_PER_AKSHARA[stage.kalam]
    if (stage.notesPerAkshara !== expected) {
      problems.push(
        `kalam ${stage.kalam} must carry ${expected} notes per akshara, not ${stage.notesPerAkshara}`,
      )
    }
    if (stage.suggestedBpm[0] > stage.suggestedBpm[1]) {
      problems.push(`kalam ${stage.kalam} has a reversed tempo range`)
    }
  }

  const seenLineIds = new Set<string>()
  for (const line of value.notation) {
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
      if (el.swara !== null && el.rest === true) {
        problems.push(`${at} is marked as a rest but carries a swara`)
      }
      if (el.swara !== null && raga && !raga.letters.includes(el.swara)) {
        problems.push(`${at} uses ${el.swara}, which ${raga.name} does not contain`)
      }
    }
  }

  return problems.length === 0 ? { ok: true } : { ok: false, problems }
}
