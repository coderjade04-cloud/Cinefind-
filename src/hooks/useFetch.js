import { useCallback, useEffect, useState } from 'react'

/**
 * Runs an async request inside useEffect and tracks its state.
 *
 *   const { data, loading, error, retry } = useFetch(
 *     (signal) => getPopularMovies(1, signal),
 *     [],            // re-run when anything in this list changes
 *   )
 *
 * - The AbortController cancels the old request when the component
 *   unmounts or the dependencies change (prevents out-of-order results).
 * - retry() re-runs the request, used by the "Try again" button.
 */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, loading: true, error: null })

    fetcher(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return // request was cancelled on purpose
        setState({ data: null, loading: false, error })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return { ...state, retry }
}
