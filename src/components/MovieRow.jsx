import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'

/** Horizontally scrollable row of cards (swipe on phones, arrows on desktop). */
export default function MovieRow({ movies, dateStyle }) {
  const rowRef = useRef(null)

  const scrollRow = (direction) => {
    const row = rowRef.current
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="row-wrapper">
      <button type="button" className="row-arrow left" onClick={() => scrollRow(-1)} aria-label="Scroll left">
        <ChevronLeft size={22} />
      </button>
      <div className="movie-row" ref={rowRef}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} dateStyle={dateStyle} />
        ))}
      </div>
      <button type="button" className="row-arrow right" onClick={() => scrollRow(1)} aria-label="Scroll right">
        <ChevronRight size={22} />
      </button>
    </div>
  )
}
