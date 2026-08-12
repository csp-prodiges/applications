export interface Actualite {
  id: number;
  titre: string;
  contenu: string;
  image_url: string | null;
  public: boolean;
  created_at: string;
}

export interface AdmissionPayload {
  nom_enfant: string;
  prenom_enfant: string;
  date_naissance: string;
  niveau_souhaite: string;
  nom_parent: string;
  email_parent: string;
  telephone_parent: string;
  message?: string;
}

export interface ContactPayload {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}
