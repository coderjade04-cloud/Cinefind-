import { Link } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="logo">
            <Clapperboard size={22} />
            <span>Cine<b>Find</b></span>
          </Link>
          <p className="muted footer-text">
            Discover, search and save your favorite movies.
          </p>
        </div>
        <div className="footer-attribution">
          <p className="muted">
            This product uses the{' '}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a> API
            but is not endorsed or certified by TMDB. CineFind is a student project.
          </p>
          <p className="muted">&copy; {new Date().getFullYear()} CineFind. Web Systems and Technologies final project.</p>
        </div>
      </div>
    </footer>
  )
}
