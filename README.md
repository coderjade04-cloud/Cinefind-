# CineFind - Movie Discovery Platform

A client-side Single-Page Application (SPA) built with **React + Vite** that lets users explore trending, popular, top-rated and upcoming movies, search by title, filter by genre, sort, view full movie details with trailers, and save favorites.

> **Disclaimer:** CineFind is a student project for *Web Systems and Technologies*. It uses the TMDB API but is **not endorsed or certified by TMDB** and is not an official TMDB product.

---

## 1. Project overview

CineFind pulls **real data** from [The Movie Database (TMDB)](https://www.themoviedb.org/) REST API. There is no backend and no database: the browser calls the API directly and stores favorites in `localStorage`.

## 2. Objectives

- Build a multi-page React SPA with reusable functional components and Hooks.
- Fetch and display real data using `fetch` with `async/await`.
- Handle loading, error and empty states professionally.
- Use client-side routing with React Router.
- Implement search, filtering/sorting, pagination and local persistence.
- Practice team collaboration with Git feature branches and Pull Requests.

## 3. Technologies used

| Tool | Purpose |
| --- | --- |
| React 19 (functional components + Hooks) | UI |
| Vite | Dev server and build tool |
| React Router | Client-side routing |
| Fetch API + async/await | Calling the TMDB API |
| LocalStorage | Persisting favorites |
| Lucide React | Icons |
| HTML5 / CSS3 (custom properties, grid, flexbox) | Markup and styling |
| Git + GitHub | Version control and collaboration |

## 4. API used

- TMDB API documentation: <https://developer.themoviedb.org/docs>
- Endpoints (v3): `/trending/movie/week`, `/movie/popular`, `/movie/top_rated`, `/movie/upcoming`, `/search/movie`, `/discover/movie`, `/movie/{id}` (with `append_to_response=videos,similar`), `/movie/{id}/videos`, `/genre/movie/list`

## 5. Main features

- **Home (`/`)**: hero banner with trailer button, Trending (horizontal scroll), Popular, Top Rated and Upcoming sections.
- **Discover (`/discover`)**:
  - **Search** with debounce (waits 500 ms after typing), search icon, clear button, loading spinner and "no results" message.
  - **Filtering and sorting**: genre filter, sort by popularity / rating / release date, ascending or descending.
  - **Pagination**: Previous/Next, current page, last-page handling, resets to page 1 whenever search, filter or sort changes.
  - Search, filters and page are stored in the URL, so refresh/bookmark keeps the same results.
- **Movie details (`/movie/:id`)**: backdrop, poster, overview, rating, release date, runtime, genres, production companies, trailer, similar movies, add/remove favorite.
- **Favorites (`/favorites`)**: saved movies, remove button, clear all, empty state. Saved in `localStorage` with no duplicates.
- Skeleton loaders, friendly error messages with a **Try again** button, poster placeholder for missing images, responsive layout with hamburger menu.

## 6. Folder structure

```
cinefind/
├── public/
│   ├── favicon.svg
│   └── _redirects            # Netlify SPA fallback
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          Footer.jsx          Hero.jsx
│   │   ├── MovieCard.jsx       MovieGrid.jsx       MovieRow.jsx
│   │   ├── MovieSection.jsx    SearchBar.jsx       FilterBar.jsx
│   │   ├── Pagination.jsx      LoadingSkeleton.jsx ErrorMessage.jsx
│   │   └── TrailerModal.jsx
│   ├── pages/
│   │   ├── Home.jsx   Discover.jsx   MovieDetails.jsx   Favorites.jsx
│   ├── services/
│   │   └── tmdb.js             # ALL API calls live here
│   ├── hooks/
│   │   ├── useFetch.js         # loading / error / data / retry
│   │   ├── useDebounce.js      # delays search requests
│   │   └── useFavorites.jsx    # favorites state + localStorage
│   ├── utils/helpers.js        # formatting, image URLs, sorting
│   ├── styles/global.css
│   ├── App.jsx                 # routes
│   └── main.jsx                # entry point
├── .env.example
├── .gitignore
├── vercel.json                 # Vercel SPA fallback
├── package.json
└── README.md
```

### Architecture in one minute

1. `main.jsx` wraps the app in `BrowserRouter` and `FavoritesProvider`.
2. `App.jsx` defines the routes and shows `Navbar` + `Footer` on every page.
3. Pages call `useFetch(...)`, which calls a function in `services/tmdb.js`.
4. `tmdb.js` builds the URL, adds the API key, and converts failures into friendly `TmdbError` messages.
5. Pages pass data down to reusable components (`MovieCard`, `MovieGrid`, ...).
6. `FavoritesProvider` keeps favorites in React state and mirrors them to `localStorage`, so every heart icon, the navbar badge and the Favorites page stay in sync.

## 7. Installation

Requirements: [Node.js](https://nodejs.org/) 18 or newer and Git.

```bash
git clone <your-repository-url>
cd cinefind
npm install
```

## 8. API key configuration

1. Create a free account at <https://www.themoviedb.org/signup>.
2. Go to **Settings > API** (<https://www.themoviedb.org/settings/api>) and request an API key (choose "Developer", fill in the form; a student project is fine).
3. Copy the **API Key (v3 auth)**. This is the shorter key, not the long "Read Access Token".
4. Copy `.env.example` to `.env` and paste your key:

```bash
cp .env.example .env      # on Windows PowerShell: copy .env.example .env
```

```
VITE_TMDB_API_KEY=your_real_key_here
```

5. Restart the dev server after changing `.env`.

> **Important security note:** Vite embeds every `VITE_` variable into the JavaScript that is sent to the browser, so **the key is NOT secret** in a client-side app. Anyone can see it in the browser's developer tools. `.env` is in `.gitignore` so the key is not pushed to GitHub, but it is still visible in the deployed website. TMDB keys are free and read-only, so this is acceptable for a student project. A real production app would hide the key behind a small backend/proxy.

## 9. Running the project

```bash
npm run dev       # development server at http://localhost:5173
npm run build     # production build in /dist
npm run preview   # preview the production build
```

### Testing on an Android phone

1. Connect the phone and the computer to the **same Wi-Fi**.
2. Run `npm run dev`. Vite prints a **Network** URL such as `http://192.168.1.12:5173/`.
3. Open that URL in Chrome on the phone.
4. If it does not load, allow Node.js through the Windows Firewall (Private networks) and make sure the Wi-Fi does not block device-to-device traffic (some school Wi-Fi does; use a phone hotspot instead).
5. Alternative: Chrome on the computer > F12 > device toolbar to test 360, 390, 768 and 1440 px widths.

## 10. Deployment (optional)

- **Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` makes direct links and refreshes work.
- **Vercel:** framework "Vite". `vercel.json` provides the fallback.
- Add `VITE_TMDB_API_KEY` in the host's environment variable settings.

## 11. GitHub workflow (required by the course)

Never commit directly to `main`. Every feature gets its own branch and Pull Request.

```bash
# one time
git init
git add .gitignore README.md .env.example
git commit -m "docs: add project README and gitignore"      # only for the very first commit
git branch -M main
git remote add origin https://github.com/<username>/cinefind.git
git push -u origin main

# for every feature
git checkout main
git pull
git checkout -b feature/movie-search
# ...write code...
git add .
git commit -m "feat: add movie search functionality"
git push -u origin feature/movie-search
# open GitHub > "Compare & pull request" > partner reviews > Merge
```

Suggested branches (split between the two members):

| Branch | Content |
| --- | --- |
| `feature/project-setup` | Vite setup, folder structure, routing |
| `feature/api-integration` | `services/tmdb.js`, `useFetch` |
| `feature/homepage` | Navbar, Hero, sections, footer |
| `feature/movie-search` | SearchBar, debounce |
| `feature/filter-sort-pagination` | FilterBar, Pagination, Discover page |
| `feature/favorites` | `useFavorites`, Favorites page |
| `feature/movie-details` | Details page, trailer modal |
| `feature/responsive-design` | Mobile menu and responsive CSS |

Commit prefixes: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`.
Check that `.env` never appears in `git status` before committing.

## 12. Team member contributions

| Member | Contributions |
| --- | --- |
| _Member 1 name_ | _e.g. project setup, API service, homepage, details page_ |
| _Member 2 name_ | _e.g. search, filters, pagination, favorites, README_ |

## 13. Repository

GitHub: `https://github.com/<username>/cinefind` _(replace with your link)_

## 14. API attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
Movie data and images are provided by [TMDB](https://www.themoviedb.org/).
