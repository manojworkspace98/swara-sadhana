import { useMemo } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../state/appStore'
import { ALL_GENERATED_LESSONS } from '../content/generators/varisai'
import { RAGAS } from '../content/ragas'
import { isLevelUnlocked, levelCompletion, UNLOCK_THRESHOLD } from '../state/mastery'
import type { Lesson } from '../content/schema'
import type { Stars } from '../state/types'

const LEVEL_TITLES: Record<number, { title: string; blurb: string }> = {
  0: {
    title: 'Sruti and breath',
    blurb: 'Find the pitch your voice sits on, and learn to hold it without wavering.',
  },
  1: {
    title: 'Sarali varisai',
    blurb: 'The fourteen first exercises. Every Carnatic singer alive began here.',
  },
  2: {
    title: 'Janta, dhatu and sthayi varisai',
    blurb: 'Doubled notes, leaps, and the octaves above and below your own.',
  },
  3: {
    title: 'Alankaras',
    blurb: 'The same shape sung through each of the seven talas, so time becomes second nature.',
  },
}

export function LearnPage() {
  const { progress } = useApp()

  const byLevel = useMemo(() => {
    const map = new Map<number, Lesson[]>()
    for (const lesson of ALL_GENERATED_LESSONS) {
      const list = map.get(lesson.level) ?? []
      list.push(lesson)
      map.set(lesson.level, list)
    }
    for (const list of map.values()) list.sort((a, b) => a.ordinal - b.ordinal)
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [])

  const idsByLevel = useMemo(
    () =>
      Object.fromEntries(byLevel.map(([level, list]) => [level, list.map((l) => l.id)])),
    [byLevel],
  )

  const scores = progress?.lessonScores ?? {}

  return (
    <>
      <PageHeader
        eyebrow="Curriculum"
        title="The ladder"
        lead="Sarali varisai to the keerthanas, in the order a teacher would give them. Each level opens once most of the one before it is holding."
      />

      <div className="flex max-w-3xl flex-col gap-8">
        {byLevel.map(([level, lessons]) => {
          const unlocked = isLevelUnlocked(level, idsByLevel, scores)
          const done = levelCompletion(idsByLevel[level] ?? [], scores)
          const meta = LEVEL_TITLES[level] ?? { title: `Level ${level}`, blurb: '' }

          return (
            <section key={level}>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="eyebrow">Level {level}</p>
                  <h2 className="text-xl">{meta.title}</h2>
                </div>
                <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                  {Math.round(done * 100)}% held
                </p>
              </div>

              {meta.blurb && (
                <p className="mb-4 max-w-prose text-sm text-[var(--color-muted)]">
                  {meta.blurb}
                </p>
              )}

              {!unlocked && (
                <p className="mb-4 rounded-lg border border-dashed border-[var(--color-line)] p-3 text-sm text-[var(--color-muted)]">
                  Opens when {Math.round(UNLOCK_THRESHOLD * 100)}% of the level before it
                  is held at two stars.
                </p>
              )}

              <ul
                className={`grid gap-2 sm:grid-cols-2 ${unlocked ? '' : 'pointer-events-none opacity-40'}`}
              >
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      to={`/practice/${lesson.id}`}
                      className="card flex items-center justify-between gap-3 p-3 transition-colors hover:border-[var(--color-brass)]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{lesson.title}</span>
                        <span className="eyebrow">
                          {RAGAS[lesson.ragaId]?.name ?? lesson.ragaId}
                        </span>
                      </span>
                      <StarRow stars={(scores[lesson.id]?.stars ?? 0) as Stars} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}

function StarRow({ stars }: { stars: Stars }) {
  return (
    <span
      className="shrink-0 font-[family-name:var(--font-mono)] text-sm"
      aria-label={`${stars} of 3 stars`}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          style={{ color: n <= stars ? 'var(--color-turmeric)' : 'var(--color-line)' }}
        >
          ★
        </span>
      ))}
    </span>
  )
}
