import { useEffect, useState } from 'react'

/**
 * Returns `value` only after it stopped changing for `delay` ms.
 * Used by the search box so we call the TMDB API once the user pauses
 * typing instead of on every single keystroke.
 */
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // restart the timer on every new keystroke
  }, [value, delay])

  return debounced
}
