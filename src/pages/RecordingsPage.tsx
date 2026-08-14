import { PageHeader, Placeholder } from '../components/PageHeader'

export function RecordingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Takes"
        title="Recordings"
        lead="Every take you keep, with the pitch you actually sang drawn over the pitch you meant to."
      />
      <Placeholder>Recorded takes appear here.</Placeholder>
    </>
  )
}
