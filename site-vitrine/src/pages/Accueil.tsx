import { Link } from "react-router-dom";
import Section from "../components/Section";
import { IconBook, IconGraduationCap, IconSparkles, IconUsers } from "../components/Icons";
import { asset } from "../asset";

const dimensions = [
  { titre: "Formation", texte: "Impacter son environnement et briller dans sa génération.", icon: IconGraduationCap },
  { titre: "Refuge", texte: "Un cadre sûr, bienveillant et protecteur.", icon: IconUsers },
  { titre: "Transformation", texte: "Faire grandir l'enfant dans toutes ses dimensions.", icon: IconSparkles },
  { titre: "Excellence", texte: "Exiger et cultiver le meilleur de chacun.", icon: IconGraduationCap },
  { titre: "Éveil & Épanouissement", texte: "Révéler la curiosité, les talents et la joie d'apprendre.", icon: IconSparkles },
  { titre: "Valeurs chrétiennes", texte: "Transmettre des repères solides pour la vie.", icon: IconBook },
  { titre: "Communauté", texte: "Amour, écoute, partage — une communauté où chacun compte.", icon: IconUsers },
];

const modele = [
  { num: "01", titre: "Individualité", texte: "Prise en compte de l'individualité de chaque enfant." },
  { num: "02", titre: "Découverte de soi", texte: "Accompagnement vers ses dons, ses capacités, son environnement." },
  { num: "03", titre: "Bilinguisme", texte: "Deux langues au cœur de tous les apprentissages." },
  { num: "04", titre: "Numérique & IA", texte: "Premiers pas encadrés vers les outils de demain." },
  { num: "05", titre: "Valeurs chrétiennes", texte: "Présentation et transmission des valeurs chrétiennes." },
];

export default function Accueil() {
  return (
    <div>
      <div className="relative overflow-hidden bg-icc-purple">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-icc-purplelight/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-64 w-64 rounded-full bg-icc-gold/10 blur-3xl" />
        <Section className="relative grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-icc-goldlight">
              Un projet ICC — Impact Centre Chrétien
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] text-white md:text-5xl">
              Cité Scolaire Prodiges
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-purple-100/90">
              « Instruire aujourd'hui pour construire demain, des hommes et des femmes qui
              inspirent et influencent positivement leur environnement et qui brillent dans
              leur génération. »
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/admissions"
                className="rounded-full bg-icc-gold px-7 py-3.5 font-semibold text-icc-purpledark shadow-lift transition hover:brightness-105"
              >
                S'inscrire
              </Link>
              <Link
                to="/vision"
                className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Découvrir la CSP
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 -z-10 rounded-[32px] bg-gradient-to-br from-icc-gold/30 to-icc-purplelight/30 blur-2xl" />
            <img
              src={asset("photo-numerique.png")}
              alt="Élèves de la Cité Scolaire Prodiges en atelier numérique"
              className="aspect-[4/3] w-full rounded-[28px] object-cover shadow-lift"
            />
          </div>
        </Section>
      </div>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-gold">Notre raison d'être</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-icc-ink">
            Un lieu de formation, de refuge et d'excellence
          </h2>
          <p className="mt-3 text-icc-slate">
            7 dimensions, une même ambition : faire briller chaque enfant.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((d) => (
            <div
              key={d.titre}
              className="group rounded-2xl border border-icc-purple/5 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-icc-lilac text-icc-purple transition group-hover:bg-icc-purple group-hover:text-white">
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
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-icc-gold">Notre système</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-icc-ink">
              Un enfant connu, accompagné et préparé au monde qui vient
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-5">
            {modele.map((m) => (
              <div key={m.num} className="rounded-2xl bg-white p-6 text-center shadow-card">
                <div className="font-serif text-3xl font-bold text-icc-gold">{m.num}</div>
                <div className="mt-3 font-semibold text-icc-ink">{m.titre}</div>
                <p className="mt-2 text-xs leading-relaxed text-icc-slate">{m.texte}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section className="text-center">
        <h2 className="font-serif text-3xl font-semibold text-icc-ink md:text-4xl">
          Construire une génération qui inspire
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-icc-slate">
          Former, protéger, transformer, faire briller — chaque enfant, chaque jour.
        </p>
        <Link
          to="/admissions"
          className="mt-8 inline-block rounded-full bg-icc-purple px-9 py-3.5 font-semibold text-white shadow-lift transition hover:bg-icc-purpledark"
        >
          Nous rejoindre
        </Link>
      </Section>
    </div>
  );
}
