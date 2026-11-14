/** Grey animated placeholders that look like movie cards while data loads. */
export function SkeletonCard() {
  return (
    <div className="movie-card skeleton-card" aria-hidden="true">
      <div className="poster skeleton" />
      <div className="movie-info">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ count = 12, layout = 'grid' }) {
  return (
    <div
      className={layout === 'row' ? 'movie-row' : 'movie-grid'}
      role="status"
      aria-label="Loading movies"
    >
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}
