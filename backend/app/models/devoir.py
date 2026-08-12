from datetime import date

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Devoir(Base):
    __tablename__ = "devoirs"

    id: Mapped[int] = mapped_column(primary_key=True)
    classe_id: Mapped[int] = mapped_column(ForeignKey("classes.id"))
    matiere: Mapped[str] = mapped_column(String(100))
    titre: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    date_limite: Mapped[date] = mapped_column(Date)
    enseignant_id: Mapped[int] = mapped_column(ForeignKey("utilisateurs.id"))

    classe: Mapped["Classe"] = relationship(back_populates="devoirs")
