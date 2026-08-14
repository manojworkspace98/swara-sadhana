import { useEffect, useRef } from 'react'

export interface TraceLayer {
  /** Cents above Sa per hop; NaN where unvoiced. */
  trace: Float32Array
  hopSec: number
  colour: string
  label: string
  /** Drawn thinner and dimmer, for the take being compared against. */
  ghost?: boolean
}

/**
 * The shape of a take, drawn as pitch against time.
 *
 * Two traces on one canvas is the whole point of the recordings library: a
 * beginner cannot hear their own improvement month to month, but they can
 * see it — the wobble flattens out and the line finds the rungs.
 */
export function PitchTraceView({
  layers,
  playheadSec,
  lowCents = -600,
  highCents = 1400,
  rungs = [],
  height = 200,
  onSeek,
}: {
  layers: TraceLayer[]
  playheadSec?: number
  lowCents?: number
  highCents?: number
  rungs?: { cents: number; label: string }[]
  height?: number
  onSeek?: (sec: number) => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  const totalSec = Math.max(
    0.001,
    ...layers.map((l) => l.trace.length * l.hopSec),
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function draw() {
      const w = canvas!.clientWidth
      const h = height
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, w, h)

      const y = (cents: number) =>
        h - ((cents - lowCents) / (highCents - lowCents)) * h
      const x = (sec: number) => (sec / totalSec) * w

      for (const rung of rungs) {
        if (rung.cents < lowCents || rung.cents > highCents) continue
        const ry = y(rung.cents)
        ctx!.strokeStyle = 'rgba(43,48,87,0.9)'
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.moveTo(24, ry)
        ctx!.lineTo(w, ry)
        ctx!.stroke()
        ctx!.fillStyle = '#8b8cad'
        ctx!.font = '10px "IBM Plex Mono", monospace'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(rung.label, 2, ry)
      }

      for (const layer of layers) {
        ctx!.strokeStyle = layer.colour
        ctx!.lineWidth = layer.ghost ? 1.2 : 2
        ctx!.globalAlpha = layer.ghost ? 0.5 : 1
        ctx!.beginPath()
        let pen = false
        for (let i = 0; i < layer.trace.length; i++) {
          const c = layer.trace[i]
          if (!Number.isFinite(c)) {
            pen = false
            continue
          }
          const px = x(i * layer.hopSec)
          const py = y(Math.max(lowCents, Math.min(highCents, c)))
          if (pen) ctx!.lineTo(px, py)
          else ctx!.moveTo(px, py)
          pen = true
        }
        ctx!.stroke()
        ctx!.globalAlpha = 1
      }

      if (playheadSec != null) {
        const px = x(playheadSec)
        ctx!.strokeStyle = 'var(--color-jasmine)'
        ctx!.strokeStyle = '#f2ede3'
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.moveTo(px, 0)
        ctx!.lineTo(px, h)
        ctx!.stroke()
      }
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [layers, playheadSec, lowCents, highCents, rungs, height, totalSec])

  return (
    <div>
      <canvas
        ref={ref}
        style={{ width: '100%', height, cursor: onSeek ? 'pointer' : 'default' }}
        onClick={(e) => {
          if (!onSeek) return
          const rect = e.currentTarget.getBoundingClientRect()
          onSeek(((e.clientX - rect.left) / rect.width) * totalSec)
        }}
        role="img"
        aria-label={`Pitch trace: ${layers.map((l) => l.label).join(' and ')}`}
      />
      {layers.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
          {layers.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-4"
                style={{ background: l.colour, opacity: l.ghost ? 0.5 : 1 }}
              />
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
