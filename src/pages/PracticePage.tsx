import { useParams } from 'react-router'
import { PageHeader, Placeholder } from '../components/PageHeader'

export function PracticePage() {
  const { lessonId } = useParams()
  return (
    <>
      <PageHeader eyebrow="Practice" title={lessonId ?? 'Lesson'} />
      <Placeholder>The lesson player loads here.</Placeholder>
    </>
  )
}
