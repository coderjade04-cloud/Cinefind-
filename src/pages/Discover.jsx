import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import ErrorMessage from '../components/ErrorMessage'
import FilterBar from '../components/FilterBar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import MovieGrid from '../components/MovieGrid'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import { useDebounce } from '../hooks/useDebounce'
import { useFetch } from '../hooks/useFetch'
import { MAX_PAGES, discoverMovies, getGenres, searchMovies } from '../services/tmdb'
import { sortMovies } from '../utils/helpers'

/**
 * Route "/discover" - search + genre filter + sorting + pagination.
 *
 * All four controls are stored in the URL (?q=...&genre=...&sortBy=...&page=...)
 * so the page can be refreshed, bookmarked or shared and still show the same results.
 */
export default function Discover() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const searchRef = useRef(null)

  // ----- Read the current state from the URL -----
  const query = params.get('q') ?? ''
  const genre = params.get('genre') ?? ''
  const sortBy = params.get('sortBy') ?? 'popularity'
  const order = params.get('order') ?? 'desc'
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)

  // What the user is typing right now (the URL only updates after a pause).
  const [input, setInput] = useState(query)
  const debouncedInput = useDebounce(input, 500)

  /**
   * Updates URL params. Filters/search/sort go back to page 1 automatically;
   * only a page change keeps the page number.
   */
  const updateParams = (changes, { replace = false } = {}) => {
    const next = new URLSearchParams(params)
    if (!('page' in changes)) next.delete('page')
    Object.entries(changes).forEach(([key, value]) => {
      const isDefault =
        value === '' || value == null ||
        (key === 'sortBy' && value === 'popularity') ||
        (key === 'order' && value === 'desc') ||
        (key === 'page' && Number(value) === 1)
      if (isDefault) next.delete(key)
      else next.set(key, value)
    })
    setParams(next, { replace })
  }

  // Debounced typing -> URL (this is what triggers the API request).
  useEffect(() => {
    const trimmed = debouncedInput.trim()
    if (trimmed !== query) updateParams({ q: trimmed }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  // Focus the search box when arriving from the navbar "Search" button.
  useEffect(() => {
    if (location.state?.focusSearch) searchRef.current?.focus()
  }, [location.key, location.state])

  // ----- Data -----
  const genres = useFetch((signal) => getGenres(signal), [])

  const results = useFetch(
    (signal) =>
      query
        ? searchMovies(query, page, signal)
        : discoverMovies({ page, genre, sortBy, order }, signal),
    [query, page, genre, sortBy, order],
  )

  /**
   * Discover requests are filtered/sorted by TMDB itself.
   * The search endpoint cannot do that, so for searches we filter by genre
   * and sort the current page of results here in the browser.
   */
  const movies = useMemo(() => {
    let list = results.data?.results ?? []
    if (query) {
      if (genre) list = list.filter((movie) => movie.genre_ids?.includes(Number(genre)))
      list = sortMovies(list, sortBy, order)
    }
    return list
  }, [results.data, query, genre, sortBy, order])

  const totalPages = Math.min(results.data?.total_pages ?? 1, MAX_PAGES)
  const totalResults = results.data?.total_results ?? 0
  const typingPending = input.trim() !== query
  const busy = results.loading || typingPending

  const changePage = (newPage) => {
    updateParams({ page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetAll = () => {
    setInput('')
    setParams({})
  }

  // ----- What to show -----
  let content
  if (results.loading) {
    content = <LoadingSkeleton count={20} />
  } else if (results.error) {
    content = <ErrorMessage error={results.error} onRetry={results.retry} title="Could not load movies" />
  } else if (movies.length === 0) {
    const noSearchMatches = query && totalResults === 0
    content = (
      <div className="state-box">
        <SearchX size={40} />
        <h3>{noSearchMatches ? `No results for "${query}"` : 'No movies match your filters'}</h3>
        <p className="muted">
          {noSearchMatches
            ? 'Check the spelling or try a different title or keyword.'
            : 'Try another genre, another page, or reset the filters.'}
        </p>
        <button type="button" className="btn btn-primary" onClick={resetAll}>Clear search and filters</button>
      </div>
    )
  } else {
    content = <MovieGrid movies={movies} />
  }

  return (
    <div className="container page">
      <header className="page-head">
        <h1>{query ? `Results for "${query}"` : 'Discover movies'}</h1>
        {!results.loading && !results.error && totalResults > 0 && (
          <p className="muted">{totalResults.toLocaleString()} movies found</p>
        )}
      </header>

      <SearchBar value={input} onChange={setInput} loading={busy && input.trim() !== ''} inputRef={searchRef} />

      <FilterBar
        genres={genres.data ?? []}
        genre={genre}
        sortBy={sortBy}
        order={order}
        onChange={(changes) => updateParams(changes)}
        onReset={resetAll}
      />
      {query && (
        <p className="muted hint">While searching, genre and sorting apply to the results on the current page.</p>
      )}

      <div className="results">{content}</div>

      {!results.error && (
        <Pagination page={page} totalPages={totalPages} onChange={changePage} disabled={results.loading} />
      )}
    </div>
  )
}
