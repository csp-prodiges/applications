from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Classe(Base):
    __tablename__ = "classes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nom: Mapped[str] = mapped_column(String(50))
    niveau: Mapped[str] = mapped_column(String(50))
    enseignant_principal_id: Mapped[int | None] = mapped_column(
        ForeignKey("utilisateurs.id"), nullable=True
    )

    enseignant_principal: Mapped["Utilisateur | None"] = relationship(
        back_populates="classes_enseignees"
    )
    enfants: Mapped[list["Enfant"]] = relationship(back_populates="classe")
    devoirs: Mapped[list["Devoir"]] = relationship(back_populates="classe")
