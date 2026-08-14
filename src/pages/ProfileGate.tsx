import { useState } from 'react'
import { useApp } from '../state/appStore'
import { createProfile, PROFILE_AVATARS, PROFILE_HUES } from '../state/profiles'
import {
  DEFAULT_SHRUTI_FEMALE,
  DEFAULT_SHRUTI_MALE,
  SHRUTI_OPTIONS,
} from '../engine/shruti'
import type { Profile } from '../state/types'

/**
 * Who is practising. No password: this picks up a practice book, it does not
 * unlock a vault. The point is that a second singer in the house gets their own
 * streak instead of quietly ruining yours.
 */
export function ProfileGate() {
  const { profiles, selectProfile, refreshProfiles } = useApp()
  const [creating, setCreating] = useState(profiles.length === 0)

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-12">
      <p className="eyebrow">Swara Sadhana</p>
      <h1 className="mt-1 mb-8 text-4xl">{creating ? 'Set up your practice' : 'Who is singing?'}</h1>

      {creating ? (
        <CreateProfileForm
          firstEver={profiles.length === 0}
          onCancel={profiles.length ? () => setCreating(false) : undefined}
          onCreated={async (p) => {
            await refreshProfiles()
            await selectProfile(p.id)
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => selectProfile(p.id)}
              className="card group flex flex-col items-center gap-3 p-6 transition-transform hover:-translate-y-1"
              style={{ borderColor: `${p.hue}55` }}
            >
              <span
                className="grid h-16 w-16 place-items-center rounded-full text-3xl"
                style={{ background: `${p.hue}22`, border: `1px solid ${p.hue}66` }}
              >
                {p.avatar}
              </span>
              <span className="font-medium">{p.name}</span>
              <span className="eyebrow">Sa · {p.shruti}</span>
            </button>
          ))}

          <button
            onClick={() => setCreating(true)}
            className="card flex flex-col items-center justify-center gap-3 border-dashed p-6 text-[var(--color-muted)] transition-colors hover:text-[var(--color-jasmine)]"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full border border-dashed border-[var(--color-line)] text-2xl">
              +
            </span>
            <span className="text-sm">Add a singer</span>
          </button>
        </div>
      )}
    </div>
  )
}

function CreateProfileForm({
  firstEver,
  onCreated,
  onCancel,
}: {
  firstEver: boolean
  onCreated: (p: Profile) => void
  onCancel?: () => void
}) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(PROFILE_AVATARS[0])
  const [hue, setHue] = useState(PROFILE_HUES[0])
  const [voiceType, setVoiceType] = useState<Profile['voiceType']>('unset')
  const [shruti, setShruti] = useState(DEFAULT_SHRUTI_MALE)
  const [dailyGoalMin, setDailyGoalMin] = useState(20)
  const [busy, setBusy] = useState(false)

  function chooseVoice(v: 'male' | 'female') {
    setVoiceType(v)
    setShruti(v === 'male' ? DEFAULT_SHRUTI_MALE : DEFAULT_SHRUTI_FEMALE)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || busy) return
    setBusy(true)
    try {
      onCreated(
        await createProfile({
          name: name.trim(),
          avatar,
          hue,
          shruti,
          voiceType,
          dailyGoalMin,
        }),
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-6 p-6 md:p-8">
      {firstEver && (
        <p className="text-sm text-[var(--color-muted)]">
          Everything stays on this device. You can change any of it later.
        </p>
      )}

      <label className="flex flex-col gap-2">
        <span className="eyebrow">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          placeholder="Your name"
          className="rounded-lg border border-[var(--color-line)] bg-[var(--color-ink)] px-3 py-2 outline-none focus:border-[var(--color-brass)]"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="eyebrow mb-2">Face</legend>
        <div className="flex flex-wrap gap-2">
          {PROFILE_AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              aria-pressed={a === avatar}
              className={`grid h-11 w-11 place-items-center rounded-full text-xl transition-colors ${
                a === avatar
                  ? 'bg-[var(--color-ink-3)] ring-1 ring-[var(--color-brass)]'
                  : 'bg-[var(--color-ink-2)]'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="eyebrow mb-2">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {PROFILE_HUES.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHue(h)}
              aria-label={`Colour ${h}`}
              aria-pressed={h === hue}
              className={`h-9 w-9 rounded-full transition-transform ${
                h === hue ? 'scale-110 ring-2 ring-offset-2 ring-offset-[var(--color-ink)]' : ''
              }`}
              style={{ background: h, boxShadow: h === hue ? `0 0 0 2px ${h}` : undefined }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="eyebrow mb-2">Voice</legend>
        <div className="flex gap-2">
          {(['male', 'female'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => chooseVoice(v)}
              aria-pressed={voiceType === v}
              className={`min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                voiceType === v
                  ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)]'
                  : 'border-[var(--color-line)]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          This only picks a starting sruti. The tuner will help you find the one that
          actually suits your voice.
        </p>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="eyebrow">Starting sruti</span>
        <select
          value={shruti}
          onChange={(e) => setShruti(e.target.value)}
          className="rounded-lg border border-[var(--color-line)] bg-[var(--color-ink)] px-3 py-2 outline-none focus:border-[var(--color-brass)]"
        >
          {SHRUTI_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.kattai} kattai ({s.hz.toFixed(1)} Hz)
            </option>
          ))}
        </select>
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="eyebrow mb-2">Daily goal</legend>
        <div className="flex flex-wrap gap-2">
          {[10, 20, 30, 45, 60].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setDailyGoalMin(m)}
              aria-pressed={m === dailyGoalMin}
              className={`min-h-11 rounded-lg border px-4 py-2 text-sm transition-colors ${
                m === dailyGoalMin
                  ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)]'
                  : 'border-[var(--color-line)]'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!name.trim() || busy}
          className="min-h-11 rounded-lg bg-[var(--color-brass)] px-5 py-2 font-medium text-[var(--color-ink)] disabled:opacity-40"
        >
          Start practising
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-lg border border-[var(--color-line)] px-5 py-2 text-[var(--color-muted)]"
          >
            Back
          </button>
        )}
      </div>
    </form>
  )
}
