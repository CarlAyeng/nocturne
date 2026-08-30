import { Component, lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UIProvider } from './context/UIContext'
import { PlayerProvider } from './context/PlayerContext'
import { LibraryProvider } from './context/LibraryContext'
import { AppShell } from './components/layout/AppShell'
import { Toaster } from './components/common/Toaster'
import { PageSkeleton } from './components/common/Skeleton'
import { Button } from './components/common/Button'

/* lazy-loaded pages (code-split) */
const Home = lazy(() => import('./pages/Home'))
const Discover = lazy(() => import('./pages/Discover'))
const Browse = lazy(() => import('./pages/Browse'))
const Search = lazy(() => import('./pages/Search'))
const Library = lazy(() => import('./pages/Library'))
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail'))
const AlbumDetail = lazy(() => import('./pages/AlbumDetail'))
const ArtistPage = lazy(() => import('./pages/Artist'))

/* Top-level error boundary: keeps the rest of the app alive if a route throws.
   Without this, a single bad render blanks the entire tree (and only a reload
   can bring it back) — which is the "dark blue background" the user saw. */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('[Nocturne] Route render failed:', error)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="font-display text-xl font-bold text-ink">Something went wrong on this page</p>
          <p className="max-w-md text-sm text-muted">{this.state.error.message}</p>
          <Button onClick={() => this.setState({ error: null })}>Try again</Button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <LibraryProvider>
          <PlayerProvider>
            <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route element={<AppShell />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/playlist/:id" element={<PlaylistDetail />} />
                    <Route path="/album/:id" element={<AlbumDetail />} />
                    <Route path="/artist/:id" element={<ArtistPage />} />
                    {/* legacy home-like links */}
                    <Route path="/liked" element={<Navigate to="/playlist/liked" replace />} />
                    <Route path="/recent" element={<Navigate to="/playlist/recent" replace />} />
                  </Route>
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <Toaster />
          </PlayerProvider>
        </LibraryProvider>
      </UIProvider>
    </BrowserRouter>
  )
}