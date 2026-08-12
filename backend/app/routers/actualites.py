from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user, require_role
from app.models.actualite import Actualite
from app.models.utilisateur import Role, Utilisateur
from app.schemas.communication import ActualiteCreate, ActualiteOut

router = APIRouter(prefix="/api/actualites", tags=["actualites"])


@router.get("", response_model=list[ActualiteOut])
async def liste_actualites(
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(get_current_user),
) -> list[Actualite]:
    result = await db.scalars(select(Actualite).order_by(Actualite.created_at.desc()))
    return list(result.all())


@router.post("", response_model=ActualiteOut, status_code=201)
async def creer_actualite(
    payload: ActualiteCreate,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.admin)),
) -> Actualite:
    actualite = Actualite(**payload.model_dump(), auteur_id=user.id)
    db.add(actualite)
    await db.commit()
    await db.refresh(actualite)
    return actualite


@router.put("/{actualite_id}", response_model=ActualiteOut)
async def modifier_actualite(
    actualite_id: int,
    payload: ActualiteCreate,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> Actualite:
    actualite = await db.get(Actualite, actualite_id)
    if actualite is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Actualité introuvable")
    for field, value in payload.model_dump().items():
        setattr(actualite, field, value)
    await db.commit()
    await db.refresh(actualite)
    return actualite


@router.delete("/{actualite_id}", status_code=204)
async def supprimer_actualite(
    actualite_id: int,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> None:
    actualite = await db.get(Actualite, actualite_id)
    if actualite is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Actualité introuvable")
    await db.delete(actualite)
    await db.commit()
