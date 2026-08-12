import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  IconArrowLeft,
  IconBook,
  IconCalendar,
  IconCart,
  IconGraduationCap,
  IconHome,
  IconLogOut,
  IconMail,
  IconMegaphone,
  IconUsers,
  IconUtensils,
} from "./Icons";
import type { ComponentType, SVGProps } from "react";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "http://localhost:5175";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const linksByRole: Record<string, { to: string; label: string; icon: Icon }[]> = {
  parent: [
    { to: "/", label: "Tableau de bord", icon: IconHome },
    { to: "/notes-travaux", label: "Notes & travaux", icon: IconBook },
    { to: "/planning", label: "Planning", icon: IconCalendar },
    { to: "/cantine", label: "Cantine", icon: IconUtensils },
    { to: "/commandes", label: "Commandes", icon: IconCart },
    { to: "/messagerie", label: "Messagerie", icon: IconMail },
  ],
  enseignant: [
    { to: "/", label: "Tableau de bord", icon: IconHome },
    { to: "/notes-travaux", label: "Notes & travaux", icon: IconBook },
    { to: "/planning", label: "Planning", icon: IconCalendar },
    { to: "/espace-enseignants", label: "Espace enseignants", icon: IconGraduationCap },
    { to: "/messagerie", label: "Messagerie", icon: IconMail },
  ],
  admin: [
    { to: "/", label: "Tableau de bord", icon: IconHome },
    { to: "/actualites", label: "Actualités", icon: IconMegaphone },
    { to: "/admissions", label: "Admissions", icon: IconBook },
    { to: "/commandes", label: "Commandes", icon: IconCart },
    { to: "/utilisateurs", label: "Utilisateurs", icon: IconUsers },
    { to: "/espace-enseignants", label: "Espace enseignants", icon: IconGraduationCap },
    { to: "/messagerie", label: "Messagerie", icon: IconMail },
  ],
};

const roleLabel: Record<string, string> = {
  parent: "Espace famille",
  enseignant: "Espace enseignant",
  admin: "Administration",
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const links = linksByRole[user.role] ?? [];

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-icc-purple/5 bg-white">
      <div className="flex items-center gap-3 px-6 py-6">
        <img src="/csp-logo.svg" alt="CSP" className="h-12 w-12" />
        <div className="leading-tight">
          <div className="font-serif text-base font-semibold text-icc-purple">Cité Scolaire Prodiges</div>
          <div className="text-xs font-medium text-icc-slate">{roleLabel[user.role]}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-icc-purple text-white shadow-card"
                  : "text-icc-ink/70 hover:bg-icc-mist hover:text-icc-purple"
              }`
            }
          >
            <link.icon width={18} height={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-icc-purple/5 px-4 py-4">
        <a
          href={SITE_URL}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-icc-slate hover:bg-icc-mist"
        >
          <IconArrowLeft width={18} height={18} />
          Retour au site
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <IconLogOut width={18} height={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
