import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react'
import { SORT_OPTIONS } from '../utils/helpers'

/**
 * Genre dropdown + sort dropdown + ascending/descending toggle.
 * It is a "controlled" component: all values live in the Discover page.
 */
export default function FilterBar({ genres, genre, sortBy, order, onChange, onReset, disabled }) {
  return (
    <div className="filter-bar">
      <label className="field">
        <span>Genre</span>
        <select value={genre} onChange={(e) => onChange({ genre: e.target.value })} disabled={disabled}>
          <option value="">All genres</option>
          {genres.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort by</span>
        <select value={sortBy} onChange={(e) => onChange({ sortBy: e.target.value })} disabled={disabled}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <div className="field">
        <span>Order</span>
        <button
          type="button"
          className="btn btn-ghost order-btn"
          onClick={() => onChange({ order: order === 'desc' ? 'asc' : 'desc' })}
          disabled={disabled}
        >
          {order === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
          {order === 'desc' ? 'Descending' : 'Ascending'}
        </button>
      </div>

      <button type="button" className="btn btn-ghost reset-btn" onClick={onReset} disabled={disabled}>
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  )
}
