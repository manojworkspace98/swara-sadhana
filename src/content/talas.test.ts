import { describe, expect, it } from 'vitest'
import {
  SAPTA_TALA_IDS,
  TALAS,
  angaLength,
  buildKriya,
  computeAksharas,
  computeAngaStarts,
} from './talas'

describe('anga arithmetic', () => {
  it('lets only the laghu change length', () => {
    expect(angaLength('drutam', 3)).toBe(2)
    expect(angaLength('drutam', 9)).toBe(2)
    expect(angaLength('anudrutam', 3)).toBe(1)
    expect(angaLength('anudrutam', 9)).toBe(1)
    expect(angaLength('laghu', 3)).toBe(3)
    expect(angaLength('laghu', 9)).toBe(9)
  })

  it('counts the same anga list differently in each jati', () => {
    const triputa = ['laghu', 'drutam', 'drutam'] as const
    expect(computeAksharas(triputa, 3)).toBe(7)
    expect(computeAksharas(triputa, 4)).toBe(8) // adi
    expect(computeAksharas(triputa, 5)).toBe(9)
    expect(computeAksharas(triputa, 7)).toBe(11)
    expect(computeAksharas(triputa, 9)).toBe(13)
  })

  it('starts each anga where the one before it ended', () => {
    expect(computeAngaStarts(['laghu', 'drutam', 'drutam'], 4)).toEqual([0, 4, 6])
    expect(computeAngaStarts(['laghu', 'anudrutam', 'drutam'], 7)).toEqual([0, 7, 8])
  })

  it('builds a beat, then finger counts, for a laghu', () => {
    expect(buildKriya(['laghu'], 4)).toEqual(['beat', 'finger', 'finger', 'finger'])
    expect(buildKriya(['drutam'], 4)).toEqual(['beat', 'wave'])
    expect(buildKriya(['anudrutam'], 4)).toEqual(['beat'])
  })
})

describe('the suladi sapta talas', () => {
  const expected: Record<string, number> = {
    dhruva: 14,
    matya: 10,
    rupaka: 6,
    jhampa: 10,
    triputa: 7,
    ata: 14,
    eka: 4,
  }

  it('has all seven, in order', () => {
    expect(SAPTA_TALA_IDS).toEqual([
      'dhruva',
      'matya',
      'rupaka',
      'jhampa',
      'triputa',
      'ata',
      'eka',
    ])
    for (const id of SAPTA_TALA_IDS) expect(TALAS[id]).toBeDefined()
  })

  it('counts each one to its standard length in its default jati', () => {
    for (const [id, aksharas] of Object.entries(expected)) {
      expect(TALAS[id].aksharaCount, id).toBe(aksharas)
    }
  })

  it('derives the akshara count from the angas rather than storing it loose', () => {
    for (const id of SAPTA_TALA_IDS) {
      const tala = TALAS[id]
      expect(computeAksharas(tala.angas, tala.jati), id).toBe(tala.aksharaCount)
    }
  })

  it('uses the traditional default jatis', () => {
    expect(TALAS.dhruva.jati).toBe(4)
    expect(TALAS.matya.jati).toBe(4)
    expect(TALAS.rupaka.jati).toBe(4)
    expect(TALAS.jhampa.jati).toBe(7)
    expect(TALAS.triputa.jati).toBe(3)
    expect(TALAS.ata.jati).toBe(5)
    expect(TALAS.eka.jati).toBe(4)
  })
})

describe('every tala', () => {
  it('gives the hand exactly one action per akshara', () => {
    for (const [id, tala] of Object.entries(TALAS)) {
      expect(tala.kriya.length, id).toBe(tala.aksharaCount)
    }
  })

  it('opens every anga or group with a beat', () => {
    for (const [id, tala] of Object.entries(TALAS)) {
      for (const start of tala.angaStartIndices) {
        expect(tala.kriya[start], `${id} at ${start}`).toBe('beat')
      }
      expect(tala.angaStartIndices[0], id).toBe(0)
    }
  })

  it('keeps the group starts inside the cycle and ascending', () => {
    for (const [id, tala] of Object.entries(TALAS)) {
      const starts = [...tala.angaStartIndices]
      expect(starts, id).toEqual([...starts].sort((a, b) => a - b))
      expect(starts[starts.length - 1], id).toBeLessThan(tala.aksharaCount)
    }
  })
})

describe('adi tala', () => {
  it('is chatusra-jati triputa, eight aksharas', () => {
    expect(TALAS.adi.aksharaCount).toBe(8)
    expect(TALAS.adi.angas).toEqual(['laghu', 'drutam', 'drutam'])
    expect(TALAS.adi.jati).toBe(4)
    expect(TALAS.adi.angaStartIndices).toEqual([0, 4, 6])
    expect(TALAS.adi.kriya).toEqual([
      'beat',
      'finger',
      'finger',
      'finger',
      'beat',
      'wave',
      'beat',
      'wave',
    ])
  })
})

describe('rupaka', () => {
  it('is counted drutam first, six aksharas either way', () => {
    expect(TALAS.rupaka.aksharaCount).toBe(6)
    expect(TALAS.rupaka.angas).toEqual(['drutam', 'laghu'])
    expect(TALAS.rupaka.angaStartIndices).toEqual([0, 2])
  })
})

describe('the chapu talas', () => {
  it('carries no angas, because it is not built from them', () => {
    expect(TALAS.khandaChapu.angas).toEqual([])
    expect(TALAS.misraChapu.angas).toEqual([])
  })

  it('groups khanda chapu as two then three', () => {
    const t = TALAS.khandaChapu
    expect(t.aksharaCount).toBe(5)
    expect(t.angaStartIndices).toEqual([0, 2])
    expect(t.kriya).toEqual(['beat', 'wave', 'beat', 'wave', 'wave'])
  })

  it('groups misra chapu as three, two, two', () => {
    const t = TALAS.misraChapu
    expect(t.aksharaCount).toBe(7)
    expect(t.angaStartIndices).toEqual([0, 3, 5])
    expect(t.kriya).toEqual(['beat', 'wave', 'wave', 'beat', 'wave', 'beat', 'wave'])
  })

  it('names its jati after the group total', () => {
    expect(TALAS.khandaChapu.jati).toBe(5)
    expect(TALAS.misraChapu.jati).toBe(7)
  })

  it('cannot be recovered from anga arithmetic, which is why it is explicit', () => {
    expect(computeAksharas(TALAS.khandaChapu.angas, TALAS.khandaChapu.jati)).toBe(0)
    expect(TALAS.khandaChapu.aksharaCount).toBe(5)
  })
})
