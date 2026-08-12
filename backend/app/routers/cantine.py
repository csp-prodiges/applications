from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.cantine import CantineTransaction, TypeTransaction
from app.models.utilisateur import Role, Utilisateur
from app.permissions import ensure_enfant_lecture, get_enfant_or_404
from app.schemas.vie_scolaire import CantineSoldeOut, CantineTransactionCreate, CantineTransactionOut

router = APIRouter(prefix="/api/cantine", tags=["cantine"])


@router.get("/enfant/{enfant_id}", response_model=CantineSoldeOut)
async def solde_cantine(
    enfant_id: int,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.parent, Role.admin)),
) -> CantineSoldeOut:
    enfant = await get_enfant_or_404(db, enfant_id)
    await ensure_enfant_lecture(db, user, enfant)
    result = await db.scalars(
        select(CantineTransaction)
        .where(CantineTransaction.enfant_id == enfant_id)
        .order_by(CantineTransaction.date.desc())
    )
    transactions = list(result.all())
    solde = sum(
        t.montant if t.type == TypeTransaction.credit else -t.montant for t in transactions
    )
    return CantineSoldeOut(enfant_id=enfant_id, solde=solde, transactions=transactions)


@router.post("/transactions", response_model=CantineTransactionOut, status_code=201)
async def creer_transaction(
    payload: CantineTransactionCreate,
    db: AsyncSession = Depends(get_db),
    _: Utilisateur = Depends(require_role(Role.admin)),
) -> CantineTransaction:
    await get_enfant_or_404(db, payload.enfant_id)
    transaction = CantineTransaction(**payload.model_dump())
    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)
    return transaction
