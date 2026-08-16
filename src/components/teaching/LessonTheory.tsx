import { useState } from 'react'
import { TeachingContent } from './TeachingContent'
import { TermSheet } from './TermSheet'
import { cardsFor } from '../../content/teaching/cards'
import { lookupTerm } from '../../content/teaching/glossary'

/**
 * The explanation that belongs to this lesson, at the lesson.
 *
 * Every lesson has always named the cards it needs; until now nothing showed
 * them, so a student met "janta" and "kalam" for the first time on a screen
 * that offered no way to find out what either meant. The cards open closed, so
 * a singer who already knows can get straight to singing.
 */
export function LessonTheory({
  cardIds,
  saHz,
  defaultOpen = false,
}: {
  cardIds: readonly string[]
  saHz: number
  defaultOpen?: boolean
}) {
  const cards = cardsFor(cardIds)
  const [openId, setOpenId] = useState<string | null>(defaultOpen ? (cards[0]?.id ?? null) : null)
  const [termId, setTermId] = useState<string | null>(null)

  if (cards.length === 0) return null

  return (
    <section className="card p-5">
      <p className="eyebrow mb-3">Before you sing this</p>
      <div className="flex flex-col divide-y divide-[var(--color-line)]">
        {cards.map((card) => {
          const open = openId === card.id
          return (
            <div key={card.id} className="py-3 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenId(open ? null : card.id)}
                className="flex w-full items-start justify-between gap-3 text-left"
                aria-expanded={open}
              >
                <span>
                  <span className="block text-[var(--color-turmeric)]">{card.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-[var(--color-muted)]">
                    {card.summary}
                  </span>
                </span>
                <span
                  className="shrink-0 text-[var(--color-muted)] transition-transform"
                  style={{ transform: open ? 'rotate(90deg)' : 'none' }}
                  aria-hidden
                >
                  ›
                </span>
              </button>

              {open && (
                <div className="mt-4">
                  <TeachingContent blocks={card.body} saHz={saHz} onOpenTerm={setTermId} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <TermSheet
        term={termId ? (lookupTerm(termId) ?? null) : null}
        saHz={saHz}
        onClose={() => setTermId(null)}
        onOpenTerm={setTermId}
      />
    </section>
  )
}
