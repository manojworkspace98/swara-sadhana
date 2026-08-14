import { useEffect, useRef } from 'react'
import { hzForSwara, labelWithSthayi, locatePitch, resolveSwara } from '../engine/swara'
import type { PitchFrame } from '../engine/types'

/** Within this the note counts as in tune; past it the needle turns. */
export const IN_TUNE_CENTS = 25
export const NEAR_CENTS = 50

export interface LadderProps {
  saHz: number
  ragaSemitones: readonly number[]
  /** Read imperatively each frame — this never re-renders per pitch frame. */
  latest: React.RefObject<PitchFrame | null>
  /** Cents range shown, relative to Sa. Mandra Pa to tara Ga by default. */
  lowCents?: number
  highCents?: number
  height?: number
}

/**
 * Pitch is vertical in this music — sthayi means "storey" — so the ladder is
 * too. Rungs are the raga's own notes; the needle is the singer.
 *
 * Drawn on a canvas in one rAF loop rather than as React state: at 94 frames a
 * second, re-rendering the tree would cost more than the drawing does.
 */
export function SwaraLadder({
  saHz,
  ragaSemitones,
  latest,
  // Mandra Pa to tara Sa: the span the first several years of lessons live in.
  lowCents = -520,
  highCents = 1260,
  height = 420,
}: LadderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Every raga rung between the low and high bounds, with its name. Octave
    // is carried by the dot above or below, exactly as written notation does —
    // without it, mandra Sa and madhya Sa are the same two letters.
    const rungs: { cents: number; label: string; isSa: boolean }[] = []
    for (let sthayi = -1 as -1 | 0 | 1; sthayi <= 1; sthayi++) {
      for (const semitone of ragaSemitones) {
        const c = (semitone + 12 * sthayi) * 100
        if (c < lowCents || c > highCents) continue
        rungs.push({
          cents: c,
          label: labelWithSthayi(resolveSwara(semitone, ragaSemitones).name, sthayi),
          isSa: semitone === 0,
        })
      }
    }

    function resize() {
      const w = canvas!.clientWidth
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const yFor = (cents: number, h: number) =>
      h - ((cents - lowCents) / (highCents - lowCents)) * h

    function draw() {
      const w = canvas!.clientWidth
      const h = height
      ctx!.clearRect(0, 0, w, h)

      const labelX = 34
      const trackX = labelX + 18

      for (const rung of rungs) {
        const y = yFor(rung.cents, h)
        ctx!.strokeStyle = rung.isSa ? 'rgba(200,155,74,0.55)' : 'rgba(43,48,87,0.9)'
        ctx!.lineWidth = rung.isSa ? 1.5 : 1
        ctx!.beginPath()
        ctx!.moveTo(trackX, y)
        ctx!.lineTo(w - 8, y)
        ctx!.stroke()

        ctx!.fillStyle = rung.isSa ? '#c89b4a' : '#8b8cad'
        ctx!.font = `${rung.isSa ? 600 : 400} 12px "IBM Plex Mono", monospace`
        ctx!.textAlign = 'right'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(rung.label, labelX, y)
      }

      const frame = latest.current
      if (frame?.cents != null) {
        const cents = Math.max(lowCents, Math.min(highCents, frame.cents))
        const y = yFor(cents, h)
        const off = Math.abs(locatePitch(frame.hz!, saHz).centsOff)
        const colour =
          off <= IN_TUNE_CENTS ? '#7ba05b' : off <= NEAR_CENTS ? '#e8b33d' : '#c7472f'

        ctx!.fillStyle = `${colour}22`
        ctx!.fillRect(trackX, y - 9, w - trackX - 8, 18)

        ctx!.strokeStyle = colour
        ctx!.lineWidth = 2.5
        ctx!.beginPath()
        ctx!.moveTo(trackX, y)
        ctx!.lineTo(w - 8, y)
        ctx!.stroke()

        ctx!.fillStyle = colour
        ctx!.beginPath()
        ctx!.arc(w - 8, y, 4.5, 0, Math.PI * 2)
        ctx!.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [saHz, ragaSemitones, latest, lowCents, highCents, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height }}
      role="img"
      aria-label="Swara ladder showing your live pitch"
    />
  )
}

/** Frequency of the rung nearest a pitch, for the reference tone button. */
export function rungHz(semitone: number, sthayi: -1 | 0 | 1, saHz: number): number {
  return hzForSwara(semitone, sthayi, saHz)
}
