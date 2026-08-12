import { useState, type FormEvent } from "react";
import Section from "../components/Section";
import { api } from "../api";

export default function Contact() {
  const [statut, setStatut] = useState<"idle" | "envoi" | "succes" | "erreur">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatut("envoi");
    const form = new FormData(formEl);
    try {
      await api.contact({
        nom: String(form.get("nom")),
        email: String(form.get("email")),
        sujet: String(form.get("sujet")),
        message: String(form.get("message")),
      });
      setStatut("succes");
      formEl.reset();
    } catch {
      setStatut("erreur");
    }
  }

  return (
    <div>
      <div className="bg-icc-purple">
        <Section className="py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Contact</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white">Une question ?</h1>
          <p className="mt-4 max-w-2xl text-purple-100/90">
            Notre équipe vous répond avec plaisir.
          </p>
        </Section>
      </div>

      <Section className="max-w-xl">
        {statut === "succes" ? (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-lift">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-icc-green/10 text-2xl">✅</div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-icc-ink">Message envoyé !</h2>
            <p className="mt-2 text-icc-slate">Nous vous répondrons dans les meilleurs délais.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 rounded-[28px] bg-white p-8 shadow-lift md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-icc-ink">Nom</label>
                <input name="nom" required className="w-full rounded-xl border border-icc-purple/15 bg-white px-3.5 py-2.5 text-icc-ink focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-icc-ink">Email</label>
                <input name="email" type="email" required className="w-full rounded-xl border border-icc-purple/15 bg-white px-3.5 py-2.5 text-icc-ink focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-icc-ink">Sujet</label>
              <input name="sujet" required className="w-full rounded-xl border border-icc-purple/15 bg-white px-3.5 py-2.5 text-icc-ink focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-icc-ink">Message</label>
              <textarea name="message" rows={5} required className="w-full rounded-xl border border-icc-purple/15 bg-white px-3.5 py-2.5 text-icc-ink focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10" />
            </div>
            {statut === "erreur" && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Une erreur est survenue, réessayez.</p>
            )}
            <button
              type="submit"
              disabled={statut === "envoi"}
              className="w-full rounded-full bg-icc-purple px-6 py-3.5 font-semibold text-white shadow-card transition hover:bg-icc-purpledark disabled:opacity-60"
            >
              {statut === "envoi" ? "Envoi en cours…" : "Envoyer"}
            </button>
          </form>
        )}
      </Section>
    </div>
  );
}
