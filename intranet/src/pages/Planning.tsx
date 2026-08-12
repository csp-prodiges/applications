import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";
import type { Evenement } from "../types";

const typeLabels: Record<Evenement["type"], string> = {
  reunion: "Réunion",
  sortie: "Sortie",
  vacances: "Vacances",
  examen: "Examen",
  autre: "Autre",
};

export default function Planning() {
  const { user } = useAuth();
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [form, setForm] = useState({ titre: "", description: "", date_debut: "", type: "autre" as Evenement["type"] });

  function charger() {
    api.planning().then(setEvenements);
  }

  useEffect(charger, []);

  async function creer() {
    if (!form.titre || !form.date_debut) return;
    await api.creerEvenement({
      titre: form.titre,
      description: form.description || null,
      date_debut: new Date(form.date_debut).toISOString(),
      date_fin: null,
      type: form.type,
      classe_id: null,
    });
    setForm({ titre: "", description: "", date_debut: "", type: "autre" });
    charger();
  }

  const peutCreer = user?.role === "enseignant" || user?.role === "admin";

  return (
    <AppLayout titre="Planning">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {evenements.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-card border border-icc-purple/5">
              <div>
                <div className="font-semibold text-icc-ink">{e.titre}</div>
                {e.description && <div className="text-sm text-icc-slate">{e.description}</div>}
                <div className="text-xs text-icc-slate/70">{new Date(e.date_debut).toLocaleString("fr-FR")}</div>
              </div>
              <span className="rounded-full bg-icc-purple/10 px-3 py-1 text-xs font-semibold text-icc-purple">
                {typeLabels[e.type]}
              </span>
            </div>
          ))}
          {evenements.length === 0 && <p className="text-icc-slate">Aucun événement planifié.</p>}
        </div>

        {peutCreer && (
          <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
            <div className="mb-3 font-serif font-semibold text-icc-ink">Ajouter un événement</div>
            <div className="space-y-3">
              <input
                placeholder="Titre"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
              <input
                type="datetime-local"
                value={form.date_debut}
                onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Evenement["type"] })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                onClick={creer}
                className="w-full rounded-full bg-icc-purple px-4 py-2 text-sm font-semibold text-white hover:bg-icc-purple/90"
              >
                Publier
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
