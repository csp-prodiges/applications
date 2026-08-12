from datetime import datetime

from pydantic import BaseModel

from app.models.cantine import TypeTransaction
from app.models.commande import StatutCommande, TypeCommande
from app.models.evenement import TypeEvenement


class EvenementCreate(BaseModel):
    titre: str
    description: str | None = None
    date_debut: datetime
    date_fin: datetime | None = None
    type: TypeEvenement
    classe_id: int | None = None


class EvenementOut(EvenementCreate):
    id: int

    class Config:
        from_attributes = True


class CantineTransactionCreate(BaseModel):
    enfant_id: int
    montant: float
    type: TypeTransaction
    description: str | None = None


class CantineTransactionOut(CantineTransactionCreate):
    id: int
    date: datetime

    class Config:
        from_attributes = True


class CantineSoldeOut(BaseModel):
    enfant_id: int
    solde: float
    transactions: list[CantineTransactionOut]


class CommandeCreate(BaseModel):
    type: TypeCommande
    details: dict = {}
    montant: float


class CommandeOut(CommandeCreate):
    id: int
    famille_id: int
    statut: StatutCommande
    created_at: datetime

    class Config:
        from_attributes = True


class CommandeStatutUpdate(BaseModel):
    statut: StatutCommande
