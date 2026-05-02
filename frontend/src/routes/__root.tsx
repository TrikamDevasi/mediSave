import * as React from "react";
import { createContext, useContext, useCallback, useState, useEffect } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState, useNavigate } from "@tanstack/react-router";
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // viewport-fit=cover → iPhone notch/Dynamic Island; maximum-scale=5 preserves accessibility zoom
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" },
      // Dual theme-color: tints Android Chrome chrome bar per color scheme
      { name: "theme-color", content: "#016a70", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#171614", media: "(prefers-color-scheme: dark)" },
      // PWA / add-to-home-screen
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "MediSave" },
      { title: "MediSave — Compare medicine prices & save up to 70%" },
      {
        name: "description",
        content:
          "Compare medicine prices across Apollo, MedPlus, Netmeds & Jan Aushadhi. Find generic alternatives and save up to 70% on your prescriptions.",
      },
      { property: "og:title", content: "MediSave — Compare medicine prices" },
      { property: "og:description", content: "Save up to 70% on medicines. Find generics & Jan Aushadhi stores near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" as any },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,900&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('medisave-theme');
              if (!theme) {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {
              var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            }
          })();
        `}} />
      </head>
      <body suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-skip-nav)] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none"
        >
          Skip to content
        </a>
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
        <div id="portal-root" />
        <Scripts />
      </body>
    </html>
  );
}

import MediBot from "@/components/common/MediBot";
import { useSearch } from "@tanstack/react-router";

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useSearch({ strict: false }) as any;
  const isHideNavbar = pathname === '/onboarding';
  const isBotOpen = search?.bot === 'true' || search?.bot === true;

  return (
    <React.Fragment>
      {!isHideNavbar && <Header />}
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
      {!isHideNavbar && <BottomNav />}
      
      {/* Global Overlays */}
      <AnimatePresence>
        {isBotOpen && <MediBot />}
      </AnimatePresence>
      
      <AmbientSound />
      <Toaster position="top-center" />
    </React.Fragment>
  );
}
