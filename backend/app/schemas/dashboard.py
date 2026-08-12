from datetime import datetime

from pydantic import BaseModel

from app.schemas.communication import ActualiteOut
from app.schemas.vie_scolaire import EvenementOut


class EnfantResume(BaseModel):
    enfant_id: int
    prenom: str
    nom: str
    classe: str | None
    moyenne_generale: float | None
    travaux_a_rendre: int
    solde_cantine: float


class DashboardFamilleOut(BaseModel):
    enfants: list[EnfantResume]
    actualites: list[ActualiteOut]
    prochain_evenement: EvenementOut | None
    messages_non_lus: int


class DashboardEnseignantOut(BaseModel):
    classes: list[str]
    devoirs_a_venir: int
    prochain_evenement: EvenementOut | None
    actualites: list[ActualiteOut]


class DashboardAdminOut(BaseModel):
    admissions_nouvelles: int
    commandes_en_attente: int
    total_familles: int
    total_enfants: int
    actualites: list[ActualiteOut]
