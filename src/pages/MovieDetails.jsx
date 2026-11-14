import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Film, Heart, Play, Star } from 'lucide-react'
import ErrorMessage from '../components/ErrorMessage'
import MovieRow from '../components/MovieRow'
import TrailerModal from '../components/TrailerModal'
import { useFavorites } from '../hooks/useFavorites'
import { useFetch } from '../hooks/useFetch'
import { getMovieDetails } from '../services/tmdb'
import { formatDate, formatRating, formatRuntime, getYear, imageUrl, pickTrailer } from '../utils/helpers'

/** Route "/movie/:id" - everything about one movie. */
export default function MovieDetails() {
  const { id } = useParams()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [showTrailer, setShowTrailer] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)

  const { data: movie, loading, error, retry } = useFetch((signal) => getMovieDetails(id, signal), [id])

  // Reset local UI state and update the browser tab title for each movie.
  useEffect(() => {
    setShowTrailer(false)
    setPosterFailed(false)
  }, [id])

  useEffect(() => {
    document.title = movie ? `${movie.title} - CineFind` : 'CineFind - Movie Discovery'
    return () => { document.title = 'CineFind - Movie Discovery' }
  }, [movie])

  if (loading) {
    return (
      <div className="container page" role="status" aria-label="Loading movie">
        <div className="details-skeleton">
          <div className="skeleton details-poster-skeleton" />
          <div className="details-lines">
            <div className="skeleton skeleton-line big" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container page">
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link>
        <ErrorMessage error={error} onRetry={retry} title="Could not load this movie" />
      </div>
    )
  }

  const trailer = pickTrailer(movie.videos)
  const favorite = isFavorite(movie.id)
  const poster = imageUrl(movie.poster_path, 'w500')
  const backdrop = imageUrl(movie.backdrop_path, 'w1280')
  const similar = (movie.similar?.results ?? []).filter((item) => item.poster_path).slice(0, 12)

  return (
    <article className="details">
      <div className="details-hero">
        {backdrop && <img className="details-backdrop" src={backdrop} alt="" />}
        <div className="details-overlay" />

        <div className="container details-body">
          <div className="details-poster">
            {poster && !posterFailed ? (
              <img src={poster} alt={`${movie.title} poster`} onError={() => setPosterFailed(true)} />
            ) : (
              <div className="poster-placeholder"><Film size={48} /><span>No poster</span></div>
            )}
          </div>

          <div className="details-info">
            <Link to="/discover" className="back-link"><ArrowLeft size={16} /> Back to discover</Link>
            <h1>
              {movie.title} <span className="year">({getYear(movie.release_date)})</span>
            </h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}

            <div className="meta-row">
              <span className="rating"><Star size={16} fill="currentColor" /> {formatRating(movie.vote_average)}</span>
              <span className="meta-item"><Calendar size={15} /> {formatDate(movie.release_date)}</span>
              <span className="meta-item"><Clock size={15} /> {formatRuntime(movie.runtime)}</span>
            </div>

            {movie.genres?.length > 0 && (
              <div className="chips">
                {movie.genres.map((genre) => (
                  <Link key={genre.id} to={`/discover?genre=${genre.id}`} className="chip">{genre.name}</Link>
                ))}
              </div>
            )}

            <h2 className="mini-title">Overview</h2>
            <p className="overview">{movie.overview || 'No overview is available for this movie yet.'}</p>

            <div className="hero-actions">
              {trailer && (
                <button type="button" className="btn btn-primary" onClick={() => setShowTrailer(true)}>
                  <Play size={18} fill="currentColor" /> Watch trailer
                </button>
              )}
              <button
                type="button"
                className={`btn ${favorite ? 'btn-favorite active' : 'btn-glass'}`}
                onClick={() => toggleFavorite(movie)}
                aria-pressed={favorite}
              >
                <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
                {favorite ? 'Remove from favorites' : 'Add to favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {movie.production_companies?.length > 0 && (
          <section className="section compact">
            <h2>Production companies</h2>
            <div className="chips">
              {movie.production_companies.map((company) => (
                <span key={company.id} className="chip chip-solid">{company.name}</span>
              ))}
            </div>
          </section>
        )}

        {trailer && (
          <section className="section compact">
            <h2>Trailer</h2>
            <button type="button" className="trailer-thumb" onClick={() => setShowTrailer(true)} aria-label="Play trailer">
              <img src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`} alt="" loading="lazy" />
              <span className="play-circle"><Play size={30} fill="currentColor" /></span>
            </button>
          </section>
        )}

        {similar.length > 0 && (
          <section className="section compact">
            <h2>Similar movies</h2>
            <MovieRow movies={similar} />
          </section>
        )}
      </div>

      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} title={movie.title} onClose={() => setShowTrailer(false)} />
      )}
    </article>
  )
}
