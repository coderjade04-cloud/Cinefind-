import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Clapperboard, Heart, Menu, Search, X } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { favorites } = useFavorites()
  const location = useLocation()

  // Close the mobile menu after every navigation.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Make the bar more opaque after the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

  return (
    <header className={`navbar${scrolled || menuOpen ? ' navbar-solid' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo" aria-label="CineFind home">
          <Clapperboard size={26} />
          <span>Cine<b>Find</b></span>
        </Link>

        <nav className={`nav-links${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/discover" end className={linkClass}>Discover</NavLink>
          <NavLink to="/favorites" className={linkClass}>
            Favorites
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </NavLink>
          {/* Opens Discover and focuses the search box */}
          <Link to="/discover" state={{ focusSearch: true }} className="nav-link nav-search">
            <Search size={18} /> Search
          </Link>
        </nav>

        <div className="nav-actions">
          <Link
            to="/discover"
            state={{ focusSearch: true }}
            className="icon-btn"
            aria-label="Search movies"
          >
            <Search size={20} />
          </Link>
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link to="/favorites" className="icon-btn heart-link" aria-label="Favorites">
            <Heart size={20} />
            {favorites.length > 0 && <span className="badge badge-float">{favorites.length}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
