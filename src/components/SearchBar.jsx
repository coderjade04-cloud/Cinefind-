import { Loader2, Search, X } from 'lucide-react'

/**
 * Controlled search input with a search icon, clear button and spinner.
 * The parent owns the text (`value`) and decides when to call the API.
 */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  loading = false,
  inputRef,
  placeholder = 'Search by title or keyword',
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) onSubmit(value.trim())
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <Search size={20} className="search-icon" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
      />
      {loading && <Loader2 size={18} className="spin search-spinner" aria-label="Searching" />}
      {value && (
        <button type="button" className="clear-btn" onClick={() => onChange('')} aria-label="Clear search">
          <X size={18} />
        </button>
      )}
    </form>
  )
}
