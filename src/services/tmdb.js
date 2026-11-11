// ---------------------------------------------------------------------------
// TMDB service module
// All network requests live here so React components never call fetch()
// directly. Components just call functions like getPopularMovies().
// Docs: https://developer.themoviedb.org/docs
// ---------------------------------------------------------------------------

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// TMDB never returns more than 500 pages for any list.
export const MAX_PAGES = 500

// A custom error so the UI can show a friendly message for each situation.
export class TmdbError extends Error {
  constructor(message, type) {
    super(message)
    this.name = 'TmdbError'
    this.type = type // 'missing-key' | 'invalid-key' | 'network' | 'not-found' | 'rate-limit' | 'server'
  }
}

/**
 * Core request helper used by every endpoint below.
 * - Adds the API key and language to the query string
 * - Skips empty params
 * - Turns every failure into a TmdbError with a readable message
 * - Supports an AbortSignal so effects can cancel outdated requests
 */
async function request(path, params = {}, signal) {
  if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY') {
    throw new TmdbError(
      'TMDB API key is missing. Create a .env file with VITE_TMDB_API_KEY and restart the dev server.',
      'missing-key',
    )
  }

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  let response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error // not a real failure, caller cancelled
    throw new TmdbError(
      'Network error. Please check your internet connection and try again.',
      'network',
    )
  }

  if (response.status === 401) {
    throw new TmdbError(
      'Invalid TMDB API key. Check the VITE_TMDB_API_KEY value in your .env file.',
      'invalid-key',
    )
  }
  if (response.status === 404) {
    throw new TmdbError('We could not find what you were looking for.', 'not-found')
  }
  if (response.status === 429) {
    throw new TmdbError('Too many requests. Please wait a moment and retry.', 'rate-limit')
  }
  if (!response.ok) {
    throw new TmdbError('TMDB is having problems right now. Please try again later.', 'server')
  }

  return response.json()
}

// ---------- Movie lists ----------

export const getTrendingMovies = (signal) =>
  request('/trending/movie/week', {}, signal)

export const getPopularMovies = (page = 1, signal) =>
  request('/movie/popular', { page }, signal)

export const getTopRatedMovies = (page = 1, signal) =>
  request('/movie/top_rated', { page }, signal)

export const getUpcomingMovies = (page = 1, signal) =>
  request('/movie/upcoming', { page }, signal)

// ---------- Search ----------

export const searchMovies = (query, page = 1, signal) =>
  request('/search/movie', { query, page, include_adult: false }, signal)

// ---------- Discover (genre filter + sorting done by TMDB itself) ----------

// Maps our friendly sort names to TMDB field names.
const SORT_FIELDS = {
  popularity: 'popularity',
  rating: 'vote_average',
  date: 'primary_release_date',
}

export function discoverMovies({ page = 1, genre, sortBy = 'popularity', order = 'desc' }, signal) {
  const today = new Date().toISOString().slice(0, 10)
  return request(
    '/discover/movie',
    {
      page,
      with_genres: genre,
      sort_by: `${SORT_FIELDS[sortBy]}.${order}`,
      include_adult: false,
      // Ignore movies with only a handful of votes when sorting by rating,
      // otherwise obscure 10/10 movies fill the top of the list.
      'vote_count.gte': sortBy === 'rating' ? 300 : undefined,
      // When sorting newest first, hide movies that have not been released yet.
      'primary_release_date.lte': sortBy === 'date' && order === 'desc' ? today : undefined,
    },
    signal,
  )
}

// ---------- Genres (cached because the list never changes during a session) ----------

let genresCache = null

export async function getGenres(signal) {
  if (genresCache) return genresCache
  const data = await request('/genre/movie/list', {}, signal)
  genresCache = data.genres
  return genresCache
}

// ---------- Single movie ----------

/**
 * One request returns details + videos + similar movies using TMDB's
 * "append_to_response" feature (same data as calling
 * /movie/{id}, /movie/{id}/videos and /movie/{id}/similar separately).
 */
export const getMovieDetails = (id, signal) =>
  request(`/movie/${id}`, { append_to_response: 'videos,similar' }, signal)

export const getMovieVideos = (id, signal) =>
  request(`/movie/${id}/videos`, {}, signal)
