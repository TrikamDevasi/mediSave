import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-divider bg-surface py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Left: Branding */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-primary">MediSave</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              India's most trusted medicine price comparison platform. Find generic alternatives and save up to 70%.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Company</span>
              <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Legal</span>
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Privacy
              </Link>
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-divider pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} MediSave India. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground/50 italic">
            Prices updated daily &middot; Not medical advice &middot; Consult a doctor
          </p>
        </div>
      </div>
    </footer>
  );
}
