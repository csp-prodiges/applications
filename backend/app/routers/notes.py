from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_role
from app.models.note import Note
from app.models.utilisateur import Role, Utilisateur
from app.permissions import ensure_enfant_lecture, get_enfant_or_404
from app.schemas.academique import NoteCreate, NoteOut

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.get("/enfant/{enfant_id}", response_model=list[NoteOut])
async def notes_enfant(
    enfant_id: int,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.parent, Role.enseignant, Role.admin)),
) -> list[Note]:
    enfant = await get_enfant_or_404(db, enfant_id)
    await ensure_enfant_lecture(db, user, enfant)
    result = await db.scalars(
        select(Note).where(Note.enfant_id == enfant_id).order_by(Note.date.desc())
    )
    return list(result.all())


@router.post("", response_model=NoteOut, status_code=201)
async def creer_note(
    payload: NoteCreate,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(require_role(Role.enseignant, Role.admin)),
) -> Note:
    enfant = await get_enfant_or_404(db, payload.enfant_id)
    await ensure_enfant_lecture(db, user, enfant)
    note = Note(**payload.model_dump(), enseignant_id=user.id)
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note
