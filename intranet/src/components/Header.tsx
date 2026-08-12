import { useAuth } from "../auth/AuthContext";

export default function Header({ titre }: { titre: string }) {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-icc-purple/5 bg-white/90 px-8 py-5 backdrop-blur">
      <div>
        <h1 className="font-serif text-xl font-semibold text-icc-ink">{titre}</h1>
        {user && (
          <p className="text-sm text-icc-slate">
            Bonjour, {user.prenom} {user.nom} — Année 2026-2027
          </p>
        )}
      </div>
      {user && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-icc-lilac text-sm font-bold text-icc-purple">
          {user.prenom[0]}
          {user.nom[0]}
        </div>
      )}
    </header>
  );
}
