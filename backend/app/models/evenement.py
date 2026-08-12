import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TypeEvenement(str, enum.Enum):
    reunion = "reunion"
    sortie = "sortie"
    vacances = "vacances"
    examen = "examen"
    autre = "autre"


class Evenement(Base):
    __tablename__ = "evenements"

    id: Mapped[int] = mapped_column(primary_key=True)
    titre: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    date_debut: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    date_fin: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    type: Mapped[TypeEvenement] = mapped_column(Enum(TypeEvenement, native_enum=False))
    classe_id: Mapped[int | None] = mapped_column(ForeignKey("classes.id"), nullable=True)

    classe: Mapped["Classe | None"] = relationship()
