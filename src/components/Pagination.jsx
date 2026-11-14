import { ChevronLeft, ChevronRight } from 'lucide-react'

/** Previous / Next buttons with the current page. Buttons disable at the first and last page. */
export default function Pagination({ page, totalPages, onChange, disabled = false }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        <ChevronLeft size={18} /> Previous
      </button>
      <span className="page-info">
        Page <strong>{page}</strong> of {totalPages.toLocaleString()}
      </span>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Next <ChevronRight size={18} />
      </button>
    </nav>
  )
}
