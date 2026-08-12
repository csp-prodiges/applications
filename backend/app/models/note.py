from datetime import date

from sqlalchemy import Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    enfant_id: Mapped[int] = mapped_column(ForeignKey("enfants.id"))
    matiere: Mapped[str] = mapped_column(String(100))
    valeur: Mapped[float] = mapped_column(Float)
    bareme: Mapped[float] = mapped_column(Float, default=20)
    date: Mapped[date] = mapped_column(Date)
    commentaire: Mapped[str | None] = mapped_column(String(500), nullable=True)
    enseignant_id: Mapped[int] = mapped_column(ForeignKey("utilisateurs.id"))

    enfant: Mapped["Enfant"] = relationship(back_populates="notes")
