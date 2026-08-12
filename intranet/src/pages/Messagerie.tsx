import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";
import type { Conversation, Message, Utilisateur } from "../types";

export default function Messagerie() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selection, setSelection] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [texte, setTexte] = useState("");
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [nouveauSujet, setNouveauSujet] = useState("");
  const [nouveauDestinataire, setNouveauDestinataire] = useState<number | "">("");

  function chargerConversations() {
    api.conversations().then((list) => {
      setConversations(list);
      if (list.length > 0 && selection === null) setSelection(list[0].id);
    });
  }

  useEffect(chargerConversations, []);
  useEffect(() => {
    if (user?.role === "admin") api.utilisateurs().then(setUtilisateurs);
  }, [user]);

  useEffect(() => {
    if (selection === null) return;
    api.messagesConversation(selection).then(setMessages);
  }, [selection]);

  async function envoyer() {
    if (!selection || !texte.trim()) return;
    const message = await api.envoyerMessage(selection, texte.trim());
    setMessages((prev) => [...prev, message]);
    setTexte("");
  }

  async function creerConversation() {
    if (!nouveauSujet || nouveauDestinataire === "") return;
    const conv = await api.creerConversation(nouveauSujet, [Number(nouveauDestinataire)]);
    setNouveauSujet("");
    setNouveauDestinataire("");
    chargerConversations();
    setSelection(conv.id);
  }

  return (
    <AppLayout titre="Messagerie">
      <div className="grid h-[70vh] gap-6 rounded-2xl bg-white shadow-card border border-icc-purple/5 lg:grid-cols-3">
        <div className="border-r border-icc-purple/5 p-4">
          <div className="mb-3 font-serif text-sm font-semibold text-icc-ink">Conversations</div>
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelection(c.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selection === c.id ? "bg-icc-purple text-white" : "text-icc-slate hover:bg-icc-mist"
                  }`}
                >
                  {c.sujet}
                </button>
              </li>
            ))}
            {conversations.length === 0 && <li className="text-sm text-icc-slate/70">Aucune conversation.</li>}
          </ul>

          {user?.role === "admin" && (
            <div className="mt-6 space-y-2 border-t border-icc-purple/5 pt-4">
              <div className="text-xs font-semibold text-icc-slate">Nouvelle conversation</div>
              <input
                placeholder="Sujet"
                value={nouveauSujet}
                onChange={(e) => setNouveauSujet(e.target.value)}
                className="w-full rounded-xl border border-icc-purple/15 px-2 py-1.5 text-sm"
              />
              <select
                value={nouveauDestinataire}
                onChange={(e) => setNouveauDestinataire(e.target.value ? Number(e.target.value) : "")}
                className="w-full rounded-xl border border-icc-purple/15 px-2 py-1.5 text-sm"
              >
                <option value="">Destinataire…</option>
                {utilisateurs.filter((u) => u.id !== user.id).map((u) => (
                  <option key={u.id} value={u.id}>{u.prenom} {u.nom} ({u.role})</option>
                ))}
              </select>
              <button
                onClick={creerConversation}
                className="w-full rounded-full bg-icc-purple px-3 py-1.5 text-xs font-semibold text-white hover:bg-icc-purple/90"
              >
                Démarrer
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col p-4 lg:col-span-2">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-md rounded-2xl px-4 py-2 text-sm ${
                  m.auteur_id === user?.id ? "ml-auto bg-icc-purple text-white" : "bg-icc-mist text-icc-ink"
                }`}
              >
                {m.contenu}
                <div className={`mt-1 text-[10px] ${m.auteur_id === user?.id ? "text-purple-200" : "text-icc-slate/70"}`}>
                  {new Date(m.created_at).toLocaleString("fr-FR")}
                </div>
              </div>
            ))}
            {selection && messages.length === 0 && (
              <p className="text-sm text-icc-slate/70">Aucun message. Démarrez la conversation.</p>
            )}
          </div>
          {selection && (
            <div className="mt-4 flex gap-2">
              <input
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && envoyer()}
                placeholder="Votre message…"
                className="flex-1 rounded-full border border-icc-purple/15 px-4 py-2 text-sm"
              />
              <button
                onClick={envoyer}
                className="rounded-full bg-icc-purple px-5 py-2 text-sm font-semibold text-white hover:bg-icc-purple/90"
              >
                Envoyer
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
