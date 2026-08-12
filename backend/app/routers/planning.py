from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.evenement import Evenement
from app.models.utilisateur import Role, Utilisateur
from app.permissions import ensure_classe_ecriture
from app.schemas.vie_scolaire import EvenementCreate, EvenementOut

router = APIRouter(prefix="/api/planning", tags=["planning"])


@router.get("", response_model=list[EvenementOut])
async def liste_evenements(
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.parent, Role.enseignant, Role.admin)),
) -> list[Evenement]:
    result = await db.scalars(select(Evenement).order_by(Evenement.date_debut))
    return list(result.all())


@router.post("", response_model=EvenementOut, status_code=201)
async def creer_evenement(
    payload: EvenementCreate,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.enseignant, Role.admin)),
) -> Evenement:
    if payload.classe_id is not None:
        await ensure_classe_ecriture(db, user, payload.classe_id)
    evenement = Evenement(**payload.model_dump())
    db.add(evenement)
    await db.commit()
    await db.refresh(evenement)
    return evenement
