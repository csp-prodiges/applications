import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";
import type { CantineSolde, Enfant } from "../types";

export default function Cantine() {
  const { user } = useAuth();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [soldes, setSoldes] = useState<Record<number, CantineSolde>>({});

  useEffect(() => {
    if (!user?.famille_id) return;
    api.enfantsFamille(user.famille_id).then(async (list) => {
      setEnfants(list);
      for (const enfant of list) {
        api.soldeCantine(enfant.id).then((s) => setSoldes((prev) => ({ ...prev, [enfant.id]: s })));
      }
    });
  }, [user]);

  return (
    <AppLayout titre="Cantine">
      <div className="grid gap-6 md:grid-cols-2">
        {enfants.map((enfant) => {
          const solde = soldes[enfant.id];
          return (
            <div key={enfant.id} className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
              <div className="flex items-center justify-between">
                <div className="font-serif font-semibold text-icc-ink">{enfant.prenom} {enfant.nom}</div>
                <div className={`text-xl font-bold ${solde && solde.solde < 15 ? "text-red-600" : "text-icc-green"}`}>
                  {solde ? solde.solde.toFixed(2) : "…"} €
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {(solde?.transactions ?? []).map((t) => (
                  <li key={t.id} className="flex items-center justify-between border-b border-icc-purple/5 pb-2 text-sm">
                    <div>
                      <div className="text-icc-ink/80">{t.description ?? (t.type === "credit" ? "Rechargement" : "Débit")}</div>
                      <div className="text-xs text-icc-slate/70">{new Date(t.date).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div className={t.type === "credit" ? "font-semibold text-icc-green" : "font-semibold text-red-500"}>
                      {t.type === "credit" ? "+" : "-"}{t.montant.toFixed(2)} €
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {enfants.length === 0 && <p className="text-icc-slate">Aucun enfant associé à ce compte.</p>}
      </div>
    </AppLayout>
  );
}
