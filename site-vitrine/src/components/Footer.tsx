export default function Footer() {
  return (
    <footer className="mt-24 bg-icc-purpledark text-purple-100">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white p-1.5 shadow-card">
                <img src="/csp-logo.svg" alt="Cité Scolaire Prodiges" className="h-9 w-9" />
              </div>
              <span className="font-serif text-lg font-semibold text-white">Cité Scolaire Prodiges</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-purple-200/80">
              Instruire aujourd'hui pour construire demain, des hommes et des femmes qui
              inspirent et influencent positivement leur environnement. Un projet d'ICC —
              Impact Centre Chrétien.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Navigation</div>
            <ul className="mt-4 space-y-2.5 text-sm text-purple-200/80">
              <li><a href="/ecole" className="transition hover:text-white">L'École</a></li>
              <li><a href="/programme" className="transition hover:text-white">Programme</a></li>
              <li><a href="/admissions" className="transition hover:text-white">Admissions</a></li>
              <li><a href="/actualites" className="transition hover:text-white">Actualités</a></li>
              <li><a href="/contact" className="transition hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Contact</div>
            <ul className="mt-4 space-y-2.5 text-sm text-purple-200/80">
              <li>contact@cite-scolaire-prodiges.org</li>
              <li>Un projet de l'église ICC</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-purple-300/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Cité Scolaire Prodiges — ICC. Tous droits réservés.</span>
          <span>Former, protéger, transformer, faire briller.</span>
        </div>
      </div>
    </footer>
  );
}
