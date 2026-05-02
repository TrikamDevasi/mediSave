import * as React from "react";
import { createContext, useContext, useCallback, useState, useEffect } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { AmbientSound } from "@/components/common/AmbientSound";

import appCss from "../styles.css?url";

// ─── SIGNATURE MOMENT 3 — MORPHING ROUTE TRANSITION ────────────────
interface TransitionCtx {
  startTransition: (x: number, y: number, path: string) => void
}

const TransitionContext = createContext<TransitionCtx>({
  startTransition: () => {}
})

export function usePageTransition() {
  return useContext(TransitionContext)
}

function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" })
  const navigate = useNavigate()

  const startTransition = useCallback((x: number, y: number, path: string) => {
    setOrigin({ x: `${x}px`, y: `${y}px` })
    setIsTransitioning(true)
    
    setTimeout(() => {
      navigate({ to: path as any })
    }, 300)

    setTimeout(() => setIsTransitioning(false), 800)
  }, [navigate])

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-primary z-[var(--z-modal)] pointer-events-none shadow-[0_0_100px_rgba(13,158,166,0.5)]"
            style={{ transformOrigin: `${origin.x} ${origin.y}` }}
            initial={{ scale: 0, borderRadius: "100%" }}
            animate={{ scale: 4, borderRadius: "0%" }}
            exit={{ opacity: 0, scale: 5 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    // Skip protection for login and onboarding
    if (location.pathname === '/onboarding' || location.pathname === '/login') {
      return;
    }

    // Global onboarding check
    const onboarded = typeof window !== 'undefined' && localStorage.getItem('medisave_onboarded') === 'true';
    if (!onboarded) {
      throw redirect({
        to: '/onboarding',
      });
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

import MediBot from "@/components/common/MediBot";
import { useSearch } from "@tanstack/react-router";

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useSearch({ strict: false }) as any;
  const isHideNavbar = pathname === '/onboarding';
  const isBotOpen = search?.bot === 'true' || search?.bot === true;

  return (
    <PageTransitionProvider>
      <div className="min-h-screen bg-background">
        <HeadContent />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-skip-nav)] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none"
        >
          Skip to content
        </a>
        
        {!isHideNavbar && <Header />}
        
        <main id="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {!isHideNavbar && <BottomNav />}
        
        {/* Global Overlays */}
        <AnimatePresence>
          {isBotOpen && <MediBot />}
        </AnimatePresence>
        
        <AmbientSound />
        <Toaster position="top-center" />
        <div id="portal-root" />
        <Scripts />
      </div>
    </PageTransitionProvider>
  );
}
      
      {/* Global Overlays */}
      <AnimatePresence>
        {isBotOpen && <MediBot />}
      </AnimatePresence>
      
      <AmbientSound />
      <Toaster position="top-center" />
    </React.Fragment>
  );
}
