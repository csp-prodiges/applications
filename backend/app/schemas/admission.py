from datetime import date, datetime

from pydantic import BaseModel, EmailStr

from app.models.admission import StatutAdmission


class AdmissionCreate(BaseModel):
    nom_enfant: str
    prenom_enfant: str
    date_naissance: date
    niveau_souhaite: str
    nom_parent: str
    email_parent: EmailStr
    telephone_parent: str
    message: str | None = None


class AdmissionOut(AdmissionCreate):
    id: int
    statut: StatutAdmission
    created_at: datetime

    class Config:
        from_attributes = True


class AdmissionStatutUpdate(BaseModel):
    statut: StatutAdmission


class ContactRequest(BaseModel):
    nom: str
    email: EmailStr
    sujet: str
    message: str


class UtilisateurCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    nom: str
    prenom: str
    telephone: str | None = None
    famille_nom: str | None = None
