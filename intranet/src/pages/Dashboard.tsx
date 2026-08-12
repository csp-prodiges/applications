import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";
import type { DashboardAdmin, DashboardEnseignant, DashboardFamille } from "../types";
import { IconBook, IconCalendar, IconGraduationCap, IconMail, IconMegaphone } from "../components/Icons";

function Carte({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-icc-purple/5 bg-white p-6 shadow-card ${className}`}>{children}</div>;
}

function Stat({ value, label, tone }: { value: string | number; label: string; tone: "purple" | "gold" | "green" | "blue" }) {
  const tones = {
    purple: "bg-icc-lilac text-icc-purple",
    gold: "bg-icc-gold/10 text-icc-gold",
    green: "bg-icc-green/10 text-icc-green",
    blue: "bg-icc-blue/10 text-icc-blue",
  };
  return (
    <div className={`rounded-xl p-4 text-center ${tones[tone]}`}>
      <div className="font-serif text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}

function ActuList({ actualites }: { actualites: DashboardFamille["actualites"] }) {
  return (
    <ul className="space-y-3">
      {actualites.map((a) => (
        <li key={a.id} className="flex gap-3 border-b border-icc-purple/5 pb-3 last:border-0">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-icc-gold" />
          <div>
            <div className="text-sm font-medium text-icc-ink">{a.titre}</div>
            <div className="text-xs text-icc-slate">{a.contenu}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function DashboardParent({ data }: { data: DashboardFamille }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {data.enfants.map((enfant) => (
          <Carte key={enfant.enfant_id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif font-semibold text-icc-ink">{enfant.prenom} {enfant.nom}</div>
                <div className="text-xs text-icc-slate">{enfant.classe ?? "Classe non assignée"}</div>
              </div>
              <Link to="/notes-travaux" className="text-xs font-semibold text-icc-purple hover:underline">
                Voir les notes →
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat tone="purple" value={enfant.moyenne_generale ? `${enfant.moyenne_generale}/20` : "—"} label="Moyenne générale" />
              <Stat tone="gold" value={enfant.travaux_a_rendre} label="Travaux à rendre" />
              <Stat tone="green" value={`${enfant.solde_cantine.toFixed(0)} €`} label="Solde cantine" />
            </div>
          </Carte>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Carte className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2 font-serif font-semibold text-icc-ink">
            <IconMegaphone width={18} height={18} className="text-icc-purple" /> Actualités de l'école
          </div>
          <ActuList actualites={data.actualites} />
        </Carte>
        <div className="space-y-6">
          <Carte>
            <div className="mb-2 flex items-center gap-2 font-serif font-semibold text-icc-ink">
              <IconCalendar width={18} height={18} className="text-icc-purple" /> Prochain événement
            </div>
            {data.prochain_evenement ? (
              <>
                <div className="text-sm font-medium text-icc-purple">{data.prochain_evenement.titre}</div>
                <div className="text-xs text-icc-slate">
                  {new Date(data.prochain_evenement.date_debut).toLocaleString("fr-FR")}
                </div>
              </>
            ) : (
              <div className="text-sm text-icc-slate">Aucun événement à venir</div>
            )}
            <Link to="/planning" className="mt-3 inline-block text-xs font-semibold text-icc-purple hover:underline">
              Voir le planning →
            </Link>
          </Carte>
          <Carte>
            <div className="mb-1 flex items-center gap-2 font-serif font-semibold text-icc-ink">
              <IconMail width={18} height={18} className="text-icc-purple" /> Messagerie
            </div>
            <div className="text-sm text-icc-slate">{data.messages_non_lus} message(s) non lu(s)</div>
            <Link to="/messagerie" className="mt-3 inline-block text-xs font-semibold text-icc-purple hover:underline">
              Ouvrir la messagerie →
            </Link>
          </Carte>
        </div>
      </div>
    </div>
  );
}

function DashboardEnseignantVue({ data }: { data: DashboardEnseignant }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Carte>
          <IconGraduationCap width={20} height={20} className="text-icc-purple" />
          <div className="mt-2 font-serif text-lg font-bold text-icc-ink">{data.classes.join(", ") || "—"}</div>
          <div className="text-xs text-icc-slate">Mes classes</div>
        </Carte>
        <Carte>
          <IconBook width={20} height={20} className="text-icc-gold" />
          <div className="mt-2 font-serif text-lg font-bold text-icc-ink">{data.devoirs_a_venir}</div>
          <div className="text-xs text-icc-slate">Devoirs à venir</div>
        </Carte>
        <Carte>
          <IconCalendar width={20} height={20} className="text-icc-purple" />
          {data.prochain_evenement ? (
            <>
              <div className="mt-2 text-sm font-medium text-icc-purple">{data.prochain_evenement.titre}</div>
              <div className="text-xs text-icc-slate">
                {new Date(data.prochain_evenement.date_debut).toLocaleString("fr-FR")}
              </div>
            </>
          ) : (
            <div className="mt-2 text-sm text-icc-slate">Aucun événement à venir</div>
          )}
        </Carte>
      </div>
      <Carte>
        <div className="mb-3 flex items-center gap-2 font-serif font-semibold text-icc-ink">
          <IconMegaphone width={18} height={18} className="text-icc-purple" /> Actualités de l'école
        </div>
        <ActuList actualites={data.actualites} />
      </Carte>
    </div>
  );
}

function DashboardAdminVue({ data }: { data: DashboardAdmin }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Carte>
          <div className="font-serif text-2xl font-bold text-icc-purple">{data.admissions_nouvelles}</div>
          <div className="text-xs text-icc-slate">Nouvelles admissions</div>
        </Carte>
        <Carte>
          <div className="font-serif text-2xl font-bold text-icc-gold">{data.commandes_en_attente}</div>
          <div className="text-xs text-icc-slate">Commandes en attente</div>
        </Carte>
        <Carte>
          <div className="font-serif text-2xl font-bold text-icc-green">{data.total_familles}</div>
          <div className="text-xs text-icc-slate">Familles</div>
        </Carte>
        <Carte>
          <div className="font-serif text-2xl font-bold text-icc-blue">{data.total_enfants}</div>
          <div className="text-xs text-icc-slate">Enfants inscrits</div>
        </Carte>
      </div>
      <Carte>
        <div className="mb-3 flex items-center gap-2 font-serif font-semibold text-icc-ink">
          <IconMegaphone width={18} height={18} className="text-icc-purple" /> Actualités récentes
        </div>
        <ActuList actualites={data.actualites} />
      </Carte>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardFamille | DashboardEnseignant | DashboardAdmin | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    api.dashboard().then(setData).finally(() => setChargement(false));
  }, []);

  return (
    <AppLayout titre="Actualités & vie de l'école">
      {chargement && <p className="text-icc-slate">Chargement…</p>}
      {!chargement && data && user?.role === "parent" && <DashboardParent data={data as DashboardFamille} />}
      {!chargement && data && user?.role === "enseignant" && (
        <DashboardEnseignantVue data={data as DashboardEnseignant} />
      )}
      {!chargement && data && user?.role === "admin" && <DashboardAdminVue data={data as DashboardAdmin} />}
    </AppLayout>
  );
}
