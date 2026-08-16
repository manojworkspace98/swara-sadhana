import { useEffect, useState } from 'react'
import { parseTermLinks, type Block, type Demo } from '../../content/teaching/types'
import { playDemo, stopDemo } from '../../content/teaching/playDemo'

/**
 * Teaching text that can make a sound.
 *
 * A paragraph explaining the drone is worth little beside a button that plays
 * it, so demos sit inside the prose rather than in a separate player. Terms
 * are underlined where they first appear and open an explanation in place —
 * a beginner should never have to leave the sentence to understand it.
 */

export interface TeachingContentProps {
  blocks: readonly Block[]
  saHz: number
  onOpenTerm?: (termId: string) => void
}

export function TeachingContent({ blocks, saHz, onOpenTerm }: TeachingContentProps) {
  useEffect(() => () => stopDemo(), [])

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} saHz={saHz} onOpenTerm={onOpenTerm} />
      ))}
    </div>
  )
}

function BlockView({
  block,
  saHz,
  onOpenTerm,
}: {
  block: Block
  saHz: number
  onOpenTerm?: (termId: string) => void
}) {
  switch (block.kind) {
    case 'heading':
      return (
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg text-[var(--color-jasmine)]">
          <RichText text={block.text} onOpenTerm={onOpenTerm} />
        </h3>
      )

    case 'p':
      return (
        <p className="text-[15px] leading-relaxed text-[var(--color-jasmine)]">
          <RichText text={block.text} onOpenTerm={onOpenTerm} />
        </p>
      )

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag
          className={`flex flex-col gap-2 pl-5 text-[15px] leading-relaxed text-[var(--color-jasmine)] ${
            block.ordered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1 marker:text-[var(--color-brass)]">
              <RichText text={item} onOpenTerm={onOpenTerm} />
            </li>
          ))}
        </Tag>
      )
    }

    case 'note':
      return (
        <p className="rounded-md border-l-2 border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-line)_22%,transparent)] px-4 py-3 text-sm leading-relaxed text-[var(--color-muted)]">
          <RichText text={block.text} onOpenTerm={onOpenTerm} />
        </p>
      )

    // A named mistake is often the most useful thing on a page: it turns a
    // problem the singer would have discovered slowly into one they can avoid.
    case 'watch':
      return (
        <p
          className="rounded-md border-l-2 px-4 py-3 text-sm leading-relaxed"
          style={{
            borderLeftColor: 'var(--color-vermilion)',
            background: 'color-mix(in srgb, var(--color-vermilion) 8%, transparent)',
          }}
        >
          <span className="eyebrow mr-2 text-[var(--color-vermilion)]">Common slip</span>
          <RichText text={block.text} onOpenTerm={onOpenTerm} />
        </p>
      )

    case 'try':
      return (
        <div className="rounded-md border border-[var(--color-brass)]/35 bg-[color-mix(in_srgb,var(--color-brass)_7%,transparent)] px-4 py-3">
          <p className="eyebrow mb-1 text-[var(--color-brass)]">Try this now</p>
          <p className="text-[15px] leading-relaxed text-[var(--color-jasmine)]">
            <RichText text={block.text} onOpenTerm={onOpenTerm} />
          </p>
          {block.demo && (
            <div className="mt-3">
              <DemoButton demo={block.demo} label={demoLabel(block.demo)} saHz={saHz} />
            </div>
          )}
        </div>
      )

    case 'audio':
      return <DemoButton demo={block.demo} label={block.label} saHz={saHz} />
  }
}

function demoLabel(demo: Demo): string {
  switch (demo.kind) {
    case 'drone':
      return 'Play the drone'
    case 'swaras':
      return 'Hear it sung'
    case 'tala':
      return 'Hear the count'
    case 'say':
      return `Say "${demo.text}"`
  }
}

export function DemoButton({
  demo,
  label,
  saHz,
}: {
  demo: Demo
  label: string
  saHz: number
}) {
  const [playing, setPlaying] = useState(false)

  async function toggle() {
    if (playing) {
      stopDemo()
      setPlaying(false)
      return
    }
    setPlaying(true)
    const handle = await playDemo(demo, saHz)
    await handle.done
    setPlaying(false)
  }

  return (
    <button
      onClick={() => void toggle()}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--color-brass)]/50 px-4 py-2 text-sm text-[var(--color-brass)] transition-colors hover:bg-[var(--color-ink-3)]"
      aria-pressed={playing}
    >
      <span aria-hidden className="text-base leading-none">
        {playing ? '◼' : '▶'}
      </span>
      {playing ? 'Stop' : label}
    </button>
  )
}

/** Prose with [[term]] links turned into openable chips. */
export function RichText({
  text,
  onOpenTerm,
}: {
  text: string
  onOpenTerm?: (termId: string) => void
}) {
  return (
    <>
      {parseTermLinks(text).map((segment, i) =>
        segment.termId && onOpenTerm ? (
          <button
            key={i}
            onClick={() => onOpenTerm(segment.termId!)}
            className="cursor-help border-b border-dotted border-[var(--color-brass)] text-[var(--color-brass)] transition-colors hover:border-solid hover:text-[var(--color-turmeric)]"
            title="What does this mean?"
          >
            {segment.text}
          </button>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </>
  )
}
