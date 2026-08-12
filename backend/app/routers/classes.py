from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.classe import Classe
from app.models.enfant import Enfant
from app.models.utilisateur import Role, Utilisateur
from app.permissions import ensure_classe_ecriture
from app.schemas.academique import ClasseOut, EnfantOut

router = APIRouter(tags=["classes"])


@router.get("/api/classes", response_model=list[ClasseOut])
async def liste_classes(
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.parent, Role.enseignant, Role.admin)),
) -> list[Classe]:
    result = await db.scalars(select(Classe).order_by(Classe.nom))
    return list(result.all())


@router.get("/api/classes/{classe_id}/enfants", response_model=list[EnfantOut])
async def enfants_classe(
    classe_id: int,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.enseignant, Role.admin)),
) -> list[Enfant]:
    await ensure_classe_ecriture(db, user, classe_id)
    result = await db.scalars(select(Enfant).where(Enfant.classe_id == classe_id).order_by(Enfant.nom))
    return list(result.all())


@router.get("/api/enfants/famille/{famille_id}", response_model=list[EnfantOut])
async def enfants_famille(
    famille_id: int,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.parent, Role.admin)),
) -> list[Enfant]:
    if user.role == Role.parent and user.famille_id != famille_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès non autorisé à cette famille")
    result = await db.scalars(select(Enfant).where(Enfant.famille_id == famille_id).order_by(Enfant.nom))
    return list(result.all())
