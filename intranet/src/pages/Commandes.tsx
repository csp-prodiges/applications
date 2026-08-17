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

const typesSimples: { value: Commande["type"]; label: string }[] = [
  { value: "livre", label: typeLabels.livre },
  { value: "cantine_recharge", label: typeLabels.cantine_recharge },
];

interface ArticleUniforme {
  id: string;
  nom: string;
  prix: number;
}

const CATALOGUE_UNIFORMES: ArticleUniforme[] = [
  { id: "polo_mc", nom: "Polo manches courtes", prix: 15 },
  { id: "polo_ml", nom: "Polo manches longues", prix: 18 },
  { id: "pull", nom: "Pull / Sweat CSP", prix: 22 },
  { id: "pantalon", nom: "Pantalon", prix: 20 },
  { id: "jupe", nom: "Jupe", prix: 18 },
  { id: "veste", nom: "Veste / Blouson", prix: 35 },
  { id: "foulard", nom: "Foulard / Cravate CSP", prix: 10 },
];

const TAILLES = ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans"];

interface LignePanier {
  itemId: string;
  taille: string;
  quantite: number;
}

interface DetailsCommande {
  article?: string;
  items?: { article: string; taille: string; quantite: number; prix_unitaire: number }[];
}

function resumeCommande(details: unknown): string {
  const d = details as DetailsCommande;
  if (d.items && d.items.length > 0) {
    return d.items.map((it) => `${it.quantite}× ${it.article} (${it.taille})`).join(", ");
  }
  return d.article ?? "";
}

function CatalogueUniformes({ onValider }: { onValider: () => void }) {
  const [panier, setPanier] = useState<LignePanier[]>([]);
  const [tailleChoisie, setTailleChoisie] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState(false);

  function ajouter(itemId: string) {
    const taille = tailleChoisie[itemId] ?? TAILLES[2];
    setPanier((prev) => {
      const existant = prev.find((l) => l.itemId === itemId && l.taille === taille);
      if (existant) {
        return prev.map((l) => (l === existant ? { ...l, quantite: l.quantite + 1 } : l));
      }
      return [...prev, { itemId, taille, quantite: 1 }];
    });
  }

  function retirer(itemId: string, taille: string) {
    setPanier((prev) => prev.filter((l) => !(l.itemId === itemId && l.taille === taille)));
  }

  const total = panier.reduce((sum, l) => {
    const item = CATALOGUE_UNIFORMES.find((c) => c.id === l.itemId);
    return sum + (item ? item.prix * l.quantite : 0);
  }, 0);

  async function commander() {
    if (panier.length === 0) return;
    setEnvoi(true);
    try {
      const items = panier.map((l) => {
        const item = CATALOGUE_UNIFORMES.find((c) => c.id === l.itemId)!;
        return { article: item.nom, taille: l.taille, quantite: l.quantite, prix_unitaire: item.prix };
      });
      await api.creerCommande({ type: "uniforme", details: { items }, montant: total });
      setPanier([]);
      onValider();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {CATALOGUE_UNIFORMES.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card border border-icc-purple/5">
            <div>
              <div className="font-medium text-icc-ink">{item.nom}</div>
              <div className="text-sm text-icc-slate">{item.prix.toFixed(2)} €</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={tailleChoisie[item.id] ?? TAILLES[2]}
                onChange={(e) => setTailleChoisie({ ...tailleChoisie, [item.id]: e.target.value })}
                className="rounded-xl border border-icc-purple/15 px-2 py-1.5 text-sm"
              >
                {TAILLES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={() => ajouter(item.id)}
                className="rounded-full bg-icc-purple px-4 py-1.5 text-sm font-semibold text-white hover:bg-icc-purple/90"
              >
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
        <div className="mb-3 font-serif font-semibold text-icc-ink">Mon panier</div>
        {panier.length === 0 && <p className="text-sm text-icc-slate">Aucun article sélectionné.</p>}
        <ul className="space-y-2">
          {panier.map((l) => {
            const item = CATALOGUE_UNIFORMES.find((c) => c.id === l.itemId)!;
            return (
              <li key={`${l.itemId}-${l.taille}`} className="flex items-center justify-between border-b border-icc-purple/5 pb-2 text-sm">
                <div>
                  <div className="text-icc-ink">{l.quantite}× {item.nom}</div>
                  <div className="text-xs text-icc-slate">{l.taille} — {(item.prix * l.quantite).toFixed(2)} €</div>
                </div>
                <button onClick={() => retirer(l.itemId, l.taille)} className="text-xs font-semibold text-red-600 hover:underline">
                  Retirer
                </button>
              </li>
            );
          })}
        </ul>
        {panier.length > 0 && (
          <>
            <div className="mt-4 flex items-center justify-between font-semibold text-icc-ink">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={commander}
              disabled={envoi}
              className="mt-4 w-full rounded-full bg-icc-purple px-4 py-2.5 text-sm font-semibold text-white hover:bg-icc-purple/90 disabled:opacity-60"
            >
              {envoi ? "Envoi en cours…" : "Passer la commande"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CommandesParent() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [form, setForm] = useState({ type: "livre" as Commande["type"], article: "", montant: "" });

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
    setForm({ type: "livre", article: "", montant: "" });
    charger();
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-xl font-semibold text-icc-ink">Uniformes</h2>
        <p className="mt-1 text-sm text-icc-slate">Sélectionnez les articles et tailles, puis passez votre commande.</p>
        <div className="mt-4">
          <CatalogueUniformes onValider={charger} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <h2 className="font-serif text-xl font-semibold text-icc-ink">Mes commandes</h2>
          {commandes.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-card border border-icc-purple/5">
              <div>
                <div className="font-semibold text-icc-ink">{typeLabels[c.type]}</div>
                <div className="text-sm text-icc-slate">{resumeCommande(c.details)}</div>
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
          <div className="mb-3 font-serif font-semibold text-icc-ink">Livre ou recharge cantine</div>
          <div className="space-y-3">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Commande["type"] })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            >
              {typesSimples.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <input
              placeholder="Détail (ex : livre de mathématiques CM1)"
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
            <th className="px-5 py-3">Détail</th>
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
              <td className="px-5 py-3 text-icc-slate">{resumeCommande(c.details)}</td>
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
