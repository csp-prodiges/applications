import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";
import type { Commande } from "../types";

const statutLabels: Record<Commande["statut"], string> = {
  en_attente: "En attente",
  validee: "Validée",
  livree: "Livrée",
};

const typeLabels: Record<Commande["type"], string> = {
  uniforme: "Uniforme",
  livre: "Livre",
  cantine_recharge: "Recharge cantine",
};

function CommandesParent() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [form, setForm] = useState({ type: "uniforme" as Commande["type"], article: "", montant: "" });

  function charger() {
    if (!user?.famille_id) return;
    api.commandesFamille(user.famille_id).then(setCommandes);
  }

  useEffect(charger, [user]);

  async function creer() {
    if (!form.article || !form.montant) return;
    await api.creerCommande({
      type: form.type,
      details: { article: form.article },
      montant: Number(form.montant),
    });
    setForm({ type: "uniforme", article: "", montant: "" });
    charger();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {commandes.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-card border border-icc-purple/5">
            <div>
              <div className="font-semibold text-icc-ink">{typeLabels[c.type]}</div>
              <div className="text-sm text-icc-slate">
                {String((c.details as { article?: string }).article ?? "")}
              </div>
              <div className="text-xs text-icc-slate/70">{new Date(c.created_at).toLocaleDateString("fr-FR")}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-icc-ink">{c.montant.toFixed(2)} €</div>
              <span className="rounded-full bg-icc-purple/10 px-3 py-1 text-xs font-semibold text-icc-purple">
                {statutLabels[c.statut]}
              </span>
            </div>
          </div>
        ))}
        {commandes.length === 0 && <p className="text-icc-slate">Aucune commande pour le moment.</p>}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
        <div className="mb-3 font-serif font-semibold text-icc-ink">Nouvelle commande</div>
        <div className="space-y-3">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as Commande["type"] })}
            className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
          >
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            placeholder="Détail (ex : uniforme taille 8 ans)"
            value={form.article}
            onChange={(e) => setForm({ ...form, article: e.target.value })}
            className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Montant (€)"
            value={form.montant}
            onChange={(e) => setForm({ ...form, montant: e.target.value })}
            className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
          />
          <button
            onClick={creer}
            className="w-full rounded-full bg-icc-purple px-4 py-2 text-sm font-semibold text-white hover:bg-icc-purple/90"
          >
            Commander
          </button>
        </div>
      </div>
    </div>
  );
}

function CommandesAdmin() {
  const [commandes, setCommandes] = useState<Commande[]>([]);

  function charger() {
    api.toutesLesCommandes().then(setCommandes);
  }

  useEffect(charger, []);

  async function majStatut(id: number, statut: Commande["statut"]) {
    await api.majStatutCommande(id, statut);
    charger();
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card border border-icc-purple/5">
      <table className="w-full text-left text-sm">
        <thead className="bg-icc-mist text-xs uppercase text-icc-slate">
          <tr>
            <th className="px-5 py-3">Famille</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3">Montant</th>
            <th className="px-5 py-3">Statut</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {commandes.map((c) => (
            <tr key={c.id} className="border-t border-icc-purple/5">
              <td className="px-5 py-3">#{c.famille_id}</td>
              <td className="px-5 py-3">{typeLabels[c.type]}</td>
              <td className="px-5 py-3 font-semibold">{c.montant.toFixed(2)} €</td>
              <td className="px-5 py-3">{statutLabels[c.statut]}</td>
              <td className="px-5 py-3">
                <select
                  value={c.statut}
                  onChange={(e) => majStatut(c.id, e.target.value as Commande["statut"])}
                  className="rounded-xl border border-icc-purple/15 px-2 py-1 text-xs"
                >
                  {Object.entries(statutLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {commandes.length === 0 && <p className="p-5 text-icc-slate">Aucune commande.</p>}
    </div>
  );
}

export default function Commandes() {
  const { user } = useAuth();
  return (
    <AppLayout titre="Commandes">
      {user?.role === "parent" && <CommandesParent />}
      {user?.role === "admin" && <CommandesAdmin />}
    </AppLayout>
  );
}
