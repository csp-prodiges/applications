import { useState, type FormEvent } from "react";
import Section from "../components/Section";
import { api } from "../api";

const niveaux = ["Crèche", "Petite section", "Moyenne section", "Grande section", "CP", "CE1", "CE2", "CM1", "CM2"];

export default function Admissions() {
  const [statut, setStatut] = useState<"idle" | "envoi" | "succes" | "erreur">("idle");
  const [erreur, setErreur] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatut("envoi");
    setErreur("");
    const form = new FormData(formEl);
    try {
      await api.deposerAdmission({
        nom_enfant: String(form.get("nom_enfant")),
        prenom_enfant: String(form.get("prenom_enfant")),
        date_naissance: String(form.get("date_naissance")),
        niveau_souhaite: String(form.get("niveau_souhaite")),
        nom_parent: String(form.get("nom_parent")),
        email_parent: String(form.get("email_parent")),
        telephone_parent: String(form.get("telephone_parent")),
        message: String(form.get("message") || ""),
      });
      setStatut("succes");
      formEl.reset();
    } catch (err) {
      setStatut("erreur");
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <div>
      <div className="bg-icc-purple">
        <Section className="py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Admissions</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white">Dossier et inscription en ligne</h1>
          <p className="mt-4 max-w-2xl text-purple-100/90">
            Remplissez ce formulaire, notre équipe vous recontactera rapidement pour finaliser
            l'inscription de votre enfant.
          </p>
        </Section>
      </div>

      <Section className="max-w-2xl">
        {statut === "succes" ? (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-lift">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-icc-green/10 text-2xl">✅</div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-icc-ink">Demande envoyée !</h2>
            <p className="mt-2 text-icc-slate">
              Merci pour votre demande d'admission. Notre équipe vous contactera prochainement.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 rounded-[28px] bg-white p-8 shadow-lift md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <Champ label="Prénom de l'enfant" name="prenom_enfant" required />
              <Champ label="Nom de l'enfant" name="nom_enfant" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Champ label="Date de naissance" name="date_naissance" type="date" required />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-icc-ink">Niveau souhaité</label>
                <select
                  name="niveau_souhaite"
                  required
                  className="w-full rounded-xl border border-icc-purple/15 bg-white px-3.5 py-2.5 text-icc-ink focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10"
                >
                  {niveaux.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Champ label="Nom du parent" name="nom_parent" required />
              <Champ label="Téléphone" name="telephone_parent" type="tel" required />
            </div>
            <Champ label="Email" name="email_parent" type="email" required />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-icc-ink">Message (optionnel)</label>
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-xl border border-icc-purple/15 bg-white px-3.5 py-2.5 text-icc-ink focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10"
              />
            </div>

            {statut === "erreur" && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erreur}</p>
            )}

            <button
              type="submit"
              disabled={statut === "envoi"}
              className="w-full rounded-full bg-icc-purple px-6 py-3.5 font-semibold text-white shadow-card transition hover:bg-icc-purpledark disabled:opacity-60"
            >
              {statut === "envoi" ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
          </form>
        )}
      </Section>
    </div>
  );
}

function Champ({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-icc-ink">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-icc-purple/15 bg-white px-3.5 py-2.5 text-icc-ink focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10"
      />
    </div>
  );
}
