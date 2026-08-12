import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../api";
import type { Actualite } from "../types";

export default function ActualitesAdmin() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [form, setForm] = useState({ titre: "", contenu: "", isPublic: true });

  function charger() {
    api.actualites().then(setActualites);
  }

  useEffect(charger, []);

  async function publier() {
    if (!form.titre || !form.contenu) return;
    await api.creerActualite({ titre: form.titre, contenu: form.contenu, image_url: null, public: form.isPublic });
    setForm({ titre: "", contenu: "", isPublic: true });
    charger();
  }

  return (
    <AppLayout titre="Actualités">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {actualites.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white p-5 shadow-card border border-icc-purple/5">
              <div className="flex items-center justify-between">
                <div className="font-serif font-semibold text-icc-ink">{a.titre}</div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.public ? "bg-icc-green/10 text-icc-green" : "bg-icc-mist text-icc-slate"}`}>
                  {a.public ? "Site public" : "Intranet uniquement"}
                </span>
              </div>
              <p className="mt-1 text-sm text-icc-slate">{a.contenu}</p>
              <div className="mt-2 text-xs text-icc-slate/70">{new Date(a.created_at).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
          <div className="mb-3 font-serif font-semibold text-icc-ink">Publier une actualité</div>
          <div className="space-y-3">
            <input
              placeholder="Titre"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Contenu"
              rows={5}
              value={form.contenu}
              onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-icc-slate">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
              />
              Visible sur le site public
            </label>
            <button
              onClick={publier}
              className="w-full rounded-full bg-icc-purple px-4 py-2 text-sm font-semibold text-white hover:bg-icc-purple/90"
            >
              Publier
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
