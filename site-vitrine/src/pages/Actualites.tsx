import { useEffect, useState } from "react";
import Section from "../components/Section";
import { api } from "../api";
import type { Actualite } from "../types";

export default function Actualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    api.actualitesPubliques().then(setActualites).finally(() => setChargement(false));
  }, []);

  return (
    <div>
      <div className="bg-icc-purple">
        <Section className="py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Actualités</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white">Vie de l'école et événements</h1>
        </Section>
      </div>

      <Section>
        {chargement && <p className="text-icc-slate">Chargement…</p>}
        {!chargement && actualites.length === 0 && (
          <p className="text-icc-slate">Aucune actualité pour le moment.</p>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {actualites.map((a) => (
            <article key={a.id} className="rounded-2xl border border-icc-purple/5 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
              <div className="text-xs font-medium text-icc-slate">
                {new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h2 className="mt-2 font-serif text-lg font-semibold text-icc-ink">{a.titre}</h2>
              <p className="mt-2 text-sm leading-relaxed text-icc-slate">{a.contenu}</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
