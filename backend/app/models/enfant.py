from datetime import date

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Enfant(Base):
    __tablename__ = "enfants"

    id: Mapped[int] = mapped_column(primary_key=True)
    famille_id: Mapped[int] = mapped_column(ForeignKey("familles.id"))
    prenom: Mapped[str] = mapped_column(String(100))
    nom: Mapped[str] = mapped_column(String(100))
    date_naissance: Mapped[date] = mapped_column(Date)
    classe_id: Mapped[int | None] = mapped_column(ForeignKey("classes.id"), nullable=True)

    famille: Mapped["Famille"] = relationship(back_populates="enfants")
    classe: Mapped["Classe | None"] = relationship(back_populates="enfants")
    notes: Mapped[list["Note"]] = relationship(back_populates="enfant")
    transactions_cantine: Mapped[list["CantineTransaction"]] = relationship(back_populates="enfant")
