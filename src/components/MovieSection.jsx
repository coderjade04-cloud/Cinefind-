import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorMessage from './ErrorMessage'
import MovieGrid from './MovieGrid'
import MovieRow from './MovieRow'

/**
 * A titled homepage section that handles the 3 states of an API request:
 * loading (skeletons), error (message + retry) and success (row or grid).
 * `request` is the object returned by useFetch().
 */
export default function MovieSection({
  title,
  subtitle,
  request,
  layout = 'grid', // 'grid' | 'row'
  limit = 12,
  dateStyle,
  linkTo = '/discover',
}) {
  const { data, loading, error, retry } = request
  const movies = data?.results?.filter((movie) => movie.title).slice(0, limit) ?? []

  let content
  if (loading) {
    content = <LoadingSkeleton count={layout === 'row' ? 8 : Math.min(limit, 6)} layout={layout} />
  } else if (error) {
    content = <ErrorMessage error={error} onRetry={retry} title={`Could not load ${title.toLowerCase()}`} />
  } else if (movies.length === 0) {
    content = <p className="muted">No movies to show right now.</p>
  } else {
    content =
      layout === 'row' ? (
        <MovieRow movies={movies} dateStyle={dateStyle} />
      ) : (
        <MovieGrid movies={movies} dateStyle={dateStyle} />
      )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          <Link to={linkTo} className="see-all">
            See all <ArrowRight size={16} />
          </Link>
        </div>
        {content}
      </div>
    </section>
  )
}
