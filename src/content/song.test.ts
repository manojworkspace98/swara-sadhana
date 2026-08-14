import { describe, expect, it } from 'vitest'
import { lessonsForSong, sectionAksharas, validateSong, type Song } from './song'
import type { NotationElement } from './schema'

/** A run of plain madhya-sthayi swaras, one akshara each. */
function line(letters: string, sahitya?: string[]): NotationElement[] {
  return [...letters].map((ch, i) => ({
    swara: ch.toUpperCase() as NotationElement['swara'],
    octave: 0 as const,
    duration: 1,
    ...(sahitya?.[i] ? { sahitya: sahitya[i] } : {}),
  }))
}

/** Mohanam has no Ma and no Ni, and Rupaka is six aksharas. */
function songFixture(overrides: Partial<Song> = {}): Song {
  return {
    id: 'test-song',
    title: 'Test Piece',
    composer: 'Traditional',
    language: 'sanskrit',
    ragaId: 'mohanam',
    talaId: 'rupaka',
    source: {
      sourceName: 'Some published archive',
      url: 'https://example.org/piece',
      school: 'as printed by the source',
      encodedBy: 'test',
      verified: true,
    },
    sections: [
      {
        id: 'pallavi',
        kind: 'pallavi',
        label: 'Pallavi',
        lines: [
          { id: 'p1', elements: line('SRGPDS'), avartanas: 1 },
          { id: 'p2', elements: line('SDPGRS'), avartanas: 1 },
        ],
      },
    ],
    ...overrides,
  }
}

describe('validateSong', () => {
  it('accepts a song whose lines close their avartanas and stay in the raga', () => {
    expect(validateSong(songFixture())).toEqual({ ok: true })
  })

  it('refuses a line that does not fill the tala', () => {
    const song = songFixture({
      sections: [
        {
          id: 'pallavi',
          kind: 'pallavi',
          label: 'Pallavi',
          lines: [{ id: 'p1', elements: line('SRGPD'), avartanas: 1 }],
        },
      ],
    })
    const result = validateSong(song)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.problems[0]).toMatch(/5 aksharas but claims 1 avartana/)
  })

  it('refuses a swara the raga does not contain', () => {
    const song = songFixture({
      sections: [
        {
          id: 'pallavi',
          kind: 'pallavi',
          label: 'Pallavi',
          // Mohanam is S R G P D — an M here is a transcription slip.
          lines: [{ id: 'p1', elements: line('SRGMPD'), avartanas: 1 }],
        },
      ],
    })
    const result = validateSong(song)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.problems.join(' ')).toMatch(/uses M, which Mohanam does not contain/)
  })

  // Attribution is the one thing that cannot be reconstructed later, so an
  // unsourced song is a validation failure rather than a warning.
  it('refuses a song with no source attribution', () => {
    const song = songFixture()
    const result = validateSong({ ...song, source: { ...song.source, url: '' } })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.problems.join(' ')).toMatch(/url/)
  })

  it('refuses duplicate line ids across different sections', () => {
    const song = songFixture({
      sections: [
        {
          id: 'pallavi',
          kind: 'pallavi',
          label: 'Pallavi',
          lines: [{ id: 'dup', elements: line('SRGPDS'), avartanas: 1 }],
        },
        {
          id: 'anupallavi',
          kind: 'anupallavi',
          label: 'Anupallavi',
          lines: [{ id: 'dup', elements: line('SDPGRS'), avartanas: 1 }],
        },
      ],
    })
    const result = validateSong(song)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.problems.join(' ')).toMatch(/duplicate line id "dup"/)
  })
})

describe('sectionAksharas', () => {
  it('adds up every line in the section', () => {
    expect(sectionAksharas(songFixture().sections[0])).toBe(12)
  })
})

describe('lessonsForSong', () => {
  it('makes one lesson per section, so a keerthana is learnt a part at a time', () => {
    const song = songFixture({
      sections: [
        {
          id: 'pallavi',
          kind: 'pallavi',
          label: 'Pallavi',
          lines: [{ id: 'p1', elements: line('SRGPDS'), avartanas: 1 }],
        },
        {
          id: 'charanam',
          kind: 'charanam',
          label: 'Charanam',
          lines: [{ id: 'c1', elements: line('SDPGRS'), avartanas: 1 }],
        },
      ],
    })
    const lessons = lessonsForSong(song, { level: 7, kind: 'kriti', startOrdinal: 0 })

    expect(lessons.map((l) => l.id)).toEqual(['test-song.pallavi', 'test-song.charanam'])
    expect(lessons[0].title).toBe('Test Piece')
    expect(lessons[0].subtitle).toBe('Pallavi')
    expect(lessons.every((l) => l.generated === false)).toBe(true)
  })

  it('chains sections so a later part waits for the one before it', () => {
    const song = songFixture({
      sections: [
        {
          id: 'pallavi',
          kind: 'pallavi',
          label: 'Pallavi',
          lines: [{ id: 'p1', elements: line('SRGPDS'), avartanas: 1 }],
        },
        {
          id: 'charanam',
          kind: 'charanam',
          label: 'Charanam',
          lines: [{ id: 'c1', elements: line('SDPGRS'), avartanas: 1 }],
        },
      ],
    })
    const lessons = lessonsForSong(song, { level: 7, kind: 'kriti', startOrdinal: 0 })

    expect(lessons[0].prerequisites).toEqual([])
    expect(lessons[1].prerequisites).toEqual(['test-song.pallavi'])
  })

  // Sahitya lessons are scored on syllable timing too, which the varisai are not.
  it('asks for syllable timing when the section carries words', () => {
    const song = songFixture({
      sections: [
        {
          id: 'pallavi',
          kind: 'pallavi',
          label: 'Pallavi',
          lines: [
            {
              id: 'p1',
              elements: line('SRGPDS', ['va', 'ra', 'vee', 'na', 'mru', 'du']),
              avartanas: 1,
            },
          ],
        },
      ],
    })
    const [lesson] = lessonsForSong(song, { level: 4, kind: 'geetam', startOrdinal: 0 })
    expect(lesson.mastery.syllableTimingPct).toBeGreaterThan(0)
  })

  it('leaves syllable timing out of a swara-only section', () => {
    const [lesson] = lessonsForSong(songFixture(), { level: 6, kind: 'varnam', startOrdinal: 0 })
    expect(lesson.mastery.syllableTimingPct).toBeUndefined()
  })

  it('produces lessons the lesson validator also accepts', async () => {
    const { validateLesson } = await import('./schema')
    for (const lesson of lessonsForSong(songFixture(), {
      level: 4,
      kind: 'geetam',
      startOrdinal: 0,
    })) {
      expect(validateLesson(lesson)).toEqual({ ok: true })
    }
  })
})
