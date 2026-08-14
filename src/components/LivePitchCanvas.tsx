import { useEffect, useRef } from 'react'
import type { ExpectedNote } from '../state/types'
import type { PitchFrame } from '../engine/types'
import { labelWithSthayi, resolveSwara } from '../engine/swara'

export interface LiveCanvasProps {
  timeline: React.RefObject<ExpectedNote[]>
  latest: React.RefObject<PitchFrame | null>
  ragaSemitones: readonly number[]
  /** Reads the AudioContext clock; the timeline is written in that time base. */
  now: () => number
  /** Seconds of music visible at once. */
  window?: number
  height?: number
  /** In-tune tolerance in cents; the lane is drawn this tall. */
  toleranceCents?: number
}

const HISTORY_SEC = 12

/**
 * What you are singing against what you should be singing.
 *
 * The expected notes scroll right to left as lanes; the playhead sits a third
 * of the way in so a note is visible before it arrives and stays visible after
 * it has gone. Lane height is literally the scoring tolerance, so a trace
 * inside the lane is a note that will be marked correct — the picture and the
 * score cannot disagree.
 */
export function LivePitchCanvas({
  timeline,
  latest,
  ragaSemitones,
  now,
  window: windowSec = 6,
  height = 260,
  toleranceCents = 50,
}: LiveCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const history = useRef<{ t: number; cents: number | null }[]>([])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2)
    let raf = 0

    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function draw() {
      const w = canvas!.clientWidth
      const h = height
      const t = now()
      const notes = timeline.current ?? []

      // Vertical extent follows the lesson, with a little air either side, so
      // a two-octave piece and a five-note one both fill the canvas.
      let lo = -400
      let hi = 1300
      if (notes.length) {
        const cents = notes.filter((n) => !n.rest).map((n) => n.targetCents)
        if (cents.length) {
          lo = Math.min(...cents) - 350
          hi = Math.max(...cents) + 350
        }
      }
      const span = hi - lo || 1

      const playX = w * 0.32
      const pxPerSec = (w - playX) / windowSec
      const x = (time: number) => playX + (time - t) * pxPerSec
      const y = (cents: number) => h - ((cents - lo) / span) * h

      ctx!.clearRect(0, 0, w, h)

      // Raga rungs behind everything.
      for (let sthayi = -1; sthayi <= 1; sthayi++) {
        for (const semitone of ragaSemitones) {
          const c = (semitone + 12 * sthayi) * 100
          if (c < lo || c > hi) continue
          const ry = y(c)
          ctx!.strokeStyle = semitone === 0 ? 'rgba(200,155,74,0.35)' : 'rgba(43,48,87,0.8)'
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.moveTo(30, ry)
          ctx!.lineTo(w, ry)
          ctx!.stroke()
          ctx!.fillStyle = semitone === 0 ? '#c89b4a' : '#5c5f85'
          ctx!.font = '10px "IBM Plex Mono", monospace'
          ctx!.textBaseline = 'middle'
          ctx!.fillText(
            labelWithSthayi(
              resolveSwara(semitone, ragaSemitones).name,
              sthayi as -1 | 0 | 1,
            ),
            3,
            ry,
          )
        }
      }

      // Target lanes.
      const laneH = Math.max(6, (toleranceCents * 2 * h) / span)
      for (const n of notes) {
        if (n.rest) continue
        const x1 = x(n.t0)
        const x2 = x(n.t1)
        if (x2 < 0 || x1 > w) continue
        const ny = y(n.targetCents)
        const live = t >= n.t0 && t < n.t1

        ctx!.fillStyle = live ? 'rgba(232,179,61,0.32)' : 'rgba(200,155,74,0.14)'
        roundRect(ctx!, x1, ny - laneH / 2, Math.max(2, x2 - x1 - 2), laneH, 3)
        ctx!.fill()

        ctx!.strokeStyle = live ? '#e8b33d' : 'rgba(200,155,74,0.45)'
        ctx!.lineWidth = live ? 1.6 : 1
        ctx!.stroke()

        if (n.syllable && x2 - x1 > 14) {
          ctx!.fillStyle = live ? '#f2ede3' : '#8b8cad'
          ctx!.font = '11px "IBM Plex Sans", sans-serif'
          ctx!.textAlign = 'center'
          ctx!.fillText(n.syllable, (x1 + x2) / 2, ny - laneH / 2 - 6)
          ctx!.textAlign = 'left'
        }
      }

      // Record the live frame, then draw the trace behind the playhead.
      const frame = latest.current
      history.current.push({ t, cents: frame?.cents ?? null })
      while (history.current.length && history.current[0].t < t - HISTORY_SEC) {
        history.current.shift()
      }

      ctx!.lineWidth = 2.4
      ctx!.lineJoin = 'round'
      let pen = false
      let lastColour = ''
      for (const p of history.current) {
        if (p.cents == null) {
          if (pen) ctx!.stroke()
          pen = false
          continue
        }
        const colour = traceColour(p.cents, p.t, notes, toleranceCents)
        const px = x(p.t)
        const py = y(Math.max(lo, Math.min(hi, p.cents)))
        if (!pen || colour !== lastColour) {
          if (pen) ctx!.stroke()
          ctx!.beginPath()
          ctx!.strokeStyle = colour
          ctx!.moveTo(px, py)
          lastColour = colour
          pen = true
        } else {
          ctx!.lineTo(px, py)
        }
      }
      if (pen) ctx!.stroke()

      // Playhead.
      ctx!.strokeStyle = 'rgba(242,237,227,0.55)'
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.moveTo(playX, 0)
      ctx!.lineTo(playX, h)
      ctx!.stroke()

      // The live dot, so the eye has something to follow.
      if (frame?.cents != null) {
        const py = y(Math.max(lo, Math.min(hi, frame.cents)))
        ctx!.fillStyle = traceColour(frame.cents, t, notes, toleranceCents)
        ctx!.beginPath()
        ctx!.arc(playX, py, 5, 0, Math.PI * 2)
        ctx!.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [timeline, latest, ragaSemitones, now, windowSec, height, toleranceCents])

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height }}
      role="img"
      aria-label="Live pitch against the notes you should be singing"
    />
  )
}

/** Green inside the lane, amber near it, red outside, grey when nothing is due. */
function traceColour(
  cents: number,
  t: number,
  notes: readonly ExpectedNote[],
  tolerance: number,
): string {
  const note = notes.find((n) => !n.rest && t >= n.t0 && t < n.t1)
  if (!note) return '#8b8cad'
  const off = Math.abs(cents - note.targetCents)
  if (off <= tolerance) return '#7ba05b'
  if (off <= tolerance * 2) return '#e8b33d'
  return '#c7472f'
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}
