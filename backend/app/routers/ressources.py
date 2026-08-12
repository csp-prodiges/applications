from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.ressource import RessourceEnseignant
from app.models.utilisateur import Role, Utilisateur
from app.schemas.communication import RessourceCreate, RessourceOut

router = APIRouter(prefix="/api/ressources", tags=["ressources"])


@router.get("", response_model=list[RessourceOut])
async def liste_ressources(
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.enseignant, Role.admin)),
) -> list[RessourceEnseignant]:
    result = await db.scalars(
        select(RessourceEnseignant).order_by(RessourceEnseignant.created_at.desc())
    )
    return list(result.all())


@router.post("", response_model=RessourceOut, status_code=201)
async def creer_ressource(
    payload: RessourceCreate,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> RessourceEnseignant:
    ressource = RessourceEnseignant(**payload.model_dump())
    db.add(ressource)
    await db.commit()
    await db.refresh(ressource)
    return ressource
