import { useState, useEffect, type ReactNode } from "react";
import { useLocation, Navigate, useNavigate } from "@tanstack/react-router";
import MediBot from "../common/MediBot";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function AppLayout({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  const { checked, onboarded } = useOnboarding();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!checked || !mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!onboarded && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <main 
        id="main-content" 
        className="w-full min-h-screen bg-background main-content-area"
        style={{ paddingTop: '64px', paddingBottom: '100px' }}
      >
        {children}
      </main>
    </div>
  );
}
