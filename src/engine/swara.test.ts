import { describe, expect, it } from 'vitest'
import {
  centsAboveSa,
  hzForSwara,
  labelWithSthayi,
  locatePitch,
  readPitch,
  resolveSwara,
} from './swara'
import { hzForMidi, midiForHz, suggestShruti, shrutiHz, SHRUTI_OPTIONS } from './shruti'

const SA = 138.591 // C#3, the common male sruti

// Mayamalavagowla — every beginner exercise lives here.
const MAYAMALAVAGOWLA = [0, 1, 4, 5, 7, 8, 11]
// Bilahari: R2 G3 M1 P D2 N3 — the 9 must read D2, not N1.
const BILAHARI = [0, 2, 4, 5, 7, 9, 11]
// Mohanam: S R2 G3 P D2 — no Ma, no Ni.
const MOHANAM = [0, 2, 4, 7, 9]

describe('cents and frequency', () => {
  it('puts Sa at zero cents and the octave at 1200', () => {
    expect(centsAboveSa(SA, SA)).toBeCloseTo(0, 6)
    expect(centsAboveSa(SA * 2, SA)).toBeCloseTo(1200, 6)
    expect(centsAboveSa(SA / 2, SA)).toBeCloseTo(-1200, 6)
  })

  it('puts Pa a just-tempered fifth above Sa', () => {
    expect(centsAboveSa(hzForSwara(7, 0, SA), SA)).toBeCloseTo(700, 6)
  })

  it('round-trips swara frequency through location', () => {
    for (const semitone of MAYAMALAVAGOWLA) {
      for (const sthayi of [-1, 0, 1] as const) {
        const hz = hzForSwara(semitone, sthayi, SA)
        const pos = locatePitch(hz, SA)
        expect(pos.semitone).toBe(semitone)
        expect(pos.sthayi).toBe(sthayi)
        expect(pos.centsOff).toBeCloseTo(0, 6)
      }
    }
  })
})

describe('locatePitch', () => {
  it('reports how far a pitch sits from the nearest position', () => {
    const sharp = locatePitch(hzForSwara(4, 0, SA) * Math.pow(2, 30 / 1200), SA)
    expect(sharp.semitone).toBe(4)
    expect(sharp.centsOff).toBeCloseTo(30, 4)

    const flat = locatePitch(hzForSwara(4, 0, SA) * Math.pow(2, -30 / 1200), SA)
    expect(flat.semitone).toBe(4)
    expect(flat.centsOff).toBeCloseTo(-30, 4)
  })

  it('rounds at the halfway point rather than drifting a whole step', () => {
    // 49 cents above Ga3 is still Ga3; 51 belongs to the next position.
    expect(locatePitch(hzForSwara(4, 0, SA) * Math.pow(2, 49 / 1200), SA).semitone).toBe(4)
    expect(locatePitch(hzForSwara(4, 0, SA) * Math.pow(2, 51 / 1200), SA).semitone).toBe(5)
  })

  it('wraps the octave boundary without producing semitone 12', () => {
    const justBelowTaraSa = locatePitch(hzForSwara(11, 0, SA) * Math.pow(2, 60 / 1200), SA)
    expect(justBelowTaraSa.semitone).toBe(0)
    expect(justBelowTaraSa.sthayi).toBe(1)
  })

  it('clamps runaway octave errors into the drawable range', () => {
    const veryLow = locatePitch(SA / 8, SA)
    expect(veryLow.sthayi).toBe(-1)
    const veryHigh = locatePitch(SA * 8, SA)
    expect(veryHigh.sthayi).toBe(1)
  })
})

describe('resolveSwara', () => {
  it('names unambiguous positions', () => {
    expect(resolveSwara(0, MAYAMALAVAGOWLA).name.label).toBe('S')
    expect(resolveSwara(7, MAYAMALAVAGOWLA).name.label).toBe('P')
    expect(resolveSwara(1, MAYAMALAVAGOWLA).name.label).toBe('R1')
    expect(resolveSwara(4, MAYAMALAVAGOWLA).name.label).toBe('G3')
  })

  it('reads a shared position as Ri when the raga spends Ga elsewhere', () => {
    // Bilahari and Mohanam both have G3 at 4, so 9 is D2 and 2 is R2.
    expect(resolveSwara(9, BILAHARI).name.label).toBe('D2')
    expect(resolveSwara(2, BILAHARI).name.label).toBe('R2')
    expect(resolveSwara(2, MOHANAM).name.label).toBe('R2')
    expect(resolveSwara(9, MOHANAM).name.label).toBe('D2')
  })

  it('flags pitches the raga never uses', () => {
    expect(resolveSwara(6, MAYAMALAVAGOWLA).inRaga).toBe(false)
    expect(resolveSwara(5, MOHANAM).inRaga).toBe(false) // Mohanam drops Ma
    expect(resolveSwara(11, MOHANAM).inRaga).toBe(false) // and Ni
    expect(resolveSwara(4, MOHANAM).inRaga).toBe(true)
  })

  it('still names out-of-raga pitches so the ladder can show them', () => {
    expect(resolveSwara(6, MAYAMALAVAGOWLA).name.label).toBe('M2')
  })
})

describe('readPitch', () => {
  it('reads a sung Ga in Mayamalavagowla', () => {
    const r = readPitch(hzForSwara(4, 0, SA), SA, MAYAMALAVAGOWLA)
    expect(r.name.label).toBe('G3')
    expect(r.sthayi).toBe(0)
    expect(r.inRaga).toBe(true)
    expect(r.centsOff).toBeCloseTo(0, 4)
  })

  it('reads mandra Pa, the lowest note the first varisai demands', () => {
    const r = readPitch(hzForSwara(7, -1, SA), SA, MAYAMALAVAGOWLA)
    expect(r.name.label).toBe('P')
    expect(r.sthayi).toBe(-1)
  })
})

describe('labelWithSthayi', () => {
  it('marks the octave with a dot above or below', () => {
    const sa = resolveSwara(0, MAYAMALAVAGOWLA).name
    expect(labelWithSthayi(sa, 0)).toBe('S')
    expect(labelWithSthayi(sa, 1)).not.toBe('S')
    expect(labelWithSthayi(sa, -1)).not.toBe('S')
    expect(labelWithSthayi(sa, 1)).not.toBe(labelWithSthayi(sa, -1))
  })
})

describe('shruti', () => {
  it('agrees with concert pitch', () => {
    expect(hzForMidi(69)).toBeCloseTo(440, 6)
    expect(hzForMidi(49)).toBeCloseTo(138.591, 3) // C#3
    expect(midiForHz(440)).toBeCloseTo(69, 6)
  })

  it('offers the range singers actually choose from', () => {
    expect(SHRUTI_OPTIONS[0].id).toBe('B2')
    expect(SHRUTI_OPTIONS.at(-1)!.id).toBe('A3')
    expect(shrutiHz('G3')).toBeCloseTo(196, 1)
    expect(shrutiHz('C#3')).toBeCloseTo(138.591, 2)
  })

  it('names the traditional kattai for each note', () => {
    expect(SHRUTI_OPTIONS.find((s) => s.note === 'C')?.kattai).toBe('1')
    expect(SHRUTI_OPTIONS.find((s) => s.note === 'C#')?.kattai).toBe('1½')
    expect(SHRUTI_OPTIONS.find((s) => s.note === 'G')?.kattai).toBe('5')
  })

  it('falls back to C#3 for an unknown id rather than NaN', () => {
    expect(shrutiHz('nonsense')).toBeCloseTo(138.591, 2)
  })

  it('suggests a tonic that leaves mandra Pa reachable', () => {
    // Someone whose lowest steady note is G#2 should be put around C#3.
    const suggested = suggestShruti(hzForMidi(44))
    expect(suggested.id).toBe('C#3')
    // and their mandra Pa then sits at or above where they can actually sing.
    expect(hzForSwara(7, -1, suggested.hz)).toBeGreaterThanOrEqual(hzForMidi(44) - 1)
  })

  it('suggests a higher tonic for a higher voice', () => {
    const suggested = suggestShruti(hzForMidi(51)) // D#3
    expect(midiForHz(suggested.hz)).toBeGreaterThan(midiForHz(hzForMidi(51)))
    expect(suggested.id).toBe('G#3')
  })
})
