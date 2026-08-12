from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models.actualite import Actualite
from app.models.admission import Admission
from app.models.admission import StatutAdmission
from app.models.cantine import CantineTransaction, TypeTransaction
from app.models.classe import Classe
from app.models.commande import Commande, StatutCommande
from app.models.devoir import Devoir
from app.models.enfant import Enfant
from app.models.evenement import Evenement
from app.models.famille import Famille
from app.models.message import ConversationParticipant, Message
from app.models.note import Note
from app.models.utilisateur import Role, Utilisateur
from app.schemas.communication import ActualiteOut
from app.schemas.dashboard import DashboardAdminOut, DashboardEnseignantOut, DashboardFamilleOut, EnfantResume
from app.schemas.vie_scolaire import EvenementOut

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


async def _dernieres_actualites(db: AsyncSession, limit: int = 5) -> list[ActualiteOut]:
    result = await db.scalars(select(Actualite).order_by(Actualite.created_at.desc()).limit(limit))
    return [ActualiteOut.model_validate(a) for a in result.all()]


async def _prochain_evenement(db: AsyncSession, classe_ids: list[int]) -> EvenementOut | None:
    now = datetime.now(timezone.utc)
    query = select(Evenement).where(Evenement.date_debut >= now)
    if classe_ids:
        query = query.where((Evenement.classe_id.is_(None)) | (Evenement.classe_id.in_(classe_ids)))
    else:
        query = query.where(Evenement.classe_id.is_(None))
    evenement = await db.scalar(query.order_by(Evenement.date_debut).limit(1))
    return EvenementOut.model_validate(evenement) if evenement else None


@router.get("")
async def dashboard(
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(get_current_user),
) -> DashboardFamilleOut | DashboardEnseignantOut | DashboardAdminOut:
    if user.role == Role.parent:
        enfants = list(
            (await db.scalars(select(Enfant).where(Enfant.famille_id == user.famille_id))).all()
        )
        resumes = []
        classe_ids = []
        for enfant in enfants:
            if enfant.classe_id:
                classe_ids.append(enfant.classe_id)
            notes = list((await db.scalars(select(Note).where(Note.enfant_id == enfant.id))).all())
            moyenne = (
                sum(n.valeur / n.bareme * 20 for n in notes) / len(notes) if notes else None
            )
            travaux = 0
            if enfant.classe_id:
                now = datetime.now(timezone.utc).date()
                travaux = await db.scalar(
                    select(func.count()).select_from(Devoir).where(
                        Devoir.classe_id == enfant.classe_id, Devoir.date_limite >= now
                    )
                )
            transactions = list(
                (await db.scalars(select(CantineTransaction).where(CantineTransaction.enfant_id == enfant.id))).all()
            )
            solde = sum(
                t.montant if t.type == TypeTransaction.credit else -t.montant for t in transactions
            )
            classe = await db.get(Classe, enfant.classe_id) if enfant.classe_id else None
            resumes.append(
                EnfantResume(
                    enfant_id=enfant.id,
                    prenom=enfant.prenom,
                    nom=enfant.nom,
                    classe=classe.nom if classe else None,
                    moyenne_generale=round(moyenne, 1) if moyenne is not None else None,
                    travaux_a_rendre=travaux or 0,
                    solde_cantine=solde,
                )
            )

        messages_non_lus = await db.scalar(
            select(func.count())
            .select_from(Message)
            .join(ConversationParticipant, ConversationParticipant.conversation_id == Message.conversation_id)
            .where(
                ConversationParticipant.utilisateur_id == user.id,
                Message.auteur_id != user.id,
                Message.lu.is_(False),
            )
        )

        return DashboardFamilleOut(
            enfants=resumes,
            actualites=await _dernieres_actualites(db),
            prochain_evenement=await _prochain_evenement(db, classe_ids),
            messages_non_lus=messages_non_lus or 0,
        )

    if user.role == Role.enseignant:
        classes = list(
            (await db.scalars(select(Classe).where(Classe.enseignant_principal_id == user.id))).all()
        )
        now = datetime.now(timezone.utc).date()
        devoirs_a_venir = await db.scalar(
            select(func.count()).select_from(Devoir).where(
                Devoir.enseignant_id == user.id, Devoir.date_limite >= now
            )
        )
        return DashboardEnseignantOut(
            classes=[c.nom for c in classes],
            devoirs_a_venir=devoirs_a_venir or 0,
            prochain_evenement=await _prochain_evenement(db, [c.id for c in classes]),
            actualites=await _dernieres_actualites(db),
        )

    admissions_nouvelles = await db.scalar(
        select(func.count()).select_from(Admission).where(Admission.statut == StatutAdmission.nouvelle)
    )
    commandes_en_attente = await db.scalar(
        select(func.count()).select_from(Commande).where(Commande.statut == StatutCommande.en_attente)
    )
    total_familles = await db.scalar(select(func.count()).select_from(Famille))
    total_enfants = await db.scalar(select(func.count()).select_from(Enfant))

    return DashboardAdminOut(
        admissions_nouvelles=admissions_nouvelles or 0,
        commandes_en_attente=commandes_en_attente or 0,
        total_familles=total_familles or 0,
        total_enfants=total_enfants or 0,
        actualites=await _dernieres_actualites(db),
    )
