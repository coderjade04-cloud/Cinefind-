import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info, Play, Star } from 'lucide-react'
import TrailerModal from './TrailerModal'
import { useFetch } from '../hooks/useFetch'
import { getMovieVideos } from '../services/tmdb'
import { formatRating, getYear, imageUrl, pickTrailer } from '../utils/helpers'

/**
 * Featured movie banner. Shows the top trending movies one at a time
 * (choose with the dots) and loads the trailer of the selected movie.
 */
export default function Hero({ movies, genres = [] }) {
  const [index, setIndex] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)

  // Only movies that have a backdrop and overview look good in the hero.
  const featured = useMemo(
    () => movies.filter((movie) => movie.backdrop_path && movie.overview).slice(0, 5),
    [movies],
  )
  const movie = featured[index]

  const videos = useFetch(
    (signal) => (movie ? getMovieVideos(movie.id, signal) : Promise.resolve(null)),
    [movie?.id],
  )

  if (!movie) return null

  const trailer = pickTrailer(videos.data)
  const genreNames = (movie.genre_ids || [])
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3)

  return (
    <section className="hero">
      <img
        key={movie.id}
        className="hero-backdrop"
        src={imageUrl(movie.backdrop_path, 'w1280')}
        alt=""
      />
      <div className="hero-overlay" />

      <div className="container hero-content">
        <span className="pill">Trending this week</span>
        <h1>{movie.title}</h1>
        <div className="meta-row">
          <span className="rating"><Star size={16} fill="currentColor" /> {formatRating(movie.vote_average)}</span>
          <span>{getYear(movie.release_date)}</span>
          {genreNames.map((name) => (
            <span key={name} className="chip">{name}</span>
          ))}
        </div>
        <p className="hero-overview">{movie.overview}</p>

        <div className="hero-actions">
          {trailer && (
            <button type="button" className="btn btn-primary" onClick={() => setShowTrailer(true)}>
              <Play size={18} fill="currentColor" /> Watch trailer
            </button>
          )}
          <Link to={`/movie/${movie.id}`} className="btn btn-glass">
            <Info size={18} /> View details
          </Link>
        </div>

        {featured.length > 1 && (
          <div className="hero-dots" role="tablist" aria-label="Featured movies">
            {featured.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${item.title}`}
                className={i === index ? 'dot active' : 'dot'}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} title={movie.title} onClose={() => setShowTrailer(false)} />
      )}
    </section>
  )
}
