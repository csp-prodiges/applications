from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.classe import Classe
from app.models.enfant import Enfant
from app.models.utilisateur import Role, Utilisateur


async def get_enfant_or_404(db: AsyncSession, enfant_id: int) -> Enfant:
    enfant = await db.get(Enfant, enfant_id)
    if enfant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Enfant introuvable")
    return enfant


async def ensure_enfant_lecture(db: AsyncSession, user: Utilisateur, enfant: Enfant) -> None:
    if user.role == Role.admin:
        return
    if user.role == Role.parent and enfant.famille_id == user.famille_id:
        return
    if user.role == Role.enseignant and enfant.classe_id is not None:
        classe = await db.get(Classe, enfant.classe_id)
        if classe is not None and classe.enseignant_principal_id == user.id:
            return
    raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès non autorisé à cet enfant")


async def ensure_classe_ecriture(db: AsyncSession, user: Utilisateur, classe_id: int) -> Classe:
    classe = await db.get(Classe, classe_id)
    if classe is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Classe introuvable")
    if user.role == Role.admin:
        return classe
    if user.role == Role.enseignant and classe.enseignant_principal_id == user.id:
        return classe
    raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès non autorisé à cette classe")
