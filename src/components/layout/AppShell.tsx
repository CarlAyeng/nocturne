import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { IconRail } from './IconRail'
import { MusicPlayer } from '../player/MusicPlayer'
import { Toaster } from '../common/Toaster'
import { PageSkeleton } from '../common/Skeleton'

/**
 * Single-frame glass layout.
 * - Full-bleed background photo (public/bg.jpg) with a dim overlay (set in index.css).
 * - One floating glass "card" contains the page content + the player pill.
 * - A vertical IconRail floats on the left.
 * - No separate TopBar / Sidebar / BottomNav / Footer — all surfaces are
 *   consolidated inside the card so the whole app reads as a single object
 *   over the photo (matches the reference).
 */
export function AppShell() {
  return (
    <>
      <IconRail />

      <div className="page-card mx-auto flex h-[100dvh] max-w-[1480px] flex-col overflow-hidden">
        <main className="scroll-area relative flex-1 overflow-y-auto pb-28">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <MusicPlayer />
      <Toaster />
    </>
  )
}
