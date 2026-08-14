import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../state/appStore'
import { SHRUTI_OPTIONS } from '../engine/shruti'
import { deleteProfile, updateProfile } from '../state/profiles'
import { storageEstimate } from '../state/db'
import { DEVI_ARTWORKS } from '../content/art'

export function SettingsPage() {
  const { activeProfile, profiles, signOut, refreshProfiles, patchSettings, settings } =
    useApp()
  const [storage, setStorage] = useState<{ usage: number; quota: number } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    void storageEstimate().then(setStorage)
  }, [])

  if (!activeProfile || !settings) return null

  async function changeShruti(id: string) {
    await updateProfile(activeProfile!.id, { shruti: id })
    await refreshProfiles()
    useApp.setState({ activeProfile: { ...activeProfile!, shruti: id } })
  }

  async function changeGoal(min: number) {
    await updateProfile(activeProfile!.id, { dailyGoalMin: min })
    await refreshProfiles()
    useApp.setState({ activeProfile: { ...activeProfile!, dailyGoalMin: min } })
  }

  return (
    <>
      <PageHeader eyebrow="Setup" title="Settings" />

      <div className="flex max-w-2xl flex-col gap-6">
        <section className="card p-6">
          <h2 className="mb-4 text-lg">Singer</h2>
          <div className="mb-5 flex items-center gap-4">
            <span
              className="grid h-12 w-12 place-items-center rounded-full text-2xl"
              style={{
                background: `${activeProfile.hue}22`,
                border: `1px solid ${activeProfile.hue}66`,
              }}
            >
              {activeProfile.avatar}
            </span>
            <div>
              <p className="font-medium">{activeProfile.name}</p>
              <p className="text-sm text-[var(--color-muted)]">
                Sa at {activeProfile.shruti} · {activeProfile.dailyGoalMin} min a day
              </p>
            </div>
          </div>

          <label className="mb-5 flex flex-col gap-2">
            <span className="eyebrow">Sruti</span>
            <select
              value={activeProfile.shruti}
              onChange={(e) => changeShruti(e.target.value)}
              className="rounded-lg border border-[var(--color-line)] bg-[var(--color-ink)] px-3 py-2"
            >
              {SHRUTI_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.kattai} kattai ({s.hz.toFixed(1)} Hz)
                </option>
              ))}
            </select>
          </label>

          <fieldset className="mb-5">
            <legend className="eyebrow mb-2">Daily goal</legend>
            <div className="flex flex-wrap gap-2">
              {[10, 20, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => changeGoal(m)}
                  aria-pressed={m === activeProfile.dailyGoalMin}
                  className={`min-h-11 rounded-lg border px-4 py-2 text-sm ${
                    m === activeProfile.dailyGoalMin
                      ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)]'
                      : 'border-[var(--color-line)]'
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={signOut}
              className="min-h-11 rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm"
            >
              Switch singer
            </button>
            <button
              onClick={() => patchSettings({ invocationShownOn: null })}
              className="min-h-11 rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm"
            >
              Show the invocation again
            </button>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-lg">Invocation</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            Shown once a day, before your first practice.
          </p>
          <div className="flex flex-wrap gap-3">
            {DEVI_ARTWORKS.map((a) => (
              <button
                key={a.id}
                onClick={() => patchSettings({ deviArtwork: a.id })}
                aria-pressed={settings.deviArtwork === a.id}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                  settings.deviArtwork === a.id
                    ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)]'
                    : 'border-[var(--color-line)]'
                }`}
              >
                <img src={a.src} alt={a.alt} className="h-24 w-auto rounded object-cover" />
                <span className="text-sm">{a.title}</span>
                <span className="eyebrow">{a.caption}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-2 text-lg">Storage</h2>
          <p className="text-sm text-[var(--color-muted)]">
            {storage
              ? `${fmtMB(storage.usage)} used of about ${fmtMB(storage.quota)} available on this device.`
              : 'This browser does not report a storage estimate.'}
          </p>
        </section>

        {profiles.length > 1 && (
          <section className="card border-[var(--color-kumkum)]/40 p-6">
            <h2 className="mb-2 text-lg">Remove this singer</h2>
            <p className="mb-4 text-sm text-[var(--color-muted)]">
              Deletes {activeProfile.name}'s streak, scores and recordings from this
              device. This cannot be undone.
            </p>
            {confirmDelete ? (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={async () => {
                    await deleteProfile(activeProfile.id)
                    await refreshProfiles()
                    signOut()
                  }}
                  className="min-h-11 rounded-lg bg-[var(--color-kumkum)] px-4 py-2 text-sm font-medium"
                >
                  Delete {activeProfile.name} permanently
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="min-h-11 rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm"
                >
                  Keep it
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="min-h-11 rounded-lg border border-[var(--color-kumkum)]/60 px-4 py-2 text-sm text-[var(--color-kumkum)]"
              >
                Remove singer
              </button>
            )}
          </section>
        )}
      </div>
    </>
  )
}

function fmtMB(bytes: number): string {
  const mb = bytes / 1_048_576
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`
}
