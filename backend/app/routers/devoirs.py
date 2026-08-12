from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.devoir import Devoir
from app.models.utilisateur import Role, Utilisateur
from app.permissions import ensure_classe_ecriture, ensure_enfant_lecture, get_enfant_or_404
from app.schemas.academique import DevoirCreate, DevoirOut

router = APIRouter(prefix="/api/devoirs", tags=["devoirs"])


@router.get("/classe/{classe_id}", response_model=list[DevoirOut])
async def devoirs_classe(
    classe_id: int,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.parent, Role.enseignant, Role.admin)),
) -> list[Devoir]:
    result = await db.scalars(
        select(Devoir).where(Devoir.classe_id == classe_id).order_by(Devoir.date_limite)
    )
    return list(result.all())


@router.get("/enfant/{enfant_id}", response_model=list[DevoirOut])
async def devoirs_enfant(
    enfant_id: int,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.parent, Role.enseignant, Role.admin)),
) -> list[Devoir]:
    enfant = await get_enfant_or_404(db, enfant_id)
    await ensure_enfant_lecture(db, user, enfant)
    if enfant.classe_id is None:
        return []
    result = await db.scalars(
        select(Devoir).where(Devoir.classe_id == enfant.classe_id).order_by(Devoir.date_limite)
    )
    return list(result.all())


@router.post("", response_model=DevoirOut, status_code=201)
async def creer_devoir(
    payload: DevoirCreate,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.enseignant, Role.admin)),
) -> Devoir:
    await ensure_classe_ecriture(db, user, payload.classe_id)
    devoir = Devoir(**payload.model_dump(), enseignant_id=user.id)
    db.add(devoir)
    await db.commit()
    await db.refresh(devoir)
    return devoir
