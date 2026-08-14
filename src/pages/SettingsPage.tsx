import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../state/appStore'
import { SHRUTI_OPTIONS } from '../engine/shruti'
import { deleteProfile, updateProfile } from '../state/profiles'
import { storageEstimate } from '../state/db'
import { DEVI_ARTWORKS } from '../content/art'
import { GoalEditor } from '../components/GoalEditor'
import { describeGoal, goalForProfile, type DailyGoal } from '../state/goals'
import {
  notificationPermission,
  requestNotificationPermission,
  type PermissionState,
  type ReminderSettings,
} from '../state/reminders'

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

  async function changeGoal(goal: DailyGoal) {
    await updateProfile(activeProfile!.id, { goal })
    await refreshProfiles()
    useApp.setState({ activeProfile: { ...activeProfile!, goal } })
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
                Sa at {activeProfile.shruti} · {describeGoal(goalForProfile(activeProfile))} a day
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
          <h2 className="mb-2 text-lg">Daily goal</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            What a day has to contain before it counts toward your streak.
          </p>
          <GoalEditor goal={goalForProfile(activeProfile)} onChange={changeGoal} />
        </section>

        <ReminderSettingsCard
          settings={settings.reminders}
          onChange={(reminders) => void patchSettings({ reminders })}
        />

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

/**
 * Reminders, with their limits stated rather than buried.
 *
 * A reminder a singer believes in but which never arrives is worse than no
 * reminder at all, so the card says exactly when it can and cannot fire before
 * asking for the permission.
 */
function ReminderSettingsCard({
  settings,
  onChange,
}: {
  settings: ReminderSettings
  onChange: (next: ReminderSettings) => void
}) {
  const [permission, setPermission] = useState<PermissionState>(notificationPermission())

  async function enable() {
    const result = await requestNotificationPermission()
    setPermission(result)
    if (result === 'granted') onChange({ ...settings, enabled: true })
  }

  return (
    <section className="card p-6">
      <h2 className="mb-2 text-lg">Reminders</h2>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        A nudge at your usual hour, and one in the evening if the day has not counted
        yet.
      </p>

      {permission === 'unsupported' ? (
        <p className="text-sm text-[var(--color-muted)]">
          This browser does not support notifications.
        </p>
      ) : permission === 'denied' ? (
        <p className="text-sm text-[var(--color-kumkum)]">
          Notifications are blocked for this site. Allow them in your browser's site
          settings, then come back.
        </p>
      ) : settings.enabled && permission === 'granted' ? (
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>Remind me at</span>
            <select
              value={settings.hour ?? 'auto'}
              onChange={(e) =>
                onChange({
                  ...settings,
                  hour: e.target.value === 'auto' ? null : Number(e.target.value),
                })
              }
              className="min-h-11 rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-2)] px-3 py-2 text-sm"
            >
              <option value="auto">the hour I usually sing</option>
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {formatHour12(h)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Evening nudge if the day has not counted
              <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
                At {formatHour12(settings.streakGuardHour)}.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.streakGuard}
              onChange={(e) => onChange({ ...settings, streakGuard: e.target.checked })}
              className="h-5 w-5 accent-[var(--color-brass)]"
            />
          </label>

          <p className="border-t border-[var(--color-line)] pt-3 text-xs leading-relaxed text-[var(--color-muted)]">
            These arrive while the app is open or sitting in a background tab. With no
            server behind it, nothing can reach you once the browser is fully closed —
            installing the app to your home screen and leaving it running is what makes
            reminders dependable.
          </p>

          <button
            onClick={() => onChange({ ...settings, enabled: false })}
            className="min-h-11 self-start rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm"
          >
            Turn reminders off
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => void enable()}
            className="min-h-11 rounded-lg bg-[var(--color-brass)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
          >
            Turn on reminders
          </button>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
            Your browser will ask permission once. Reminders arrive while the app is open
            or in a background tab; nothing is sent to any server, and nothing can reach
            you once the browser is fully closed.
          </p>
        </div>
      )}
    </section>
  )
}

function formatHour12(hour: number): string {
  if (hour === 0) return '12am'
  if (hour === 12) return 'noon'
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`
}

function fmtMB(bytes: number): string {
  const mb = bytes / 1_048_576
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`
}
