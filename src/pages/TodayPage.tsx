import { PageHeader, Placeholder } from '../components/PageHeader'

export function TodayPage() {
  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Your practice"
        lead="Warm up, work the current lesson, revisit one older one. Twenty minutes done daily beats two hours on Sunday."
      />
      <Placeholder>
        Your daily plan appears here once practice tracking is switched on.
      </Placeholder>
    </>
  )
}
