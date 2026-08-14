/**
 * The tala system: how a cycle is divided, and what the hand does on each beat.
 *
 * A tala is built from angas (limbs). Only the laghu changes length — its jati
 * says how many aksharas it spans — which is why the same seven talas yield
 * thirty-five forms. The drutam is always 2 and the anudrutam always 1.
 */

export type AngaType = 'laghu' | 'drutam' | 'anudrutam'

/** Laghu lengths: tisra, chatusra, khanda, misra, sankeerna. */
export type Jati = 3 | 4 | 5 | 7 | 9

/**
 * What the hand does on one akshara. A laghu is a beat then finger counts; a
 * drutam is a beat then a wave (visarjita); an anudrutam is a lone beat.
 */
export type KriyaAction = 'beat' | 'wave' | 'finger'

export interface Tala {
  id: string
  name: string
  nameDeva: string
  nameTelugu: string
  /** Empty for the chapu talas, which are not built from angas — see CHAPU below. */
  angas: readonly AngaType[]
  jati: Jati
  aksharaCount: number
  /** Akshara index at which each anga (or chapu group) begins. */
  angaStartIndices: readonly number[]
  /** One action per akshara; length always equals aksharaCount. */
  kriya: readonly KriyaAction[]
}

/** Aksharas spanned by a single anga. Only the laghu depends on the jati. */
export function angaLength(anga: AngaType, jati: Jati): number {
  if (anga === 'laghu') return jati
  if (anga === 'drutam') return 2
  return 1
}

export function computeAksharas(angas: readonly AngaType[], jati: Jati): number {
  return angas.reduce((total, anga) => total + angaLength(anga, jati), 0)
}

export function computeAngaStarts(angas: readonly AngaType[], jati: Jati): number[] {
  const starts: number[] = []
  let at = 0
  for (const anga of angas) {
    starts.push(at)
    at += angaLength(anga, jati)
  }
  return starts
}

export function buildKriya(angas: readonly AngaType[], jati: Jati): KriyaAction[] {
  const kriya: KriyaAction[] = []
  for (const anga of angas) {
    if (anga === 'laghu') {
      kriya.push('beat')
      for (let i = 1; i < jati; i += 1) kriya.push('finger')
    } else if (anga === 'drutam') {
      kriya.push('beat', 'wave')
    } else {
      kriya.push('beat')
    }
  }
  return kriya
}

interface TalaSeed {
  id: string
  name: string
  nameDeva: string
  nameTelugu: string
  angas: readonly AngaType[]
  jati: Jati
}

function fromAngas(seed: TalaSeed): Tala {
  return {
    ...seed,
    aksharaCount: computeAksharas(seed.angas, seed.jati),
    angaStartIndices: computeAngaStarts(seed.angas, seed.jati),
    kriya: buildKriya(seed.angas, seed.jati),
  }
}

/**
 * The chapu talas are counted by alternating claps and waves in uneven groups,
 * not by angas, so forcing them into laghu/drutam arithmetic would misdescribe
 * what the hand actually does. Khanda chapu groups as 2 + 3 and misra chapu as
 * 3 + 2 + 2, with a clap opening each group and waves filling it out. Their
 * `angas` are therefore empty and the grouping lives in `angaStartIndices`.
 */
function fromChapu(
  seed: Omit<TalaSeed, 'angas'> & { groups: readonly number[] },
): Tala {
  const kriya: KriyaAction[] = []
  const starts: number[] = []
  let at = 0
  for (const size of seed.groups) {
    starts.push(at)
    kriya.push('beat')
    for (let i = 1; i < size; i += 1) kriya.push('wave')
    at += size
  }
  return {
    id: seed.id,
    name: seed.name,
    nameDeva: seed.nameDeva,
    nameTelugu: seed.nameTelugu,
    angas: [],
    jati: seed.jati,
    aksharaCount: at,
    angaStartIndices: starts,
    kriya,
  }
}

/**
 * The seven suladi sapta talas in their standard default jatis, plus the three
 * forms a student meets first: adi, and the two chapu talas.
 *
 * Rupaka appears here in the form actually counted in practice — drutam then
 * chatusra laghu, so the cycle opens on the clap-wave. Textbooks that list the
 * sapta talas in schematic order write it laghu-then-drutam; the akshara count
 * is 6 either way.
 */
export const TALAS: Record<string, Tala> = {
  dhruva: fromAngas({
    id: 'dhruva',
    name: 'Dhruva',
    nameDeva: 'ध्रुव',
    nameTelugu: 'ధ్రువ',
    angas: ['laghu', 'drutam', 'laghu', 'laghu'],
    jati: 4,
  }),
  matya: fromAngas({
    id: 'matya',
    name: 'Matya',
    nameDeva: 'मट्य',
    nameTelugu: 'మట్య',
    angas: ['laghu', 'drutam', 'laghu'],
    jati: 4,
  }),
  rupaka: fromAngas({
    id: 'rupaka',
    name: 'Rupaka',
    nameDeva: 'रूपक',
    nameTelugu: 'రూపక',
    angas: ['drutam', 'laghu'],
    jati: 4,
  }),
  jhampa: fromAngas({
    id: 'jhampa',
    name: 'Jhampa',
    nameDeva: 'झम्प',
    nameTelugu: 'ఝంప',
    angas: ['laghu', 'anudrutam', 'drutam'],
    jati: 7,
  }),
  triputa: fromAngas({
    id: 'triputa',
    name: 'Triputa',
    nameDeva: 'त्रिपुट',
    nameTelugu: 'త్రిపుట',
    angas: ['laghu', 'drutam', 'drutam'],
    jati: 3,
  }),
  ata: fromAngas({
    id: 'ata',
    name: 'Ata',
    nameDeva: 'अट',
    nameTelugu: 'అట',
    angas: ['laghu', 'laghu', 'drutam', 'drutam'],
    jati: 5,
  }),
  eka: fromAngas({
    id: 'eka',
    name: 'Eka',
    nameDeva: 'एक',
    nameTelugu: 'ఏక',
    angas: ['laghu'],
    jati: 4,
  }),
  // Adi is chatusra-jati triputa. It carries its own id because every beginner
  // exercise is set in it and the name is what a student is told.
  adi: fromAngas({
    id: 'adi',
    name: 'Adi',
    nameDeva: 'आदि',
    nameTelugu: 'ఆది',
    angas: ['laghu', 'drutam', 'drutam'],
    jati: 4,
  }),
  khandaChapu: fromChapu({
    id: 'khandaChapu',
    name: 'Khanda Chapu',
    nameDeva: 'खण्ड चापु',
    nameTelugu: 'ఖండ చాపు',
    jati: 5,
    groups: [2, 3],
  }),
  misraChapu: fromChapu({
    id: 'misraChapu',
    name: 'Misra Chapu',
    nameDeva: 'मिश्र चापु',
    nameTelugu: 'మిశ్ర చాపు',
    jati: 7,
    groups: [3, 2, 2],
  }),
}

/** The seven suladi sapta talas, in their traditional order. */
export const SAPTA_TALA_IDS: readonly string[] = [
  'dhruva',
  'matya',
  'rupaka',
  'jhampa',
  'triputa',
  'ata',
  'eka',
]

export const DEFAULT_TALA = TALAS.adi
