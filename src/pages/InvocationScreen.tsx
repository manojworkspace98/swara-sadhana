import { useState } from 'react'
import { INVOCATION, type ScriptChoice } from '../content/invocation'
import { artworkById } from '../content/art'
import { useApp } from '../state/appStore'

const SCRIPTS: { id: ScriptChoice; label: string; cls: string }[] = [
  { id: 'devanagari', label: 'देवनागरी', cls: 'dv' },
  { id: 'telugu', label: 'తెలుగు', cls: 'te' },
  { id: 'latin', label: 'Latin', cls: '' },
]

/**
 * The threshold. Practice begins with the invocation to Śyāmalā Devī, offered
 * once a day rather than on every navigation, so it stays a moment rather than
 * turning into an obstacle.
 */
export function InvocationScreen({ onBegin }: { onBegin: () => void }) {
  const settings = useApp((s) => s.settings)
  const [script, setScript] = useState<ScriptChoice>('devanagari')
  const [showMeaning, setShowMeaning] = useState(false)
  const art = artworkById(settings?.deviArtwork)
  const lines = INVOCATION[script]

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 py-12 text-center">
      <figure className="mb-7">
        <img
          src={art.src}
          alt={art.alt}
          className="mx-auto h-56 w-auto rounded-lg border border-[var(--color-line)] object-cover shadow-[0_0_70px_-14px_rgba(200,155,74,0.5)]"
        />
      </figure>

      <p className="eyebrow">Before practice</p>
      <h1 className="mt-2 mb-6 text-3xl text-[var(--color-brass)]">{art.title}</h1>

      <div
        className={`mb-6 flex flex-col gap-1 text-lg leading-relaxed text-balance ${
          SCRIPTS.find((s) => s.id === script)!.cls
        }`}
      >
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
        {SCRIPTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScript(s.id)}
            aria-pressed={s.id === script}
            className={`min-h-9 rounded-full border px-3 py-1 text-sm transition-colors ${
              s.id === script
                ? 'border-[var(--color-brass)] text-[var(--color-turmeric)]'
                : 'border-[var(--color-line)] text-[var(--color-muted)]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {showMeaning ? (
        <p className="mb-7 max-w-prose text-sm text-[var(--color-muted)] italic">
          {INVOCATION.meaning}
        </p>
      ) : (
        <button
          onClick={() => setShowMeaning(true)}
          className="mb-7 text-sm text-[var(--color-muted)] underline underline-offset-4"
        >
          What does it mean?
        </button>
      )}

      <button
        onClick={onBegin}
        className="min-h-12 rounded-full bg-[var(--color-brass)] px-8 py-3 font-medium text-[var(--color-ink)] transition-transform hover:scale-[1.02]"
      >
        Begin practice
      </button>

      <p className="eyebrow mt-8">{INVOCATION.source}</p>
      <p className="eyebrow mt-1 opacity-70">{art.caption}</p>
    </div>
  )
}
