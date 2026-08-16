import { useEffect } from 'react'
import { TeachingContent, DemoButton } from './TeachingContent'
import type { GlossaryTerm } from '../../content/teaching/types'

/**
 * A word, explained where it was met.
 *
 * Sending a beginner to a separate glossary page costs them their place in the
 * lesson and, often, their willingness to look the word up at all. So the
 * explanation comes to the word: a panel over the page, dismissed with Escape,
 * with the pronunciation at the top because a term you cannot say is a term
 * you will not use.
 */
export function TermSheet({
  term,
  saHz,
  onClose,
  onOpenTerm,
}: {
  term: GlossaryTerm | null
  saHz: number
  onClose: () => void
  onOpenTerm: (termId: string) => void
}) {
  useEffect(() => {
    if (!term) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [term, onClose])

  if (!term) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={term.term}
    >
      <div
        className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[var(--color-line)] bg-[var(--color-ink-2)] p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-turmeric)]">
              {term.iso ?? term.term}
            </h2>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-sm text-[var(--color-muted)]">
              said {term.say}
            </p>
            {(term.devanagari || term.telugu) && (
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {[term.devanagari, term.telugu].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 border-l-2 border-[var(--color-brass)] pl-3 text-[15px] leading-relaxed text-[var(--color-jasmine)]">
          {term.short}
        </p>

        <div className="mb-4">
          <DemoButton demo={{ kind: 'say', text: term.term }} label="Hear it said" saHz={saHz} />
        </div>

        <TeachingContent blocks={term.body} saHz={saHz} onOpenTerm={onOpenTerm} />

        {term.see && term.see.length > 0 && (
          <div className="mt-6 border-t border-[var(--color-line)] pt-4">
            <p className="eyebrow mb-2">Read next</p>
            <div className="flex flex-wrap gap-2">
              {term.see.map((id) => (
                <button
                  key={id}
                  onClick={() => onOpenTerm(id)}
                  className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-sm text-[var(--color-muted)] hover:border-[var(--color-brass)] hover:text-[var(--color-brass)]"
                >
                  {id.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
