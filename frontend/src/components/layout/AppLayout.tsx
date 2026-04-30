import type { ReactNode } from "react";
import { useLocation, Navigate } from "@tanstack/react-router";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function AppLayout({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  const { checked, onboarded } = useOnboarding();
  const { pathname } = useLocation();

  if (!checked) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!onboarded && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="w-full pb-[calc(52px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
