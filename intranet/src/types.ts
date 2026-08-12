export type Role = "parent" | "enseignant" | "admin";

export interface Utilisateur {
  id: number;
  email: string;
  role: Role;
  nom: string;
  prenom: string;
  telephone: string | null;
  famille_id: number | null;
}

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  enseignant_principal_id: number | null;
}

export interface Enfant {
  id: number;
  prenom: string;
  nom: string;
  date_naissance: string;
  classe_id: number | null;
  famille_id: number;
}

export interface Note {
  id: number;
  enfant_id: number;
  matiere: string;
  valeur: number;
  bareme: number;
  date: string;
  commentaire: string | null;
  enseignant_id: number;
}

export interface Devoir {
  id: number;
  classe_id: number;
  matiere: string;
  titre: string;
  description: string | null;
  date_limite: string;
  enseignant_id: number;
}

export interface Evenement {
  id: number;
  titre: string;
  description: string | null;
  date_debut: string;
  date_fin: string | null;
  type: "reunion" | "sortie" | "vacances" | "examen" | "autre";
  classe_id: number | null;
}

export interface CantineTransaction {
  id: number;
  enfant_id: number;
  montant: number;
  type: "credit" | "debit";
  description: string | null;
  date: string;
}

export interface CantineSolde {
  enfant_id: number;
  solde: number;
  transactions: CantineTransaction[];
}

export interface Commande {
  id: number;
  famille_id: number;
  type: "uniforme" | "livre" | "cantine_recharge";
  details: Record<string, unknown>;
  montant: number;
  statut: "en_attente" | "validee" | "livree";
  created_at: string;
}

export interface Actualite {
  id: number;
  titre: string;
  contenu: string;
  image_url: string | null;
  public: boolean;
  auteur_id: number | null;
  created_at: string;
}

export interface Conversation {
  id: number;
  sujet: string;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  auteur_id: number;
  contenu: string;
  created_at: string;
  lu: boolean;
}

export interface Ressource {
  id: number;
  titre: string;
  description: string | null;
  lien: string | null;
  categorie: string;
  created_at: string;
}

export interface Admission {
  id: number;
  nom_enfant: string;
  prenom_enfant: string;
  date_naissance: string;
  niveau_souhaite: string;
  nom_parent: string;
  email_parent: string;
  telephone_parent: string;
  message: string | null;
  statut: "nouvelle" | "contactee" | "inscrite" | "refusee";
  created_at: string;
}

export interface EnfantResume {
  enfant_id: number;
  prenom: string;
  nom: string;
  classe: string | null;
  moyenne_generale: number | null;
  travaux_a_rendre: number;
  solde_cantine: number;
}

export interface DashboardFamille {
  enfants: EnfantResume[];
  actualites: Actualite[];
  prochain_evenement: Evenement | null;
  messages_non_lus: number;
}

export interface DashboardEnseignant {
  classes: string[];
  devoirs_a_venir: number;
  prochain_evenement: Evenement | null;
  actualites: Actualite[];
}

export interface DashboardAdmin {
  admissions_nouvelles: number;
  commandes_en_attente: number;
  total_familles: number;
  total_enfants: number;
  actualites: Actualite[];
}
