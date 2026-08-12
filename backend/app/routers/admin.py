from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.admission import Admission
from app.models.famille import Famille
from app.models.utilisateur import Role, Utilisateur
from app.schemas.admission import AdmissionOut, AdmissionStatutUpdate, UtilisateurCreate
from app.schemas.auth import UtilisateurOut
from app.security import hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/admissions", response_model=list[AdmissionOut])
async def liste_admissions(
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> list[Admission]:
    result = await db.scalars(select(Admission).order_by(Admission.created_at.desc()))
    return list(result.all())


@router.patch("/admissions/{admission_id}", response_model=AdmissionOut)
async def maj_admission(
    admission_id: int,
    payload: AdmissionStatutUpdate,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> Admission:
    admission = await db.get(Admission, admission_id)
    if admission is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Admission introuvable")
    admission.statut = payload.statut
    await db.commit()
    await db.refresh(admission)
    return admission


@router.get("/utilisateurs", response_model=list[UtilisateurOut])
async def liste_utilisateurs(
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> list[Utilisateur]:
    result = await db.scalars(select(Utilisateur).order_by(Utilisateur.nom))
    return list(result.all())


@router.post("/utilisateurs", response_model=UtilisateurOut, status_code=201)
async def creer_utilisateur(
    payload: UtilisateurCreate,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> Utilisateur:
    existant = await db.scalar(select(Utilisateur).where(Utilisateur.email == payload.email))
    if existant is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Cet email est déjà utilisé")

    famille_id = None
    if payload.role == Role.parent.value:
        if not payload.famille_nom:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Le nom de famille est requis pour un parent")
        famille = Famille(nom_famille=payload.famille_nom)
        db.add(famille)
        await db.flush()
        famille_id = famille.id

    utilisateur = Utilisateur(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=Role(payload.role),
        nom=payload.nom,
        prenom=payload.prenom,
        telephone=payload.telephone,
        famille_id=famille_id,
    )
    db.add(utilisateur)
    await db.commit()
    await db.refresh(utilisateur)
    return utilisateur
