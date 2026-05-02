import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('medisave-theme') as 'light' | 'dark' | null;
    const current = saved || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    if (current === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setTheme(current);
  }, []);

  const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    const x = e.clientX;
    const y = e.clientY;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth  - x),
      Math.max(y, window.innerHeight - y)
    );

    // Fallback for browsers without View Transitions (Safari, Firefox)
    if (typeof (document as any).startViewTransition !== 'function') {
      document.documentElement.setAttribute('data-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try { localStorage.setItem('medisave-theme', next); } catch {}
      setTheme(next);
      return;
    }

    document.documentElement.style.setProperty('--theme-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-y', `${y}px`);
    document.documentElement.style.setProperty('--theme-r', `${maxRadius}px`);

    const transition = (document as any).startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try { localStorage.setItem('medisave-theme', next); } catch {}
      setTheme(next);
    });

    await transition.ready;
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="header"
    >
      <div className="header-inner container" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left: Logo */}
        <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ 
            width: '32px', height: '32px',
            background: 'var(--color-primary)', borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 900, fontSize: '18px', lineHeight: 1
          }}>
            M
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'var(--color-text)' }}>
            MediSave
          </span>
        </Link>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Theme toggle — animated icon swap */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0,   scale: 1,   opacity: 1 }}
                  exit={{    rotate:  90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ display: 'flex' }}
                >
                  <Sun className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate:  90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0,   scale: 1,   opacity: 1 }}
                  exit={{    rotate: -90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ display: 'flex' }}
                >
                  <Moon className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <Link to="/login" style={{ 
            padding: '8px 20px', 
            background: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            Sign in
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
