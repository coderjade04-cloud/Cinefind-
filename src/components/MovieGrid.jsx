import MovieCard from './MovieCard'

/** Responsive grid of movie cards. */
export default function MovieGrid({ movies, dateStyle, showRemove }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} dateStyle={dateStyle} showRemove={showRemove} />
      ))}
    </div>
  )
}
