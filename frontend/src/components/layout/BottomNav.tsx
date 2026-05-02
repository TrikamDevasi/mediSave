import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Bot, MapPin, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: <Search size={17} strokeWidth={2} />, label: "Search",  to: "/search"   },
  { icon: <MapPin size={17} strokeWidth={2} />, label: "Nearby",  to: "/nearby"   },
  { icon: <Bot size={17} strokeWidth={2} />,    label: "MediBot", to: "/", isCenter: true, search: { bot: true } },
  { icon: <Home size={17} strokeWidth={2} />,   label: "Home",    to: "/"         },
  { icon: <Bookmark size={17} strokeWidth={2}/>,label: "Profile", to: "/dashboard"},
];

export default function BottomNav() {
  const { pathname, search } = useLocation();
  const isBotOpen = (search as any)?.bot === true;

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="floating-nav"
      >
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon, isCenter, search: tabSearch }) => {
            const active = isCenter ? isBotOpen : (to === "/" ? (pathname === "/" && !isBotOpen) : pathname.startsWith(to));
            
            return (
              <Link
                key={label}
                to={to as any}
                search={tabSearch}
                className="relative text-decoration-none"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    nav-item transition-all duration-300
                    ${isCenter ? "nav-item-center" : ""}
                    ${active && !isCenter ? "active" : ""}
                  `}
                >
                  {icon}
                  {!isCenter && (
                    <span className="nav-label">
                      {label}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
