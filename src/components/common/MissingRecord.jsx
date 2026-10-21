import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { EmptyState } from './ui'

/** Friendly "record not found" state for unknown course, instructor or path ids. */
export default function MissingRecord({ title = 'We couldn’t find that page', description, backTo = '/', backLabel = 'Back to home', secondary }) {
  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-xl">
        <EmptyState
          icon={FileQuestion}
          titleAs="h1"
          title={title}
          description={description || 'It may have been removed, unpublished, or the link may be incorrect.'}
          action={(
            <>
              <Link to={backTo} className="btn btn-primary">{backLabel}</Link>
              {secondary}
            </>
          )}
        />
      </div>
    </div>
  )
}
