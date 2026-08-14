import { KolamDivider } from './Ornament'

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: string
  lead?: string
}) {
  return (
    <header className="mb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-1 text-3xl md:text-4xl">{title}</h1>
      <KolamDivider className="mt-3 text-[var(--color-brass)] opacity-60" width={200} />
      {lead && <p className="mt-3 max-w-prose text-[var(--color-muted)]">{lead}</p>}
    </header>
  )
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return <div className="card p-6 text-sm text-[var(--color-muted)]">{children}</div>
}
