import { AlertTriangle, RotateCw } from 'lucide-react'

/** Friendly error box with an optional retry button. */
export default function ErrorMessage({ error, onRetry, title = 'Something went wrong' }) {
  const message = error?.message || 'Please try again.'
  // Retrying will not fix a missing/invalid key, so hide the button in that case.
  const canRetry = onRetry && !['missing-key', 'invalid-key'].includes(error?.type)

  return (
    <div className="state-box error-box" role="alert">
      <AlertTriangle size={36} />
      <h3>{title}</h3>
      <p className="muted">{message}</p>
      {canRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          <RotateCw size={16} /> Try again
        </button>
      )}
    </div>
  )
}
