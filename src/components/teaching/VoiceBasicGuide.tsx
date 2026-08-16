import { SrutiWalkthrough } from './SrutiWalkthrough'

/**
 * The Level 0 lessons, which are taught rather than scored.
 *
 * Everything above Level 0 is a line of notation the app can play, listen to
 * and mark. These five are not: "sit tall and breathe from the belly" has no
 * score, and pretending otherwise by showing an empty stave taught nobody
 * anything. They get written guidance and, where it helps, something to do.
 */
export function VoiceBasicGuide({
  lessonId,
  currentShruti,
  onPickShruti,
}: {
  lessonId: string
  currentShruti: string
  onPickShruti: (id: string) => void
}) {
  if (lessonId === 'voice-basic-1') {
    return <SrutiWalkthrough current={currentShruti} onPick={onPickShruti} />
  }

  return <PlaceholderGuide lessonId={lessonId} />
}

/**
 * Lessons whose written guidance is still being prepared.
 *
 * Saying so is better than an empty page: a beginner who finds nothing assumes
 * they have missed something and stops, which is precisely what happened here.
 */
function PlaceholderGuide({ lessonId }: { lessonId: string }) {
  return (
    <div className="card p-6">
      <p className="eyebrow mb-2">Being written</p>
      <p className="text-[15px] leading-relaxed">
        The guidance for this lesson is not ready yet. Rather than show you an empty
        practice screen, this page says so.
      </p>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        In the meantime, the first lesson — finding your sruti — is complete, and the
        drone on the Tuner page is worth spending time with: turning it on and humming
        along with it is real practice, not a warm-up for practice.
      </p>
      <p className="mt-3 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
        {lessonId}
      </p>
    </div>
  )
}
