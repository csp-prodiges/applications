from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.commande import Commande
from app.models.utilisateur import Role, Utilisateur
from app.schemas.vie_scolaire import CommandeCreate, CommandeOut, CommandeStatutUpdate

router = APIRouter(prefix="/api/commandes", tags=["commandes"])


@router.get("", response_model=list[CommandeOut])
async def toutes_les_commandes(
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> list[Commande]:
    result = await db.scalars(select(Commande).order_by(Commande.created_at.desc()))
    return list(result.all())


@router.get("/famille/{famille_id}", response_model=list[CommandeOut])
async def commandes_famille(
    famille_id: int,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.parent, Role.admin)),
) -> list[Commande]:
    if user.role == Role.parent and user.famille_id != famille_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès non autorisé à cette famille")
    result = await db.scalars(
        select(Commande).where(Commande.famille_id == famille_id).order_by(Commande.created_at.desc())
    )
    return list(result.all())


@router.post("", response_model=CommandeOut, status_code=201)
async def creer_commande(
    payload: CommandeCreate,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.parent)),
) -> Commande:
    if user.famille_id is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Aucune famille associée à ce compte")
    commande = Commande(**payload.model_dump(), famille_id=user.famille_id)
    db.add(commande)
    await db.commit()
    await db.refresh(commande)
    return commande


@router.patch("/{commande_id}/statut", response_model=CommandeOut)
async def maj_statut_commande(
    commande_id: int,
    payload: CommandeStatutUpdate,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> Commande:
    commande = await db.get(Commande, commande_id)
    if commande is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Commande introuvable")
    commande.statut = payload.statut
    await db.commit()
    await db.refresh(commande)
    return commande
