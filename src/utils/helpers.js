// Small pure helper functions shared by many components.

const IMAGE_BASE = 'https://image.tmdb.org/t/p/'

/** Builds a full TMDB image URL. Returns null when TMDB has no image. */
export function imageUrl(path, size = 'w342') {
  return path ? `${IMAGE_BASE}${size}${path}` : null
}

/** "2024-07-26" -> "2024" */
export function getYear(dateString) {
  return dateString ? dateString.slice(0, 4) : 'TBA'
}

/** "2024-07-26" -> "Jul 26, 2024" */
export function formatDate(dateString) {
  if (!dateString) return 'TBA'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** 7.8234 -> "7.8"; movies with no votes show "NR" (not rated). */
export function formatRating(vote) {
  return vote ? vote.toFixed(1) : 'NR'
}

/** 135 -> "2h 15m" */
export function formatRuntime(minutes) {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours ? `${hours}h ${mins}m` : `${mins}m`
}

/** Picks the best YouTube trailer from TMDB's videos response. */
export function pickTrailer(videos) {
  const results = videos?.results ?? []
  const youtube = results.filter((video) => video.site === 'YouTube')
  return (
    youtube.find((v) => v.type === 'Trailer' && v.official) ||
    youtube.find((v) => v.type === 'Trailer') ||
    youtube.find((v) => v.type === 'Teaser') ||
    null
  )
}

// Options used by the sort dropdown on the Discover page.
export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'date', label: 'Release date' },
]

/** Client-side sorting (used for search results, which TMDB cannot sort). */
export function sortMovies(movies, sortBy, order) {
  const getValue = {
    popularity: (m) => m.popularity ?? 0,
    rating: (m) => m.vote_average ?? 0,
    date: (m) => (m.release_date ? new Date(m.release_date).getTime() : 0),
  }[sortBy]
  const direction = order === 'asc' ? 1 : -1
  return [...movies].sort((a, b) => (getValue(a) - getValue(b)) * direction)
}

/** Keeps only the fields we store in localStorage for a favorite movie. */
export function toFavorite(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  }
}
