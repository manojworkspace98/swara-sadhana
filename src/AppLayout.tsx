import { NavLink, Outlet } from 'react-router'

/** Nav entries. Order follows the practice day: what to do now, what to
 *  learn next, the pieces, the takes you kept, how far you've come. */
const NAV = [
  { to: '/', label: 'Today', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/tuner', label: 'Tuner' },
  { to: '/songs', label: 'Songs' },
  { to: '/recordings', label: 'Takes' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' },
]

/** The four hairlines at the foot of the rail are the tanpura's strings,
 *  tuned Pa–Sa–Sa–Ṣa. */
export function AppLayout() {
  return (
    <div className="relative z-10 min-h-dvh md:grid md:grid-cols-[208px_1fr]">
      {/* Desktop rail */}
      <nav className="sticky top-0 hidden h-dvh flex-col border-r border-[var(--color-line)] px-4 py-6 md:flex">
        <NavLink to="/" className="mb-8 block">
          <span className="eyebrow block">Sādhana</span>
          <span className="font-[family-name:var(--font-display)] text-2xl leading-tight font-bold text-[var(--color-brass)]">
            Swara
          </span>
        </NavLink>

        <ul className="flex flex-col gap-1">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  [
                    'block rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--color-ink-3)] text-[var(--color-turmeric)]'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-ink-2)] hover:text-[var(--color-jasmine)]',
                  ].join(' ')
                }
              >
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex gap-[3px]" aria-hidden>
            {['#c89b4a', '#8a6c34', '#8a6c34', '#c89b4a'].map((c, i) => (
              <span
                key={i}
                className="block h-10 w-px"
                style={{ background: `linear-gradient(180deg, transparent, ${c})` }}
              />
            ))}
          </div>
          <p className="eyebrow mt-3">Pa · Sa · Sa · Ṣa</p>
        </div>
      </nav>

      <main className="min-w-0 px-5 pt-6 pb-28 md:px-10 md:pt-10 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-[var(--color-line)] bg-[var(--color-ink)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.filter((n) => n.to !== '/settings' && n.to !== '/songs').map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              [
                'flex min-h-[52px] items-center justify-center text-xs',
                isActive ? 'text-[var(--color-turmeric)]' : 'text-[var(--color-muted)]',
              ].join(' ')
            }
          >
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
