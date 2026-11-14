import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import MovieGrid from '../components/MovieGrid'
import { useFavorites } from '../hooks/useFavorites'

/** Route "/favorites" - movies saved in localStorage. */
export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites()

  const handleClear = () => {
    if (window.confirm('Remove all movies from your favorites?')) clearFavorites()
  }

  return (
    <div className="container page">
      <header className="page-head page-head-row">
        <div>
          <h1>Your favorites</h1>
          <p className="muted">
            {favorites.length === 0
              ? 'Movies you save will appear here.'
              : `${favorites.length} saved ${favorites.length === 1 ? 'movie' : 'movies'}`}
          </p>
        </div>
        {favorites.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            <Trash2 size={16} /> Clear all
          </button>
        )}
      </header>

      {favorites.length === 0 ? (
        <div className="state-box">
          <Heart size={44} />
          <h3>No favorites yet</h3>
          <p className="muted">Tap the heart on any movie to save it here. Your list stays on this device.</p>
          <Link to="/discover" className="btn btn-primary">Discover movies</Link>
        </div>
      ) : (
        <MovieGrid movies={favorites} dateStyle="full" showRemove />
      )}
    </div>
  )
}
