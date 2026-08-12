import { useState } from "react";
import { NavLink } from "react-router-dom";

const INTRANET_URL = import.meta.env.VITE_INTRANET_URL ?? "http://localhost:5176";

const links = [
  { to: "/ecole", label: "L'École" },
  { to: "/vision", label: "Vision" },
  { to: "/programme", label: "Programme" },
  { to: "/admissions", label: "Admissions" },
  { to: "/actualites", label: "Actualités" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-icc-purple/5 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/csp-logo.svg" alt="Cité Scolaire Prodiges" className="h-12 w-12" />
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold text-icc-purple">Cité Scolaire Prodiges</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-icc-slate">Un projet ICC</div>
          </div>
        </NavLink>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium transition-colors hover:text-icc-purple ${
                  isActive ? "text-icc-purple" : "text-icc-ink/70"
                } after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-icc-gold after:transition-all ${
                  isActive ? "after:w-full" : "after:w-0"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <NavLink
            to="/admissions"
            className="rounded-full bg-icc-purple px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-icc-purpledark"
          >
            Inscription
          </NavLink>
          <a
            href={INTRANET_URL}
            className="rounded-full border border-icc-purple/30 px-5 py-2.5 text-sm font-semibold text-icc-purple transition hover:border-icc-purple hover:bg-icc-purple hover:text-white"
          >
            Accès intranet
          </a>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-icc-purple/20 text-icc-purple sm:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-icc-purple/10 bg-white px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-icc-lilac text-icc-purple" : "text-icc-ink/80"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <NavLink
              to="/admissions"
              onClick={() => setOpen(false)}
              className="rounded-full bg-icc-purple px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Inscription
            </NavLink>
            <a
              href={INTRANET_URL}
              className="rounded-full border border-icc-purple/30 px-5 py-2.5 text-center text-sm font-semibold text-icc-purple"
            >
              Accès intranet
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
