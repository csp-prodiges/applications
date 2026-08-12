import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../api";
import type { Role, Utilisateur } from "../types";

const roleLabels: Record<Role, string> = {
  parent: "Parent",
  enseignant: "Enseignant",
  admin: "Admin",
};

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "parent" as Role,
    nom: "",
    prenom: "",
    telephone: "",
    famille_nom: "",
  });
  const [erreur, setErreur] = useState("");

  function charger() {
    api.utilisateurs().then(setUtilisateurs);
  }

  useEffect(charger, []);

  async function creer() {
    setErreur("");
    if (!form.email || !form.password || !form.nom || !form.prenom) return;
    try {
      await api.creerUtilisateur({
        email: form.email,
        password: form.password,
        role: form.role,
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone || undefined,
        famille_nom: form.role === "parent" ? form.famille_nom : undefined,
      });
      setForm({ email: "", password: "", role: "parent", nom: "", prenom: "", telephone: "", famille_nom: "" });
      charger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur lors de la création");
    }
  }

  return (
    <AppLayout titre="Utilisateurs">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl bg-white shadow-card border border-icc-purple/5 lg:col-span-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-icc-mist text-xs uppercase text-icc-slate">
              <tr>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u) => (
                <tr key={u.id} className="border-t border-icc-purple/5">
                  <td className="px-5 py-3">{u.prenom} {u.nom}</td>
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-5 py-3">{roleLabels[u.role]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
          <div className="mb-3 font-serif font-semibold text-icc-ink">Créer un compte</div>
          <div className="space-y-3">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            >
              <option value="parent">Parent</option>
              <option value="enseignant">Enseignant</option>
              <option value="admin">Admin</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Prénom"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
              <input
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
            </div>
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Mot de passe temporaire"
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Téléphone (optionnel)"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            {form.role === "parent" && (
              <input
                placeholder="Nom de famille"
                value={form.famille_nom}
                onChange={(e) => setForm({ ...form, famille_nom: e.target.value })}
                className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              />
            )}
            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button
              onClick={creer}
              className="w-full rounded-full bg-icc-purple px-4 py-2 text-sm font-semibold text-white hover:bg-icc-purple/90"
            >
              Créer le compte
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
