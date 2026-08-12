import Section from "../components/Section";
import { IconBook, IconGraduationCap, IconSparkles, IconUsers } from "../components/Icons";

const dimensions = [
  { titre: "Formation", texte: "Impacter son environnement et briller dans sa génération.", icon: IconGraduationCap },
  { titre: "Refuge", texte: "Un cadre sûr, bienveillant et protecteur.", icon: IconUsers },
  { titre: "Transformation", texte: "Faire grandir l'enfant dans toutes ses dimensions.", icon: IconSparkles },
  { titre: "Excellence", texte: "Exiger et cultiver le meilleur de chacun.", icon: IconGraduationCap },
  { titre: "Éveil & Épanouissement", texte: "Révéler la curiosité, les talents et la joie d'apprendre.", icon: IconSparkles },
  { titre: "Valeurs chrétiennes", texte: "Transmettre des repères solides pour la vie.", icon: IconBook },
  { titre: "Communauté", texte: "Amour, écoute, partage — une communauté où chacun compte.", icon: IconUsers },
];

export default function Vision() {
  return (
    <div>
      <div className="bg-icc-purple">
        <Section className="py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Notre vision</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold text-white md:text-4xl">
            « Instruire aujourd'hui pour construire demain, des hommes et des femmes qui
            inspirent et influencent positivement leur environnement et qui brillent dans
            leur génération. »
          </h1>
        </Section>
      </div>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-icc-ink">
            La CSP, un lieu de formation, de refuge et d'excellence
          </h2>
          <p className="mt-3 text-icc-slate">
            7 dimensions, une même ambition : faire briller chaque enfant.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((d) => (
            <div key={d.titre} className="rounded-2xl border border-icc-purple/5 bg-white p-6 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-icc-lilac text-icc-purple">
                <d.icon />
              </div>
              <div className="mt-4 font-serif text-lg font-semibold text-icc-ink">{d.titre}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-icc-slate">{d.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="bg-icc-mist">
        <Section>
          <div className="grid gap-4 sm:grid-cols-3">
            <img src="/photo-arts-1.jpg" alt="Atelier créatif à la Cité Scolaire Prodiges" className="aspect-square w-full rounded-2xl object-cover shadow-card" />
            <img src="/photo-arts-2.jpg" alt="Création artistique en classe" className="aspect-square w-full rounded-2xl object-cover shadow-card" />
            <img src="/photo-arts-3.jpg" alt="Élèves partageant un projet créatif" className="aspect-square w-full rounded-2xl object-cover shadow-card" />
          </div>
        </Section>
      </div>
    </div>
  );
}
