from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.actualite import Actualite
from app.models.admission import Admission
from app.schemas.admission import AdmissionCreate, AdmissionOut, ContactRequest
from app.schemas.communication import ActualiteOut

router = APIRouter(prefix="/api/public", tags=["public"])


@router.get("/actualites", response_model=list[ActualiteOut])
async def liste_actualites_publiques(db: AsyncSession = Depends(get_db)) -> list[Actualite]:
    result = await db.scalars(
        select(Actualite).where(Actualite.public.is_(True)).order_by(Actualite.created_at.desc())
    )
    return list(result.all())


@router.post("/admissions", response_model=AdmissionOut, status_code=201)
async def deposer_admission(
    payload: AdmissionCreate, db: AsyncSession = Depends(get_db)
) -> Admission:
    admission = Admission(**payload.model_dump())
    db.add(admission)
    await db.commit()
    await db.refresh(admission)
    return admission


@router.post("/contact", status_code=202)
async def contact(payload: ContactRequest) -> dict:
    return {"detail": "Votre message a bien été transmis à l'équipe de la Cité Scolaire Prodiges."}
