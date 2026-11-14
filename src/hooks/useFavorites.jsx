import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toFavorite } from '../utils/helpers'

const STORAGE_KEY = 'cinefind:favorites'
const FavoritesContext = createContext(null)

/** Reads the saved list from localStorage (safe if data is missing or broken). */
function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

/**
 * Provider that keeps favorites in ONE React state shared by the whole app.
 * Every change is written to localStorage, so favorites survive a refresh.
 * Because all components read the same state, hearts on cards, the navbar
 * badge and the Favorites page always stay in sync.
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites)

  // State -> localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // storage full or blocked (private mode): the app still works for this session
    }
  }, [favorites])

  // Keep multiple browser tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setFavorites(loadFavorites())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFavorite = useCallback(
    (id) => favorites.some((movie) => movie.id === id),
    [favorites],
  )

  // Adds the movie if it is new, removes it if it already exists (no duplicates).
  const toggleFavorite = useCallback((movie) => {
    setFavorites((current) =>
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [toFavorite(movie), ...current],
    )
  }, [])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, clearFavorites],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside <FavoritesProvider>')
  return context
}
