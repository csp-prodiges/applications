from datetime import date

from pydantic import BaseModel


class ClasseOut(BaseModel):
    id: int
    nom: str
    niveau: str
    enseignant_principal_id: int | None = None

    class Config:
        from_attributes = True


class EnfantOut(BaseModel):
    id: int
    prenom: str
    nom: str
    date_naissance: date
    classe_id: int | None = None
    famille_id: int

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    enfant_id: int
    matiere: str
    valeur: float
    bareme: float = 20
    date: date
    commentaire: str | None = None


class NoteOut(NoteCreate):
    id: int
    enseignant_id: int

    class Config:
        from_attributes = True


class DevoirCreate(BaseModel):
    classe_id: int
    matiere: str
    titre: str
    description: str | None = None
    date_limite: date


class DevoirOut(DevoirCreate):
    id: int
    enseignant_id: int

    class Config:
        from_attributes = True
