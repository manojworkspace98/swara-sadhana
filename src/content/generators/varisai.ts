import type { Sthayi, SwaraLetter } from '../../engine/types'
import type {
  Lesson,
  LessonKind,
  MasteryCriteria,
  NotationElement,
  NotationLine,
  TempoStage,
} from '../schema'
import { TALAS } from '../talas'
import {
  ALANKARA_ELEMENTS,
  DHATU_ELEMENTS,
  JANTA_ELEMENTS,
  KEEZHSTHAYI_ELEMENTS,
  MELSTHAYI_ELEMENTS,
  SARALI_ELEMENTS,
} from '../sources/authentic'

/**
 * The beginner curriculum, generated rather than hand-typed.
 *
 * Every exercise here is in Mayamalavagowla and — apart from the alankaras,
 * which exist to teach the seven talas — in adi tala. The patterns are written
 * as short token strings so a teacher can read and correct them in place; the
 * machinery around them (fitting a pattern to whole avartanas, marking janta
 * repeats, chaining prerequisites) is what the tests pin down.
 *
 * Token grammar: a letter S R G M P D N, or `-` for a rest; a trailing `'`
 * raises it to the tara sthayi and a trailing `,` drops it to the mandra; a
 * trailing `*n` holds it for n aksharas instead of one. So `S'*4` is a tara Sa
 * held for four aksharas.
 */

const RAGA_ID = 'mayamalavagowla'

const TOKEN = /^([SRGMPDN-])([',]?)(?:\*(\d+))?$/

function parseToken(token: string): NotationElement {
  const match = TOKEN.exec(token)
  if (!match) throw new Error(`unreadable notation token "${token}"`)
  const [, head, mark, held] = match
  const octave: Sthayi = mark === "'" ? 1 : mark === ',' ? -1 : 0
  const duration = held === undefined ? 1 : Number(held)
  if (head === '-') return { swara: null, octave, duration, rest: true }
  return { swara: head as SwaraLetter, octave, duration }
}

export function parsePattern(source: string): NotationElement[] {
  return source.trim().split(/\s+/).filter(Boolean).map(parseToken)
}

function totalAksharas(elements: readonly NotationElement[]): number {
  return elements.reduce((sum, el) => sum + el.duration, 0)
}

/**
 * Round a pattern up to whole avartanas by holding its last note.
 *
 * Several traditional patterns are built from cells that do not divide the
 * cycle — a run of five-note cells does not land on an eight-akshara bar. The
 * cycle still has to close, and the way it closes in practice is a karvai on
 * the final note, so that is what this does rather than inventing extra swaras.
 */
export function fitToAvartanas(
  elements: NotationElement[],
  aksharaCount: number,
): NotationElement[] {
  if (elements.length === 0) return elements
  const total = totalAksharas(elements)
  const shortfall = (aksharaCount - (total % aksharaCount)) % aksharaCount
  if (shortfall === 0) return elements
  const last = elements[elements.length - 1]
  return [...elements.slice(0, -1), { ...last, duration: last.duration + shortfall }]
}

/**
 * Flag the second note of every repeated pair. A janta pair is one swara sung
 * twice with a fresh attack on the second, which is the whole point of the
 * exercise — the scorer needs to know an onset is expected mid-note.
 */
export function markJanta(elements: NotationElement[]): NotationElement[] {
  return elements.map((el, i) => {
    if (i === 0 || el.swara === null) return el
    const prev = elements[i - 1]
    if (prev.swara === el.swara && prev.octave === el.octave) return { ...el, janta: true }
    return el
  })
}

/**
 * Break a flat pattern into printed lines, one per avartana where the notes
 * allow it. A note held across the bar keeps its line, which then reports the
 * avartanas it really spans.
 */
function linesFromElements(
  elements: readonly NotationElement[],
  aksharaCount: number,
  idPrefix: string,
): NotationLine[] {
  const lines: NotationLine[] = []
  let bucket: NotationElement[] = []
  let acc = 0

  for (const el of elements) {
    bucket.push(el)
    acc += el.duration
    if (acc >= aksharaCount && acc % aksharaCount === 0) {
      lines.push({ id: `${idPrefix}-l${lines.length + 1}`, elements: bucket, avartanas: acc / aksharaCount })
      bucket = []
      acc = 0
    }
  }

  if (bucket.length > 0) {
    if (acc % aksharaCount !== 0) {
      throw new Error(`${idPrefix} ends mid-avartana (${acc} of ${aksharaCount} aksharas)`)
    }
    lines.push({ id: `${idPrefix}-l${lines.length + 1}`, elements: bucket, avartanas: acc / aksharaCount })
  }

  return lines
}

function threeKalams(thirdRequired: boolean): TempoStage[] {
  // The akshara tempo does not change between speeds — the note density does —
  // so the same range is offered at each kalam.
  return [
    { kalam: 1, notesPerAkshara: 1, suggestedBpm: [40, 60], required: true },
    { kalam: 2, notesPerAkshara: 2, suggestedBpm: [40, 60], required: true },
    { kalam: 3, notesPerAkshara: 4, suggestedBpm: [40, 60], required: thirdRequired },
  ]
}

function firstKalamOnly(): TempoStage[] {
  return [{ kalam: 1, notesPerAkshara: 1, suggestedBpm: [30, 50], required: true }]
}

const MASTERY_BEGINNER: MasteryCriteria = {
  pitchAccuracyPct: 75,
  centsTolerance: 50,
  rhythmAccuracyPct: 70,
  cleanPasses: 1,
}

const MASTERY_STANDARD: MasteryCriteria = {
  pitchAccuracyPct: 85,
  centsTolerance: 35,
  rhythmAccuracyPct: 80,
  cleanPasses: 2,
}

// ---------------------------------------------------------------------------
// Pattern tables
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Lesson assembly
// ---------------------------------------------------------------------------

interface BuildArgs {
  id: string
  level: number
  ordinal: number
  kind: LessonKind
  title: string
  subtitle: string
  talaId: string
  elements: NotationElement[]
  speeds: TempoStage[]
  prerequisites: string[]
  mastery: MasteryCriteria
  theoryCardIds: string[]
}

function buildLesson(args: BuildArgs): Lesson {
  const tala = TALAS[args.talaId]
  if (!tala) throw new Error(`unknown tala "${args.talaId}"`)
  const fitted = fitToAvartanas(args.elements, tala.aksharaCount)
  return {
    id: args.id,
    level: args.level,
    ordinal: args.ordinal,
    kind: args.kind,
    title: args.title,
    subtitle: args.subtitle,
    ragaId: RAGA_ID,
    talaId: args.talaId,
    notation: linesFromElements(fitted, tala.aksharaCount, args.id),
    speeds: args.speeds,
    prerequisites: args.prerequisites,
    mastery: args.mastery,
    theoryCardIds: args.theoryCardIds,
    generated: true,
  }
}

/** A linear chain: each lesson opens once the one before it is done. */
function chain(ids: readonly string[], entryPrerequisites: readonly string[]): string[][] {
  return ids.map((_, i) => (i === 0 ? [...entryPrerequisites] : [ids[i - 1]]))
}

// --- Level 0: voice basics ---------------------------------------------------

const VOICE_BASIC_IDS = [
  'voice-basic-1',
  'voice-basic-2',
  'voice-basic-3',
  'voice-basic-4',
  'voice-basic-5',
]

export function generateVoiceBasics(): Lesson[] {
  const prereqs = chain(VOICE_BASIC_IDS, [])
  const common = {
    level: 0,
    kind: 'voice-basic' as const,
    talaId: 'adi',
    mastery: MASTERY_BEGINNER,
  }

  return [
    buildLesson({
      ...common,
      id: VOICE_BASIC_IDS[0],
      ordinal: 1,
      title: 'Find your sruti',
      subtitle:
        'Set the drone to the pitch your voice rests on. Everything you sing afterwards is measured from it.',
      elements: [],
      speeds: firstKalamOnly(),
      prerequisites: prereqs[0],
      theoryCardIds: ['sruti', 'sthayi'],
    }),
    buildLesson({
      ...common,
      id: VOICE_BASIC_IDS[1],
      ordinal: 2,
      title: 'Breath and posture',
      subtitle:
        'Sit tall, breathe from the belly, and let a note last as long as the breath does without pushing.',
      elements: [],
      speeds: firstKalamOnly(),
      prerequisites: prereqs[1],
      theoryCardIds: ['breath'],
    }),
    buildLesson({
      ...common,
      id: VOICE_BASIC_IDS[2],
      ordinal: 3,
      title: 'Sustained Sa',
      subtitle:
        'One note, held steady against the drone for four cycles. The aim is a line that does not wobble.',
      elements: parsePattern('S*32'),
      speeds: firstKalamOnly(),
      prerequisites: prereqs[2],
      theoryCardIds: ['sruti', 'akara'],
    }),
    buildLesson({
      ...common,
      id: VOICE_BASIC_IDS[3],
      ordinal: 4,
      title: 'Sa Pa Sa',
      subtitle:
        'The three notes the drone already gives you. Move between them without sliding and without losing the tonic.',
      elements: parsePattern("S*8 P*8 S'*8 P*8 S*8"),
      speeds: firstKalamOnly(),
      prerequisites: prereqs[3],
      theoryCardIds: ['sruti', 'sthayi'],
    }),
    buildLesson({
      ...common,
      id: VOICE_BASIC_IDS[4],
      ordinal: 5,
      title: 'Akara on S R G M P',
      subtitle:
        'The first five swaras sung on the vowel "aa", four aksharas each, up and back down.',
      elements: parsePattern('S*4 R*4 G*4 M*4 P*4 P*4 M*4 G*4 R*4 S*4'),
      speeds: firstKalamOnly(),
      prerequisites: prereqs[4],
      theoryCardIds: ['akara', 'swara'],
    }),
  ]
}

const VOICE_BASICS = generateVoiceBasics()

// --- Levels 1–3: the varisai ------------------------------------------------

const SARALI_IDS = SARALI_ELEMENTS.map((_, i) => `sarali-${i + 1}`)
const JANTA_IDS = JANTA_ELEMENTS.map((_, i) => `janta-${i + 1}`)
const DHATU_IDS = DHATU_ELEMENTS.map((_, i) => `dhatu-${i + 1}`)
const MELSTHAYI_IDS = MELSTHAYI_ELEMENTS.map((_, i) => `melsthayi-${i + 1}`)
const KEEZHSTHAYI_IDS = KEEZHSTHAYI_ELEMENTS.map((_, i) => `keezhsthayi-${i + 1}`)
const LEVEL3_IDS = [...DHATU_IDS, ...MELSTHAYI_IDS, ...KEEZHSTHAYI_IDS]

const SARALI_SUBTITLES: readonly string[] = [
  'The scale up and down, one swara to each akshara. Everything else is built on this.',
  'Each step doubled before it moves on, which slows the ear down enough to hear the interval.',
  'A turn at the head of every cell, so the voice learns to come back before it goes on.',
  'Every four-note cell sung twice. The repeat is where accuracy is won.',
  'Four-note cells climbing one degree at a time, up to the tara Sa and back.',
  'Thirds. The first exercise that asks the voice to leap rather than step.',
  'Five-note cells. The odd length keeps the pattern from settling into the beat.',
  'Up and back within each tetrachord, which trains the return as much as the climb.',
  'Every swara answered by Sa. The tonic is the thing being fixed here, not the melody.',
  'The descent taken first. Approaching the octave from above is harder than it sounds.',
  'Overlapping pairs — each note is heard once as an arrival and once as a departure.',
  'Overlapping triples. The same idea over a longer cell.',
  'Six-note cells across the whole octave.',
  'A zig-zag descent through the full octave, which gathers everything before it.',
]

const JANTA_SUBTITLES: readonly string[] = [
  'The scale with every swara doubled. Give the second note its own attack.',
  'Each doubled note followed by its neighbour, rising and then falling.',
  'A double, then a step of two. The leap has to stay in tune after the repeat.',
  'Doubled fourths. A wide leap taken twice, which leaves nowhere to hide a flat note.',
  'The double placed inside the cell rather than at its head.',
  'Doubled three-note cells, which stretches the breath.',
  'A double resolved onto the swara above it.',
  'Doubled thirds. Both the leap and the repeat are being tested.',
  'Doubles dipping below Sa, into the part of the range beginners lose first.',
  'Doubles reaching over the tara Sa.',
]

const DHATU_SUBTITLES: readonly string[] = [
  'Sa and Ri answered by every swara in turn.',
  'Three up and one back, over and over. The step back is the difficult one.',
  'A leap up then a step down, climbing through the scale.',
  'Alternating between two swaras while the pair itself climbs.',
  'Sa as a pivot from below and tara Sa as a pivot from above.',
  'A fourth up and a step back — the widest leap in the set.',
]

const MELSTHAYI_SUBTITLES: readonly string[] = [
  'Up to the tara Ri and back, which is usually the first note above the octave a beginner can hold.',
  'Up to the tara Ga. Keep the throat open rather than reaching with it.',
  'Starting at Pa so the climb into the tara sthayi is already underway.',
  'The tara sthayi on its own terms, then the whole way down.',
]

const KEEZHSTHAYI_SUBTITLES: readonly string[] = [
  'Down to the mandra Pa and back. Do not push — a quiet mandra note is a correct one.',
  'Down to the mandra Ma, the bottom of most beginner ranges.',
]

export function generateVarisaiLessons(): Lesson[] {
  const saraliPrereqs = chain(SARALI_IDS, VOICE_BASIC_IDS)
  const jantaPrereqs = chain(JANTA_IDS, SARALI_IDS)
  const level3Prereqs = chain(LEVEL3_IDS, JANTA_IDS)

  const sarali = SARALI_ELEMENTS.map((elements, i) =>
    buildLesson({
      id: SARALI_IDS[i],
      level: 1,
      ordinal: i + 1,
      kind: 'sarali',
      title: `Sarali Varisai ${i + 1}`,
      subtitle: SARALI_SUBTITLES[i],
      talaId: 'adi',
      elements,
      speeds: threeKalams(true),
      prerequisites: saraliPrereqs[i],
      mastery: i < 3 ? MASTERY_BEGINNER : MASTERY_STANDARD,
      theoryCardIds: ['sarali', 'swara', 'mayamalavagowla', 'adi-tala', 'kalam', 'practice-how'],
    }),
  )

  const janta = JANTA_ELEMENTS.map((elements, i) =>
    buildLesson({
      id: JANTA_IDS[i],
      level: 2,
      ordinal: i + 1,
      kind: 'janta',
      title: `Janta Varisai ${i + 1}`,
      subtitle: JANTA_SUBTITLES[i],
      talaId: 'adi',
      elements,
      speeds: threeKalams(true),
      prerequisites: jantaPrereqs[i],
      mastery: MASTERY_STANDARD,
      theoryCardIds: ['janta', 'kalam', 'practice-how'],
    }),
  )

  const level3: Lesson[] = []
  DHATU_ELEMENTS.forEach((elements, i) => {
    level3.push(
      buildLesson({
        id: DHATU_IDS[i],
        level: 3,
        ordinal: level3.length + 1,
        kind: 'dhatu',
        title: `Dhatu Varisai ${i + 1}`,
        subtitle: DHATU_SUBTITLES[i],
        talaId: 'adi',
        elements,
        speeds: threeKalams(true),
        prerequisites: level3Prereqs[level3.length],
        mastery: MASTERY_STANDARD,
        theoryCardIds: ['dhatu', 'practice-how'],
      }),
    )
  })
  MELSTHAYI_ELEMENTS.forEach((elements, i) => {
    level3.push(
      buildLesson({
        id: MELSTHAYI_IDS[i],
        level: 3,
        ordinal: level3.length + 1,
        kind: 'sthayi',
        title: `Melsthayi Varisai ${i + 1}`,
        subtitle: MELSTHAYI_SUBTITLES[i],
        talaId: 'adi',
        elements,
        speeds: threeKalams(false),
        prerequisites: level3Prereqs[level3.length],
        mastery: MASTERY_STANDARD,
        theoryCardIds: ['sthayi-varisai', 'sthayi'],
      }),
    )
  })
  KEEZHSTHAYI_ELEMENTS.forEach((elements, i) => {
    level3.push(
      buildLesson({
        id: KEEZHSTHAYI_IDS[i],
        level: 3,
        ordinal: level3.length + 1,
        kind: 'sthayi',
        title: `Keezhsthayi Varisai ${i + 1}`,
        subtitle: KEEZHSTHAYI_SUBTITLES[i],
        talaId: 'adi',
        elements,
        speeds: threeKalams(false),
        prerequisites: level3Prereqs[level3.length],
        mastery: MASTERY_STANDARD,
        theoryCardIds: ['sthayi-varisai', 'sthayi'],
      }),
    )
  })

  return [...sarali, ...janta, ...level3]
}

const VARISAI_LESSONS = generateVarisaiLessons()

// --- Level 4: the alankaras -------------------------------------------------

const ALANKARA_IDS = ALANKARA_ELEMENTS.map((a) => `alankara-${a.talaId}`)

export function generateAlankaraLessons(): Lesson[] {
  const prereqs = chain(ALANKARA_IDS, LEVEL3_IDS)
  return ALANKARA_ELEMENTS.map((alankara, i) => {
    const tala = TALAS[alankara.talaId]
    return buildLesson({
      id: ALANKARA_IDS[i],
      level: 4,
      ordinal: i + 1,
      kind: 'alankara',
      title: `${tala.name} Alankara`,
      subtitle: `The published alankara for this tala, a cycle of ${tala.aksharaCount} aksharas. Count the tala with your hand while you sing.`,
      talaId: alankara.talaId,
      elements: alankara.elements,
      speeds: threeKalams(false),
      prerequisites: prereqs[i],
      mastery: MASTERY_STANDARD,
      theoryCardIds: ['alankara', 'tala-basics', 'kriya'],
    })
  })
}

const ALANKARA_LESSONS = generateAlankaraLessons()

export const ALL_GENERATED_LESSONS: Lesson[] = [
  ...VOICE_BASICS,
  ...VARISAI_LESSONS,
  ...ALANKARA_LESSONS,
]

export function lessonById(id: string): Lesson | undefined {
  return ALL_GENERATED_LESSONS.find((lesson) => lesson.id === id)
}
