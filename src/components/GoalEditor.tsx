import { useState } from 'react'
import {
  describeGoal,
  GOAL_PRESETS,
  METRIC_LABEL,
  sanitiseGoal,
  type DailyGoal,
  type GoalMetric,
} from '../state/goals'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const METRICS: GoalMetric[] = ['minutes', 'exercises', 'cleanPasses']

/**
 * Setting what a day of practice has to contain.
 *
 * The presets carry most people; the rest of the panel exists because a daily
 * goal that does not fit gets ignored, and an ignored goal takes the streak
 * down with it.
 */
export function GoalEditor({
  goal,
  onChange,
}: {
  goal: DailyGoal
  onChange: (goal: DailyGoal) => void
}) {
  const [custom, setCustom] = useState(
    !GOAL_PRESETS.some((p) => sameGoal(p.goal, goal)),
  )

  const set = (next: DailyGoal) => onChange(sanitiseGoal(next))

  const ruleFor = (metric: GoalMetric) => goal.rules.find((r) => r.metric === metric)

  function toggleMetric(metric: GoalMetric, on: boolean) {
    if (on) {
      set({ ...goal, rules: [...goal.rules, { metric, target: defaultTarget(metric) }] })
    } else {
      set({ ...goal, rules: goal.rules.filter((r) => r.metric !== metric) })
    }
  }

  function setTarget(metric: GoalMetric, target: number) {
    set({
      ...goal,
      rules: goal.rules.map((r) => (r.metric === metric ? { ...r, target } : r)),
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {GOAL_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setCustom(false)
              set(p.goal)
            }}
            aria-pressed={!custom && sameGoal(p.goal, goal)}
            title={p.blurb}
            className={`min-h-11 rounded-lg border px-3 py-2 text-sm transition-colors ${
              !custom && sameGoal(p.goal, goal)
                ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)]'
                : 'border-[var(--color-line)]'
            }`}
          >
            {p.name}
          </button>
        ))}
        <button
          onClick={() => setCustom(true)}
          aria-pressed={custom}
          className={`min-h-11 rounded-lg border px-3 py-2 text-sm transition-colors ${
            custom
              ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)]'
              : 'border-[var(--color-line)]'
          }`}
        >
          Set my own
        </button>
      </div>

      {!custom && (
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          {GOAL_PRESETS.find((p) => sameGoal(p.goal, goal))?.blurb}
        </p>
      )}

      {custom && (
        <div className="mb-4 flex flex-col gap-3">
          {METRICS.map((metric) => {
            const rule = ruleFor(metric)
            return (
              <div
                key={metric}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--color-line)] p-3"
              >
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!rule}
                    onChange={(e) => toggleMetric(metric, e.target.checked)}
                  />
                  {METRIC_LABEL[metric]}
                </label>

                {rule && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={metric === 'minutes' ? 120 : 12}
                      value={rule.target}
                      onChange={(e) => setTarget(metric, Number(e.target.value))}
                      className="w-40 accent-[var(--color-brass)]"
                      aria-label={`Target ${METRIC_LABEL[metric]}`}
                    />
                    <input
                      type="number"
                      min={1}
                      max={metric === 'minutes' ? 600 : 100}
                      value={rule.target}
                      onChange={(e) => setTarget(metric, Number(e.target.value))}
                      className="w-16 rounded border border-[var(--color-line)] bg-[var(--color-ink)] px-2 py-1 text-right font-[family-name:var(--font-mono)] text-sm"
                      aria-label={`Target ${METRIC_LABEL[metric]}, exact`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <fieldset>
        <legend className="eyebrow mb-2">Days off</legend>
        <div className="flex flex-wrap gap-1.5">
          {DAY_NAMES.map((name, i) => {
            const off = goal.restDays.includes(i)
            return (
              <button
                key={name}
                onClick={() =>
                  set({
                    ...goal,
                    restDays: off
                      ? goal.restDays.filter((d) => d !== i)
                      : [...goal.restDays, i],
                  })
                }
                aria-pressed={off}
                className={`min-h-10 min-w-11 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                  off
                    ? 'border-[var(--color-brass)] bg-[var(--color-ink-3)] text-[var(--color-turmeric)]'
                    : 'border-[var(--color-line)] text-[var(--color-muted)]'
                }`}
              >
                {name}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          A day off counts as met, so a rest does not cost you the streak.
        </p>
      </fieldset>

      <p className="mt-4 rounded-lg bg-[var(--color-ink-3)] px-3 py-2 text-sm">
        A day counts when you have done{' '}
        <span className="font-[family-name:var(--font-mono)] text-[var(--color-turmeric)]">
          {describeGoal(goal)}
        </span>
        {goal.restDays.length > 0 &&
          `, except ${goal.restDays.map((d) => DAY_NAMES[d]).join(' and ')}`}
        .
      </p>
    </div>
  )
}

function defaultTarget(metric: GoalMetric): number {
  return metric === 'minutes' ? 30 : 3
}

function sameGoal(a: DailyGoal, b: DailyGoal): boolean {
  return JSON.stringify(sanitiseGoal(a)) === JSON.stringify(sanitiseGoal(b))
}
