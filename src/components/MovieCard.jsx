import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Film, Heart, Star } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { formatDate, formatRating, getYear, imageUrl } from '../utils/helpers'

/**
 * One movie card: poster, title, year, rating and a favorite (heart) button.
 * Props:
 *  - movie: TMDB movie object
 *  - dateStyle: 'year' (default) or 'full' to show the complete release date
 *  - showRemove: shows a text "Remove" button (used on the Favorites page)
 */
export default function MovieCard({ movie, dateStyle = 'year', showRemove = false }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [imageFailed, setImageFailed] = useState(false)

  const favorite = isFavorite(movie.id)
  const poster = imageUrl(movie.poster_path, 'w342')
  const date = dateStyle === 'full' ? formatDate(movie.release_date) : getYear(movie.release_date)

  // The heart sits on top of the card link, so stop the click from opening the page.
  const handleFavorite = (event) => {
    event.preventDefault()
    event.stopPropagation()
    toggleFavorite(movie)
  }

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link" aria-label={movie.title}>
        <div className="poster">
          {poster && !imageFailed ? (
            <img
              src={poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              onError={() => setImageFailed(true)} // unavailable image -> placeholder
            />
          ) : (
            <div className="poster-placeholder">
              <Film size={36} />
              <span>No poster</span>
            </div>
          )}
          <span className="rating-badge">
            <Star size={12} fill="currentColor" /> {formatRating(movie.vote_average)}
          </span>
        </div>
        <div className="movie-info">
          <h3 title={movie.title}>{movie.title}</h3>
          <p className="muted">{date}</p>
        </div>
      </Link>

      <button
        type="button"
        className={`fav-btn${favorite ? ' active' : ''}`}
        onClick={handleFavorite}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
      >
        <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
      </button>

      {showRemove && (
        <button type="button" className="btn btn-ghost btn-small remove-btn" onClick={handleFavorite}>
          Remove
        </button>
      )}
    </article>
  )
}
