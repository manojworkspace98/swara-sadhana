/**
 * Ornaments drawn from the forms this music lives among: the kolam laid at the
 * threshold each morning, the stepped temple border woven into a saree, the
 * torana arch over a shrine. All are SVG, all inherit `currentColor`, and all
 * are marked aria-hidden — they carry mood, never information.
 */

/**
 * A sikku kolam chain: two interlacing waves crossing at the pulli (dots).
 * Used where a page would otherwise just have whitespace between sections.
 */
export function KolamDivider({
  className = '',
  width = 240,
}: {
  className?: string
  width?: number
}) {
  const unit = 40
  const units = Math.max(2, Math.round(width / unit))
  const w = units * unit
  const wave = (up: boolean) => {
    let d = `M0,12`
    for (let i = 0; i < units; i++) {
      const x = i * unit
      const first = up ? 0 : 24
      const second = up ? 24 : 0
      d += ` Q${x + 10},${first} ${x + 20},12 Q${x + 30},${second} ${x + unit},12`
    }
    return d
  }

  return (
    <svg
      viewBox={`0 0 ${w} 24`}
      width={w}
      height={24}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path d={wave(true)} stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d={wave(false)} stroke="currentColor" strokeWidth="1" opacity="0.55" />
      {Array.from({ length: units * 2 + 1 }, (_, i) => (
        <circle key={i} cx={i * 20} cy={12} r="1.6" fill="currentColor" opacity="0.85" />
      ))}
    </svg>
  )
}

/**
 * The stepped temple spire that runs along a saree's border — a gopuram in
 * profile, repeated. Sits at the head of a card the way it sits at a hem.
 */
export function TempleBorder({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 8"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern id="temple-hem" width="12" height="8" patternUnits="userSpaceOnUse">
          <path d="M0,8 L0,5 L2,5 L2,3 L4,3 L4,1 L6,1 L8,3 L8,5 L10,5 L10,8 Z" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="24" height="8" fill="url(#temple-hem)" />
    </svg>
  )
}

/**
 * A torana: the arch framing a shrine. Wraps the Goddess on the invocation
 * screen so the image reads as enshrined rather than merely placed.
 */
export function Torana({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 200 40"
        className="absolute -top-[26px] left-1/2 w-[124%] -translate-x-1/2 text-[var(--color-brass)]"
        aria-hidden="true"
        fill="none"
      >
        {/* The arch itself, with a finial at its crown. */}
        <path
          d="M14,40 C14,14 58,2 100,2 C142,2 186,14 186,40"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.75"
        />
        <path
          d="M24,40 C24,20 62,10 100,10 C138,10 176,20 176,40"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <path d="M100,2 L100,-6 M96,-2 L104,-2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="100" cy="-8" r="2.4" fill="currentColor" />
        {/* Mango-leaf toran hanging from the arch. */}
        {[40, 62, 84, 116, 138, 160].map((x, i) => (
          <path
            key={i}
            d={`M${x},${archY(x)} q-3,7 0,11 q3,-4 0,-11`}
            fill="currentColor"
            opacity="0.5"
          />
        ))}
      </svg>
      {children}
    </div>
  )
}

/** Height of the arch curve at a given x, so the leaves hang from it. */
function archY(x: number): number {
  const t = (x - 14) / 172
  return 40 - 38 * Math.sin(Math.PI * t) ** 0.8
}

/**
 * A lamp flame, for the streak. A practice streak is a lamp kept lit — the
 * metaphor is already the right one, so it need not be explained in copy.
 */
export function Diya({ lit, className = '' }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 28" className={className} aria-hidden="true" fill="none">
      {lit && (
        <>
          <path
            d="M12,2 C15,7 16,9 16,12 C16,15.3 14.2,17 12,17 C9.8,17 8,15.3 8,12 C8,9 9,7 12,2 Z"
            fill="var(--color-turmeric)"
          />
          <path
            d="M12,7 C13.4,10 14,11 14,12.6 C14,14.4 13.1,15.4 12,15.4 C10.9,15.4 10,14.4 10,12.6 C10,11 10.6,10 12,7 Z"
            fill="#fff5d6"
            opacity="0.9"
          />
        </>
      )}
      <path
        d="M3,20 C3,20 5,26 12,26 C19,26 21,20 21,20 Z"
        fill="currentColor"
        opacity={lit ? 1 : 0.45}
      />
      <ellipse cx="12" cy="20" rx="9" ry="2.2" fill="currentColor" opacity={lit ? 0.9 : 0.4} />
    </svg>
  )
}
