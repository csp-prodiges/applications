import Section from "../components/Section";
import { asset } from "../asset";

export default function Ecole() {
  return (
    <div>
      <div className="bg-icc-purple">
        <Section className="py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">L'École</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white">Notre raison d'être</h1>
          <p className="mt-4 max-w-2xl text-purple-100/90">
            Vision déclinée des 12 points de la vision de l'église ICC.
          </p>
        </Section>
      </div>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-icc-ink">Une école qui fait grandir</h2>
            <p className="mt-4 leading-relaxed text-icc-slate">
              Corps, esprit et cœur : l'enfant grandit sur tous les plans. La Cité Scolaire
              Prodiges propose un accompagnement complet, exigeant et bienveillant.
            </p>
            <ul className="mt-7 space-y-4">
              {[
                ["Langues étrangères", "Mandarin, russe… en option"],
                ["Musique", "Apprentissage d'un instrument et pratique collective"],
                ["Sport", "Pratique régulière et esprit d'équipe"],
                ["Uniforme", "Le port de l'uniforme, signe d'appartenance"],
                ["Voyage scolaire", "Séjour linguistique et culturel chaque fin d'année"],
              ].map(([titre, texte]) => (
                <li key={titre} className="flex gap-4 rounded-xl bg-white p-4 shadow-card">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-icc-gold" />
                  <div>
                    <div className="font-semibold text-icc-ink">{titre}</div>
                    <div className="text-sm text-icc-slate">{texte}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:sticky lg:top-24">
            <div className="grid grid-cols-2 gap-3">
              <img
                src={asset("photo-atelier-creatif.jpg")}
                alt="Atelier créatif à la Cité Scolaire Prodiges"
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-card"
              />
              <div className="grid gap-3">
                <img
                  src={asset("photo-musique.png")}
                  alt="Ensemble musical d'élèves"
                  className="aspect-square w-full rounded-2xl object-cover shadow-card"
                />
                <img
                  src={asset("photo-espace-jeux.jpg")}
                  alt="Espace de jeux de la Cité Scolaire Prodiges"
                  className="aspect-square w-full rounded-2xl object-cover shadow-card"
                />
              </div>
            </div>
            <h2 className="mt-10 font-serif text-2xl font-semibold text-icc-ink">Une communauté éducative</h2>
            <p className="mt-3 text-icc-slate">Pour les enseignants comme pour les parents.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-icc-purple/5 bg-icc-mist p-5">
                <div className="font-serif font-semibold text-icc-purple">Enseignants</div>
                <p className="mt-1.5 text-sm leading-relaxed text-icc-slate">
                  Un centre de formation continue interne, une pédagogie partagée et
                  accompagnée, des équipes formées au bilinguisme et au numérique.
                </p>
              </div>
              <div className="rounded-2xl border border-icc-purple/5 bg-icc-mist p-5">
                <div className="font-serif font-semibold text-icc-purple">Parents</div>
                <p className="mt-1.5 text-sm leading-relaxed text-icc-slate">
                  Des cours assurés, des enseignants présents, crèche et périscolaire, et un
                  intranet dédié : actualités, notes et travaux, commandes, planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
