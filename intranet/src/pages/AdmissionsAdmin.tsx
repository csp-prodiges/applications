import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../api";
import type { Admission } from "../types";

const statutLabels: Record<Admission["statut"], string> = {
  nouvelle: "Nouvelle",
  contactee: "Contactée",
  inscrite: "Inscrite",
  refusee: "Refusée",
};

export default function AdmissionsAdmin() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);

  function charger() {
    api.admissions().then(setAdmissions);
  }

  useEffect(charger, []);

  async function maj(id: number, statut: Admission["statut"]) {
    await api.majAdmission(id, statut);
    charger();
  }

  return (
    <AppLayout titre="Admissions">
      <div className="space-y-4">
        {admissions.map((a) => (
          <div key={a.id} className="rounded-2xl bg-white p-5 shadow-card border border-icc-purple/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-serif font-semibold text-icc-ink">{a.prenom_enfant} {a.nom_enfant} — {a.niveau_souhaite}</div>
                <div className="text-sm text-icc-slate">
                  Parent : {a.nom_parent} · {a.email_parent} · {a.telephone_parent}
                </div>
                {a.message && <div className="mt-1 text-sm text-icc-slate">« {a.message} »</div>}
                <div className="mt-1 text-xs text-icc-slate/70">
                  Déposée le {new Date(a.created_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <select
                value={a.statut}
                onChange={(e) => maj(a.id, e.target.value as Admission["statut"])}
                className="rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
              >
                {Object.entries(statutLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {admissions.length === 0 && <p className="text-icc-slate">Aucune demande d'admission.</p>}
      </div>
    </AppLayout>
  );
}
