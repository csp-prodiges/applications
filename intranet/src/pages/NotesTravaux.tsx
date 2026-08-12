import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";
import type { Classe, Devoir, Enfant, Note } from "../types";

function NotesTravauxParent() {
  const { user } = useAuth();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [notes, setNotes] = useState<Record<number, Note[]>>({});
  const [devoirs, setDevoirs] = useState<Record<number, Devoir[]>>({});

  useEffect(() => {
    if (!user?.famille_id) return;
    api.enfantsFamille(user.famille_id).then(async (list) => {
      setEnfants(list);
      for (const enfant of list) {
        api.notesEnfant(enfant.id).then((n) => setNotes((prev) => ({ ...prev, [enfant.id]: n })));
        api.devoirsEnfant(enfant.id).then((d) => setDevoirs((prev) => ({ ...prev, [enfant.id]: d })));
      }
    });
  }, [user]);

  return (
    <div className="space-y-8">
      {enfants.map((enfant) => (
        <div key={enfant.id} className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
            <div className="mb-3 font-serif font-semibold text-icc-ink">
              Notes — {enfant.prenom} {enfant.nom}
            </div>
            <ul className="space-y-2">
              {(notes[enfant.id] ?? []).map((n) => (
                <li key={n.id} className="flex items-center justify-between border-b border-icc-purple/5 pb-2 text-sm">
                  <div>
                    <div className="font-medium text-icc-ink">{n.matiere}</div>
                    <div className="text-xs text-icc-slate/70">{n.date}{n.commentaire ? ` — ${n.commentaire}` : ""}</div>
                  </div>
                  <div className="font-bold text-icc-purple">{n.valeur} / {n.bareme}</div>
                </li>
              ))}
              {(notes[enfant.id] ?? []).length === 0 && (
                <li className="text-sm text-icc-slate/70">Aucune note pour le moment.</li>
              )}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
            <div className="mb-3 font-serif font-semibold text-icc-ink">Travaux à rendre</div>
            <ul className="space-y-2">
              {(devoirs[enfant.id] ?? []).map((d) => (
                <li key={d.id} className="border-b border-icc-purple/5 pb-2 text-sm">
                  <div className="font-serif font-medium text-icc-ink">{d.matiere} — {d.titre}</div>
                  <div className="text-xs text-icc-slate/70">À rendre le {d.date_limite}</div>
                </li>
              ))}
              {(devoirs[enfant.id] ?? []).length === 0 && (
                <li className="text-sm text-icc-slate/70">Aucun travail en cours.</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesTravauxEnseignant() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Classe[]>([]);
  const [classeId, setClasseId] = useState<number | null>(null);
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [devoirs, setDevoirs] = useState<Devoir[]>([]);
  const [noteForm, setNoteForm] = useState<{ enfantId: number | null; matiere: string; valeur: string; commentaire: string }>({
    enfantId: null,
    matiere: "",
    valeur: "",
    commentaire: "",
  });
  const [devoirForm, setDevoirForm] = useState({ matiere: "", titre: "", description: "", date_limite: "" });

  useEffect(() => {
    api.classes().then((all) => {
      const mine = all.filter((c) => c.enseignant_principal_id === user?.id);
      setClasses(mine);
      if (mine.length > 0) setClasseId(mine[0].id);
    });
  }, [user]);

  useEffect(() => {
    if (classeId === null) return;
    api.enfantsClasse(classeId).then(setEnfants);
    api.devoirsClasse(classeId).then(setDevoirs);
  }, [classeId]);

  async function ajouterNote() {
    if (!noteForm.enfantId || !noteForm.matiere || !noteForm.valeur) return;
    await api.creerNote({
      enfant_id: noteForm.enfantId,
      matiere: noteForm.matiere,
      valeur: Number(noteForm.valeur),
      bareme: 20,
      date: new Date().toISOString().slice(0, 10),
      commentaire: noteForm.commentaire || null,
    });
    setNoteForm({ enfantId: null, matiere: "", valeur: "", commentaire: "" });
  }

  async function ajouterDevoir() {
    if (!classeId || !devoirForm.matiere || !devoirForm.titre || !devoirForm.date_limite) return;
    const nouveau = await api.creerDevoir({
      classe_id: classeId,
      matiere: devoirForm.matiere,
      titre: devoirForm.titre,
      description: devoirForm.description || null,
      date_limite: devoirForm.date_limite,
    });
    setDevoirs((prev) => [...prev, nouveau]);
    setDevoirForm({ matiere: "", titre: "", description: "", date_limite: "" });
  }

  if (classes.length === 0) {
    return <p className="text-icc-slate">Aucune classe ne vous est encore assignée.</p>;
  }

  return (
    <div className="space-y-6">
      <select
        value={classeId ?? ""}
        onChange={(e) => setClasseId(Number(e.target.value))}
        className="rounded-xl border border-icc-purple/15 px-3 py-2"
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.nom} — {c.niveau}</option>
        ))}
      </select>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
          <div className="mb-3 font-serif font-semibold text-icc-ink">Ajouter une note</div>
          <div className="space-y-3">
            <select
              value={noteForm.enfantId ?? ""}
              onChange={(e) => setNoteForm({ ...noteForm, enfantId: Number(e.target.value) })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            >
              <option value="">Choisir un élève</option>
              {enfants.map((e) => (
                <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
              ))}
            </select>
            <input
              placeholder="Matière"
              value={noteForm.matiere}
              onChange={(e) => setNoteForm({ ...noteForm, matiere: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Note / 20"
              type="number"
              value={noteForm.valeur}
              onChange={(e) => setNoteForm({ ...noteForm, valeur: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Commentaire (optionnel)"
              value={noteForm.commentaire}
              onChange={(e) => setNoteForm({ ...noteForm, commentaire: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <button
              onClick={ajouterNote}
              className="w-full rounded-full bg-icc-purple px-4 py-2 text-sm font-semibold text-white hover:bg-icc-purple/90"
            >
              Enregistrer la note
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card border border-icc-purple/5">
          <div className="mb-3 font-serif font-semibold text-icc-ink">Devoirs de la classe</div>
          <ul className="mb-4 space-y-2">
            {devoirs.map((d) => (
              <li key={d.id} className="border-b border-icc-purple/5 pb-2 text-sm">
                <div className="font-serif font-medium text-icc-ink">{d.matiere} — {d.titre}</div>
                <div className="text-xs text-icc-slate/70">À rendre le {d.date_limite}</div>
              </li>
            ))}
          </ul>
          <div className="space-y-3">
            <input
              placeholder="Matière"
              value={devoirForm.matiere}
              onChange={(e) => setDevoirForm({ ...devoirForm, matiere: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Titre du devoir"
              value={devoirForm.titre}
              onChange={(e) => setDevoirForm({ ...devoirForm, titre: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={devoirForm.date_limite}
              onChange={(e) => setDevoirForm({ ...devoirForm, date_limite: e.target.value })}
              className="w-full rounded-xl border border-icc-purple/15 px-3 py-2 text-sm"
            />
            <button
              onClick={ajouterDevoir}
              className="w-full rounded-full bg-icc-purple px-4 py-2 text-sm font-semibold text-white hover:bg-icc-purple/90"
            >
              Ajouter le devoir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotesTravaux() {
  const { user } = useAuth();
  return (
    <AppLayout titre="Notes & travaux">
      {user?.role === "parent" && <NotesTravauxParent />}
      {user?.role === "enseignant" && <NotesTravauxEnseignant />}
    </AppLayout>
  );
}
