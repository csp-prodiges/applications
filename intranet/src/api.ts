import type {
  Actualite,
  Admission,
  CantineSolde,
  Classe,
  Commande,
  Conversation,
  DashboardAdmin,
  DashboardEnseignant,
  DashboardFamille,
  Devoir,
  Enfant,
  Evenement,
  Message,
  Note,
  Ressource,
  Utilisateur,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8001";

function getTokens() {
  return {
    access: localStorage.getItem("csp_access_token"),
    refresh: localStorage.getItem("csp_refresh_token"),
  };
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("csp_access_token", access);
  localStorage.setItem("csp_refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("csp_access_token");
  localStorage.removeItem("csp_refresh_token");
}

async function refreshTokens(): Promise<boolean> {
  const { refresh } = getTokens();
  if (!refresh) return false;
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return true;
}

async function req<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const { access } = getTokens();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401 && retry) {
    const refreshed = await refreshTokens();
    if (refreshed) return req<T>(path, options, false);
    clearTokens();
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail ?? `Erreur ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      throw new Error(detail.detail ?? "Échec de la connexion");
    }
    return res.json() as Promise<{ access_token: string; refresh_token: string }>;
  },
  me: () => req<Utilisateur>("/api/auth/me"),

  dashboard: () => req<DashboardFamille | DashboardEnseignant | DashboardAdmin>("/api/dashboard"),

  classes: () => req<Classe[]>("/api/classes"),
  enfantsClasse: (classeId: number) => req<Enfant[]>(`/api/classes/${classeId}/enfants`),
  enfantsFamille: (familleId: number) => req<Enfant[]>(`/api/enfants/famille/${familleId}`),

  notesEnfant: (enfantId: number) => req<Note[]>(`/api/notes/enfant/${enfantId}`),
  creerNote: (payload: Omit<Note, "id" | "enseignant_id">) =>
    req<Note>("/api/notes", { method: "POST", body: JSON.stringify(payload) }),

  devoirsClasse: (classeId: number) => req<Devoir[]>(`/api/devoirs/classe/${classeId}`),
  devoirsEnfant: (enfantId: number) => req<Devoir[]>(`/api/devoirs/enfant/${enfantId}`),
  creerDevoir: (payload: Omit<Devoir, "id" | "enseignant_id">) =>
    req<Devoir>("/api/devoirs", { method: "POST", body: JSON.stringify(payload) }),

  planning: () => req<Evenement[]>("/api/planning"),
  creerEvenement: (payload: Omit<Evenement, "id">) =>
    req<Evenement>("/api/planning", { method: "POST", body: JSON.stringify(payload) }),

  soldeCantine: (enfantId: number) => req<CantineSolde>(`/api/cantine/enfant/${enfantId}`),

  commandesFamille: (familleId: number) => req<Commande[]>(`/api/commandes/famille/${familleId}`),
  toutesLesCommandes: () => req<Commande[]>("/api/commandes"),
  creerCommande: (payload: { type: Commande["type"]; details: Record<string, unknown>; montant: number }) =>
    req<Commande>("/api/commandes", { method: "POST", body: JSON.stringify(payload) }),
  majStatutCommande: (id: number, statut: Commande["statut"]) =>
    req<Commande>(`/api/commandes/${id}/statut`, { method: "PATCH", body: JSON.stringify({ statut }) }),

  actualites: () => req<Actualite[]>("/api/actualites"),
  creerActualite: (payload: { titre: string; contenu: string; image_url: string | null; public: boolean }) =>
    req<Actualite>("/api/actualites", { method: "POST", body: JSON.stringify(payload) }),

  conversations: () => req<Conversation[]>("/api/messagerie/conversations"),
  creerConversation: (sujet: string, participantIds: number[]) =>
    req<Conversation>("/api/messagerie/conversations", {
      method: "POST",
      body: JSON.stringify({ sujet, participant_ids: participantIds }),
    }),
  messagesConversation: (conversationId: number) =>
    req<Message[]>(`/api/messagerie/conversations/${conversationId}/messages`),
  envoyerMessage: (conversationId: number, contenu: string) =>
    req<Message>(`/api/messagerie/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ contenu }),
    }),

  ressources: () => req<Ressource[]>("/api/ressources"),
  creerRessource: (payload: Omit<Ressource, "id" | "created_at">) =>
    req<Ressource>("/api/ressources", { method: "POST", body: JSON.stringify(payload) }),

  admissions: () => req<Admission[]>("/api/admin/admissions"),
  majAdmission: (id: number, statut: Admission["statut"]) =>
    req<Admission>(`/api/admin/admissions/${id}`, { method: "PATCH", body: JSON.stringify({ statut }) }),
  utilisateurs: () => req<Utilisateur[]>("/api/admin/utilisateurs"),
  creerUtilisateur: (payload: {
    email: string;
    password: string;
    role: string;
    nom: string;
    prenom: string;
    telephone?: string;
    famille_nom?: string;
  }) => req<Utilisateur>("/api/admin/utilisateurs", { method: "POST", body: JSON.stringify(payload) }),
};
