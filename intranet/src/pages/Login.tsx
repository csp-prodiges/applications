import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      await login(email, password);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Échec de la connexion");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-icc-purple p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-icc-purplelight/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-icc-gold/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="rounded-full bg-white p-1.5 shadow-card">
            <img src="/csp-logo.svg" alt="CSP" className="h-9 w-9" />
          </div>
          <div className="font-serif text-lg font-semibold">Cité Scolaire Prodiges</div>
        </div>

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-icc-goldlight">Espace privé</p>
          <h1 className="mt-3 max-w-md font-serif text-3xl font-semibold leading-tight">
            Familles et équipes, retrouvez la vie de l'école au même endroit.
          </h1>
          <p className="mt-4 max-w-sm text-purple-100/80">
            Actualités, notes et travaux, planning, cantine, commandes et messagerie —
            tout ce qui rythme l'année de votre enfant.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl shadow-lift">
          <img src="/photo-musique.png" alt="Vie de la Cité Scolaire Prodiges" className="aspect-[4/3] w-full object-cover" />
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-icc-mist px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <img src="/csp-logo.svg" alt="CSP" className="h-16 w-16" />
          </div>

          <h2 className="font-serif text-2xl font-semibold text-icc-ink">Connexion</h2>
          <p className="mt-1 text-sm text-icc-slate">Accédez à votre espace intranet.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-[24px] bg-white p-7 shadow-lift">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-icc-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-icc-purple/15 px-3.5 py-2.5 focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-icc-ink">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-icc-purple/15 px-3.5 py-2.5 focus:border-icc-purple focus:outline-none focus:ring-2 focus:ring-icc-purple/10"
              />
            </div>
            {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erreur}</p>}
            <button
              type="submit"
              disabled={envoi}
              className="w-full rounded-full bg-icc-purple px-4 py-3 font-semibold text-white shadow-card transition hover:bg-icc-purpledark disabled:opacity-60"
            >
              {envoi ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-icc-purple/10 bg-white/60 p-4 text-xs leading-relaxed text-icc-slate">
            <div className="mb-1.5 font-semibold text-icc-ink">Comptes de démonstration</div>
            famille.kouassi@example.com / Famille@CSP2026! <br />
            prof.dupont@cite-scolaire-prodiges.org / Prof@CSP2026! <br />
            admin@cite-scolaire-prodiges.org / Admin@CSP2026!
          </div>
        </div>
      </div>
    </div>
  );
}
