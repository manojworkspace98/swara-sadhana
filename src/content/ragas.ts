import type { SwaraLetter } from '../engine/types'

export interface Raga {
  id: string
  name: string
  /** Devanagari and Telugu names, for the lesson header. */
  nameDeva: string
  nameTelugu: string
  /** Parent melakarta, for the theory card. */
  melakarta: number
  isJanya: boolean
  /** Semitones above Sa, ascending. */
  arohana: readonly number[]
  /** Semitones above Sa, as sung descending (listed low to high here). */
  avarohana: readonly number[]
  /** Letters the raga uses, in order — drives notation naming. */
  letters: readonly SwaraLetter[]
  /** One line a student can hold on to. */
  lakshana: string
}

/** Every semitone the raga touches, either direction. */
export function ragaSemitones(raga: Raga): number[] {
  return [...new Set([...raga.arohana, ...raga.avarohana])].sort((a, b) => a - b)
}

export const RAGAS: Record<string, Raga> = {
  mayamalavagowla: {
    id: 'mayamalavagowla',
    name: 'Mayamalavagowla',
    nameDeva: 'मायामालवगौल',
    nameTelugu: 'మాయామాళవగౌళ',
    melakarta: 15,
    isJanya: false,
    arohana: [0, 1, 4, 5, 7, 8, 11],
    avarohana: [0, 1, 4, 5, 7, 8, 11],
    letters: ['S', 'R', 'G', 'M', 'P', 'D', 'N'],
    lakshana:
      'The scale every beginner starts in. Its symmetrical semitone steps — R1 next to Sa, D1 next to Pa — train the voice to place small intervals accurately.',
  },
  malahari: {
    id: 'malahari',
    name: 'Malahari',
    nameDeva: 'मलहरी',
    nameTelugu: 'మలహరి',
    melakarta: 15,
    isJanya: true,
    arohana: [0, 1, 5, 7, 8],
    avarohana: [0, 1, 4, 5, 7, 8],
    letters: ['S', 'R', 'G', 'M', 'P', 'D'],
    lakshana:
      'The geetam raga. Ga appears only on the way down, so the ascent is spare and the descent fills in.',
  },
  suddhaSaveri: {
    id: 'suddhaSaveri',
    name: 'Suddha Saveri',
    nameDeva: 'शुद्ध सावेरी',
    nameTelugu: 'శుద్ధ సావేరి',
    melakarta: 29,
    isJanya: true,
    arohana: [0, 2, 5, 7, 9],
    avarohana: [0, 2, 5, 7, 9],
    letters: ['S', 'R', 'M', 'P', 'D'],
    lakshana: 'Five notes, no Ga and no Ni. Open and steady, good for firm voice production.',
  },
  mohanam: {
    id: 'mohanam',
    name: 'Mohanam',
    nameDeva: 'मोहनम्',
    nameTelugu: 'మోహనం',
    melakarta: 29,
    isJanya: true,
    arohana: [0, 2, 4, 7, 9],
    avarohana: [0, 2, 4, 7, 9],
    letters: ['S', 'R', 'G', 'P', 'D'],
    lakshana:
      'A pentatonic raga with no Ma and no Ni. Bright and immediately singable, which is why the first varnam lives here.',
  },
  bilahari: {
    id: 'bilahari',
    name: 'Bilahari',
    nameDeva: 'बिलहरी',
    nameTelugu: 'బిలహరి',
    melakarta: 29,
    isJanya: true,
    arohana: [0, 2, 4, 7, 9],
    avarohana: [0, 2, 4, 5, 7, 9, 11],
    letters: ['S', 'R', 'G', 'M', 'P', 'D', 'N'],
    lakshana:
      'Climbs on five notes like Mohanam, comes down on all seven. That asymmetry is the whole character of the raga.',
  },
  jaganmohini: {
    id: 'jaganmohini',
    name: 'Jaganmohini',
    nameDeva: 'जगन्मोहिनी',
    nameTelugu: 'జగన్మోహిని',
    melakarta: 15,
    isJanya: true,
    arohana: [0, 4, 5, 7, 11],
    avarohana: [0, 1, 4, 5, 7, 11],
    letters: ['S', 'R', 'G', 'M', 'P', 'N'],
    lakshana:
      'No Dha at all, and Ri only on the way down. Shares its swarasthanas with Mayamalavagowla, so it sits easily under a beginner voice.',
  },
  hamsadhwani: {
    id: 'hamsadhwani',
    name: 'Hamsadhwani',
    nameDeva: 'हंसध्वनि',
    nameTelugu: 'హంసధ్వని',
    melakarta: 29,
    isJanya: true,
    arohana: [0, 2, 4, 7, 11],
    avarohana: [0, 2, 4, 7, 11],
    letters: ['S', 'R', 'G', 'P', 'N'],
    lakshana:
      'No Ma, no Dha. The concert-opening raga — clear, bright, and built on the notes that ring most easily.',
  },
  harikambhoji: {
    id: 'harikambhoji',
    name: 'Harikambhoji',
    nameDeva: 'हरिकाम्भोजी',
    nameTelugu: 'హరికాంభోజి',
    melakarta: 28,
    isJanya: false,
    arohana: [0, 2, 4, 5, 7, 9, 10],
    avarohana: [0, 2, 4, 5, 7, 9, 10],
    letters: ['S', 'R', 'G', 'M', 'P', 'D', 'N'],
    lakshana: 'A full seven-note melakarta with the soft kaisiki Ni. Warm and unhurried.',
  },
  nata: {
    id: 'nata',
    name: 'Nata',
    nameDeva: 'नाट',
    nameTelugu: 'నాట',
    melakarta: 36,
    isJanya: true,
    arohana: [0, 3, 4, 5, 7, 11],
    avarohana: [0, 3, 5, 7, 11],
    letters: ['S', 'R', 'G', 'M', 'P', 'N'],
    lakshana:
      'Ceremonial and firm, sung at the start of a concert. Its Ri is the high shatsruti Ri, which gives the raga its striding quality.',
  },
  gambhiraNattai: {
    id: 'gambhiraNattai',
    name: 'Gambhira Nattai',
    nameDeva: 'गम्भीर नाट',
    nameTelugu: 'గంభీర నాట',
    melakarta: 36,
    isJanya: true,
    arohana: [0, 4, 5, 7, 11],
    avarohana: [0, 4, 5, 7, 11],
    letters: ['S', 'G', 'M', 'P', 'N'],
    lakshana:
      'Nata stripped to five notes — no Ri, no Dha. Grand and rhythmic, the natural home of a thillana.',
  },
  suddhaDhanyasi: {
    id: 'suddhaDhanyasi',
    name: 'Suddha Dhanyasi',
    nameDeva: 'शुद्ध धन्यासी',
    nameTelugu: 'శుద్ధ ధన్యాసి',
    melakarta: 22,
    isJanya: true,
    arohana: [0, 3, 5, 7, 10],
    avarohana: [0, 3, 5, 7, 10],
    letters: ['S', 'G', 'M', 'P', 'N'],
    lakshana:
      'Five notes with the tender sadharana Ga. Grave and inward — the raga carries the devotion in Bhavamulona.',
  },
}

export const DEFAULT_RAGA = RAGAS.mayamalavagowla
