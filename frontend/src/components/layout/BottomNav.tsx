import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Camera, MapPin, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/",         label: "Home",    icon: Home },
  { to: "/search",   label: "Search",  icon: Search },
  { to: "/scan",     label: "Scan",    icon: Camera },
  { to: "/nearby",   label: "Nearby",  icon: MapPin },
  { to: "/dashboard",label: "Savings", icon: TrendingDown },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <ul className="mx-auto flex max-w-5xl items-stretch justify-between pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={`tap-active relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[52px] transition-colors ${
                  active ? "text-primary" : "text-mutedfg hover:text-foreground"
                }`}
              >
                {/* Active pill indicator — top */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b-full bg-primary" />
                )}
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.8} />
                <span className={`hidden min-[360px]:block text-[10px] tracking-tight font-medium`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
