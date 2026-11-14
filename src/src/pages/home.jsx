import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import ErrorMessage from '../components/ErrorMessage'
import MovieSection from '../components/MovieSection'
import SearchBar from '../components/SearchBar'
import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import {
  getGenres,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from '../services/tmdb'

/** Route "/" - hero banner plus four movie sections. Each section has its own request. */
export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // Four independent requests so one failure does not break the whole page.
  const trending = useFetch((signal) => getTrendingMovies(signal), [])
  const popular = useFetch((signal) => getPopularMovies(1, signal), [])
  const topRated = useFetch((signal) => getTopRatedMovies(1, signal), [])
  const upcoming = useFetch((signal) => getUpcomingMovies(1, signal), [])
  const genres = useFetch((signal) => getGenres(signal), [])

  // Pressing Enter in the search box opens Discover with the query in the URL.
  const goSearch = (text) => {
    if (text) navigate(`/discover?q=${encodeURIComponent(text)}`)
  }

  let hero
  if (trending.loading) {
    hero = <div className="hero hero-skeleton skeleton" role="status" aria-label="Loading featured movie" />
  } else if (trending.error) {
    hero = (
      <div className="container page">
        <ErrorMessage error={trending.error} onRetry={trending.retry} title="Could not load featured movies" />
      </div>
    )
  } else {
    hero = <Hero movies={trending.data?.results ?? []} genres={genres.data ?? []} />
  }

  return (
    <>
      {hero}

      <div className="container home-search">
        <SearchBar value={query} onChange={setQuery} onSubmit={goSearch} />
      </div>

      <MovieSection
        title="Trending Movies"
        subtitle="What everyone is watching this week"
        request={trending}
        layout="row"
        limit={20}
      />
      <MovieSection
        title="Popular Movies"
        subtitle="Fan favorites right now"
        request={popular}
        limit={12}
      />
      <MovieSection
        title="Top Rated Movies"
        subtitle="The best rated movies of all time"
        request={topRated}
        limit={6}
        linkTo="/discover?sortBy=rating"
      />
      <MovieSection
        title="Upcoming Movies"
        subtitle="Coming soon to theaters"
        request={upcoming}
        limit={6}
        dateStyle="full"
      />
    </>
  )
}
