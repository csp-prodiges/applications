import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";
import type { Ressource } from "../types";

export default function EspaceEnseignants() {
  const { user } = useAuth();
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [form, setForm] = useState({ titre: "", description: "", lien: "", categorie: "Pédagogie" });

  function charger() {
    api.ressources().then(setRessources);
  }

  useEffect(charger, []);

  async function creer() {
    if (!form.titre) return;
    await api.creerRessource({
      titre: form.titre,
      description: form.description || null,
      lien: form.lien || null,
      categorie: form.categorie,
    });
    setForm({ titre: "", description: "", lien: "", categorie: "Pédagogie" });
    charger();
  }

  return (
    <AppLayout titre="Espace enseignants — Ressources et formation continue">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {ressources.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white p-5 shadow-card border border-icc-purple/5">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-icc-ink">{r.titre}</div>
                <span className="rounded-full bg-icc-purple/10 px-3 py-1 text-xs font-semibold text-icc-purple">
                  {r.categorie}
                </span>
              </div>
              {r.description && <p className="mt-1 text-sm text-icc-slate">{r.description}</p>}
              {r.lien && (
                <a href={r.lien} className="mt-2 inline-block text-sm text-icc-blue hover:underline">
                  Accéder à la ressource →
                </a>
              )}
            </div>
          ))}
          {ressources.length === 0 && <p className="text-icc-slate">Aucune ressource disponible.</p>}
        </div>

        {user?.role === "admin" && (
          <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
            <div className="mb-3 font-serif font-semibold text-icc-ink">Ajouter une ressource</div>
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
                placeholder="Lien (optionnel)"
                value={form.lien}
                onChange={(e) => setForm({ ...form, lien: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
              <input
                placeholder="Catégorie"
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
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
