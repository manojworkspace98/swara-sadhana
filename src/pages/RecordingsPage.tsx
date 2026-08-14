import { useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { PitchTraceView, type TraceLayer } from '../components/PitchTraceView'
import { useApp } from '../state/appStore'
import {
  deleteTake,
  listTakes,
  markPlayed,
  setPinned,
  usedBytes,
} from '../state/recordings'
import { resolveSwara } from '../engine/swara'
import { DEFAULT_RAGA, ragaSemitones } from '../content/ragas'
import type { Recording } from '../state/types'

export function RecordingsPage() {
  const { activeProfile, settings } = useApp()
  const [takes, setTakes] = useState<Recording[] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [compareId, setCompareId] = useState<string | null>(null)
  const [used, setUsed] = useState(0)

  const refresh = async () => {
    if (!activeProfile) return
    const rows = await listTakes(activeProfile.id)
    setTakes(rows)
    setUsed(await usedBytes(activeProfile.id))
    if (rows.length && !rows.some((r) => r.id === selectedId)) {
      setSelectedId(rows[0].id)
    }
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile])

  const selected = takes?.find((t) => t.id === selectedId) ?? null
  const compare = takes?.find((t) => t.id === compareId) ?? null

  // Only takes of the same lesson are worth overlaying — comparing a sarali
  // against a geetam would draw two unrelated shapes.
  const comparable = useMemo(
    () =>
      takes?.filter(
        (t) => selected && t.id !== selected.id && t.lessonId === selected.lessonId,
      ) ?? [],
    [takes, selected],
  )

  if (!activeProfile) return null

  return (
    <>
      <PageHeader
        eyebrow="Takes"
        title="Recordings"
        lead="Every take you keep, drawn as the pitch you actually sang. Put two side by side to hear a month of practice."
      />

      {takes === null ? (
        <p className="text-sm text-[var(--color-muted)]">Opening the library…</p>
      ) : takes.length === 0 ? (
        <div className="card max-w-xl p-6">
          <p className="text-sm text-[var(--color-muted)]">
            No takes yet. Record one while you practise a lesson and it will appear here,
            with the pitch trace saved alongside it.
          </p>
        </div>
      ) : (
        <div className="grid max-w-5xl gap-6 lg:grid-cols-[320px_1fr]">
          <section className="card max-h-[70vh] overflow-y-auto p-3">
            <ul className="flex flex-col gap-1">
              {takes.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                      t.id === selectedId
                        ? 'bg-[var(--color-ink-3)]'
                        : 'hover:bg-[var(--color-ink-2)]'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm">{t.title}</span>
                      {t.pinned && (
                        <span
                          className="text-[var(--color-brass)]"
                          title="Kept — never removed to free space"
                        >
                          ●
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                      {formatDate(t.createdAt)} · {Math.round(t.durationSec)}s
                      {t.pitchAccuracy != null && ` · ${Math.round(t.pitchAccuracy)}%`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-col gap-4">
            {selected && (
              <TakeDetail
                key={selected.id}
                take={selected}
                compare={compare}
                comparable={comparable}
                onCompare={setCompareId}
                onChanged={refresh}
              />
            )}

            <p className="text-xs text-[var(--color-muted)]">
              {formatMB(used)} used of a {settings?.recordingCapMB ?? 500} MB budget.
              Recordings stay on this device — they are too large to sync.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function TakeDetail({
  take,
  compare,
  comparable,
  onCompare,
  onChanged,
}: {
  take: Recording
  compare: Recording | null
  comparable: Recording[]
  onCompare: (id: string | null) => void
  onChanged: () => Promise<void>
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playhead, setPlayhead] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const url = useMemo(() => URL.createObjectURL(take.blob), [take.blob])
  useEffect(() => () => URL.revokeObjectURL(url), [url])

  const rungs = useMemo(() => {
    const semis = ragaSemitones(DEFAULT_RAGA)
    const out: { cents: number; label: string }[] = []
    for (const sthayi of [-1, 0, 1] as const) {
      for (const s of semis) {
        out.push({
          cents: (s + 12 * sthayi) * 100,
          label: resolveSwara(s, semis).name.label,
        })
      }
    }
    return out
  }, [])

  const layers: TraceLayer[] = [
    ...(compare?.pitchTrace
      ? [
          {
            trace: compare.pitchTrace,
            hopSec: compare.hopSec,
            colour: 'var(--color-muted)',
            label: `${formatDate(compare.createdAt)} (earlier)`,
            ghost: true,
          },
        ]
      : []),
    ...(take.pitchTrace
      ? [
          {
            trace: take.pitchTrace,
            hopSec: take.hopSec,
            colour: 'var(--color-turmeric)',
            label: formatDate(take.createdAt),
          },
        ]
      : []),
  ]

  return (
    <section className="card p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-lg">{take.title}</h2>
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
            {formatDate(take.createdAt)} · Sa at {take.saHz.toFixed(1)} Hz
            {take.pitchAccuracy != null && ` · ${Math.round(take.pitchAccuracy)}% in tune`}
          </p>
        </div>
      </div>

      {layers.length > 0 ? (
        <PitchTraceView
          layers={layers}
          rungs={rungs}
          playheadSec={playhead}
          onSeek={(sec) => {
            if (audioRef.current) audioRef.current.currentTime = sec
          }}
        />
      ) : (
        <p className="text-sm text-[var(--color-muted)]">
          This take was saved without a pitch trace.
        </p>
      )}

      <audio
        ref={audioRef}
        src={url}
        controls
        className="mt-3 w-full"
        onPlay={() => void markPlayed(take.id)}
        onTimeUpdate={(e) => setPlayhead(e.currentTarget.currentTime)}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {comparable.length > 0 && (
          <label className="flex items-center gap-2 text-sm">
            <span className="eyebrow">Compare with</span>
            <select
              value={compare?.id ?? ''}
              onChange={(e) => onCompare(e.target.value || null)}
              className="rounded-lg border border-[var(--color-line)] bg-[var(--color-ink)] px-2 py-1.5 text-sm"
            >
              <option value="">Nothing</option>
              {comparable.map((c) => (
                <option key={c.id} value={c.id}>
                  {formatDate(c.createdAt)}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          onClick={async () => {
            await setPinned(take.id, !take.pinned)
            await onChanged()
          }}
          className="min-h-10 rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-sm"
        >
          {take.pinned ? 'Stop keeping' : 'Keep this take'}
        </button>

        {confirmDelete ? (
          <>
            <button
              onClick={async () => {
                await deleteTake(take.id)
                setConfirmDelete(false)
                await onChanged()
              }}
              className="min-h-10 rounded-lg bg-[var(--color-kumkum)] px-3 py-1.5 text-sm font-medium"
            >
              Delete permanently
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="min-h-10 rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-sm"
            >
              Keep it
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="min-h-10 rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-sm text-[var(--color-muted)]"
          >
            Delete
          </button>
        )}
      </div>
    </section>
  )
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatMB(bytes: number): string {
  const mb = bytes / 1_048_576
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`
}
