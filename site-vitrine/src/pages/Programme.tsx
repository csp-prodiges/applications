import Section from "../components/Section";
import { IconBook, IconGraduationCap, IconSparkles, IconUsers } from "../components/Icons";

const sections = [
  { titre: "Les fondamentaux", texte: "Lire, écrire, compter, raisonner.", icon: IconBook },
  { titre: "Étude biblique", texte: "Adaptée selon l'âge de l'enfant.", icon: IconSparkles },
  { titre: "Section langues", texte: "Bilinguisme et langues en option.", icon: IconUsers },
  { titre: "Section artistique", texte: "Musique, expression, création.", icon: IconSparkles },
  { titre: "Section sport", texte: "Pratique, endurance, esprit d'équipe.", icon: IconGraduationCap },
];

const tarifs = [
  { poste: "Frais d'inscription", tarif: "0 € / an" },
  { poste: "Repas", tarif: "5 € / jour" },
  { poste: "Uniforme", tarif: "30 € / an" },
  { poste: "Périscolaire", tarif: "5 € / heure" },
  { poste: "Livres pédagogiques", tarif: "30 € / matière" },
];

export default function Programme() {
  return (
    <div>
      <div className="bg-icc-purple">
        <Section className="py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Le programme pédagogique</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white">Briller dans sa génération</h1>
          <p className="mt-4 max-w-2xl text-purple-100/90">
            Un socle exigeant, enrichi par les langues, les arts, le sport et la formation
            du caractère.
          </p>
        </Section>
      </div>

      <Section>
        <div className="grid gap-5 md:grid-cols-5">
          {sections.map((s) => (
            <div key={s.titre} className="rounded-2xl border border-icc-purple/5 bg-white p-6 text-center shadow-card">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-icc-lilac text-icc-purple">
                <s.icon />
              </div>
              <div className="mt-4 font-serif font-semibold text-icc-ink">{s.titre}</div>
              <p className="mt-1.5 text-sm text-icc-slate">{s.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-5 sm:grid-cols-3">
          <img src="/photo-numerique-1.jpg" alt="Élève en atelier numérique" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-card" />
          <img src="/photo-numerique-2.jpg" alt="Élève en atelier robotique" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-card" />
          <img src="/photo-salle-classe.jpg" alt="Salle de classe de la Cité Scolaire Prodiges" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-card" />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-icc-slate">
          Numérique & IA, robotique, langues, arts : nos élèves explorent chaque semaine de
          nouveaux outils dans des salles pensées pour l'apprentissage actif.
        </p>
      </Section>

      <div className="bg-icc-mist">
        <Section>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-icc-gold">Transparence</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-icc-ink">Frais et tarifs</h2>
              <p className="mt-3 text-icc-slate">
                Une école d'excellence accessible aux familles, sans frais d'inscription.
              </p>
              <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card">
                <table className="w-full text-left">
                  <tbody>
                    {tarifs.map((t, i) => (
                      <tr key={t.poste} className={i !== tarifs.length - 1 ? "border-b border-icc-purple/5" : ""}>
                        <td className="px-6 py-3.5 text-icc-slate">{t.poste}</td>
                        <td className="px-6 py-3.5 text-right font-semibold text-icc-ink">{t.tarif}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-[28px] bg-icc-purple p-10 text-center text-white shadow-lift">
              <div className="font-serif text-6xl font-bold text-icc-goldlight">0 €</div>
              <div className="mt-2 text-lg font-medium">de frais d'inscription</div>
              <p className="mx-auto mt-4 max-w-xs text-sm text-purple-100/80">
                Notre priorité : que chaque famille puisse offrir à son enfant une éducation
                d'excellence, sans barrière à l'entrée.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
