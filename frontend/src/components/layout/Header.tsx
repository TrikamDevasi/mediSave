import { Link } from "@tanstack/react-router";
import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import medisaveLogo from "@/assets/medisave-logo.png";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("medisave-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", useDark);
    setIsDark(useDark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("medisave-theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo — large, no box wrapper */}
        <Link to="/" className="flex shrink-0 items-center" aria-label="MediSave home">
          <img
            src={medisaveLogo}
            alt="MediSave"
            className="h-10 w-auto object-contain sm:h-11 md:h-12"
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleDark}
            className="tap-active inline-flex h-9 w-9 items-center justify-center rounded-lg text-mutedfg transition-colors hover:bg-muted hover:text-foreground"
          >
            {isDark ? <Sun className="h-5 w-5" strokeWidth={2} /> : <Moon className="h-5 w-5" strokeWidth={2} />}
          </button>

          <button
            aria-label="Notifications"
            className="tap-active relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-mutedfg transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            {/* Notification dot */}
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
          </button>

          {/* Avatar — solid filled, no colored ring */}
          <div
            aria-label="Profile"
            className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground"
          >
            T
          </div>
        </div>
      </div>
    </header>
  );
}
