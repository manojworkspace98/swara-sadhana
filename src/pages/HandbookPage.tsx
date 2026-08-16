import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { TeachingContent } from '../components/teaching/TeachingContent'
import { TermSheet } from '../components/teaching/TermSheet'
import { HANDBOOK } from '../content/teaching/handbook'
import { GLOSSARY, lookupTerm } from '../content/teaching/glossary'
import { useApp } from '../state/appStore'
import { shrutiHz } from '../engine/shruti'

/**
 * What to read before the first practice.
 *
 * A beginner arriving at this app knows no vocabulary, and every screen in it
 * was written as though they did. This page is the repair: eight chapters that
 * assume nothing, and a glossary of every word the lessons use, each with a
 * respelling and something to listen to.
 */
export function HandbookPage() {
  const { activeProfile } = useApp()
  const saHz = shrutiHz(activeProfile?.shruti ?? 'C#3')

  const [openChapter, setOpenChapter] = useState<string | null>(HANDBOOK[0]?.id ?? null)
  const [termId, setTermId] = useState<string | null>(null)
  const [showGlossary, setShowGlossary] = useState(false)
  const [filter, setFilter] = useState('')

  const terms = GLOSSARY.filter((t) => {
    const q = filter.trim().toLowerCase()
    if (!q) return true
    return t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q)
  })

  return (
    <>
      <PageHeader
        eyebrow="Start here"
        title="The handbook"
        lead="Everything the lessons assume you already know, written for somebody who does not."
      />

      <div className="flex max-w-3xl flex-col gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowGlossary(false)}
            className={showGlossary ? 'btn-ghost' : 'btn-primary'}
          >
            Chapters
          </button>
          <button
            onClick={() => setShowGlossary(true)}
            className={showGlossary ? 'btn-primary' : 'btn-ghost'}
          >
            Every term ({GLOSSARY.length})
          </button>
        </div>

        {showGlossary ? (
          <section className="card p-5 md:p-6">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search a word you have met"
              className="mb-4 min-h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-2)] px-3 py-2 text-sm"
            />
            <ul className="flex flex-col divide-y divide-[var(--color-line)]">
              {terms.map((term) => (
                <li key={term.id}>
                  <button
                    onClick={() => setTermId(term.id)}
                    className="w-full py-3 text-left transition-colors hover:bg-[var(--color-ink-3)]"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-[var(--color-turmeric)]">{term.iso ?? term.term}</span>
                      <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                        {term.say}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--color-muted)]">
                      {term.short}
                    </span>
                  </button>
                </li>
              ))}
              {terms.length === 0 && (
                <li className="py-6 text-center text-sm text-[var(--color-muted)]">
                  Nothing matches “{filter}”.
                </li>
              )}
            </ul>
          </section>
        ) : (
          HANDBOOK.map((chapter) => {
            const open = openChapter === chapter.id
            return (
              <section key={chapter.id} className="card p-5 md:p-6">
                <button
                  onClick={() => setOpenChapter(open ? null : chapter.id)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                  aria-expanded={open}
                >
                  <span>
                    <span className="block font-[family-name:var(--font-display)] text-xl text-[var(--color-turmeric)]">
                      {chapter.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--color-muted)]">
                      {chapter.lead}
                    </span>
                  </span>
                  <span className="shrink-0 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                    {chapter.minutes} min
                  </span>
                </button>

                {open && (
                  <div className="mt-5 border-t border-[var(--color-line)] pt-5">
                    <TeachingContent
                      blocks={chapter.body}
                      saHz={saHz}
                      onOpenTerm={setTermId}
                    />
                  </div>
                )}
              </section>
            )
          })
        )}
      </div>

      <TermSheet
        term={termId ? (lookupTerm(termId) ?? null) : null}
        saHz={saHz}
        onClose={() => setTermId(null)}
        onOpenTerm={setTermId}
      />
    </>
  )
}
