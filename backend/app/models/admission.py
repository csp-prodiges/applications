import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class StatutAdmission(str, enum.Enum):
    nouvelle = "nouvelle"
    contactee = "contactee"
    inscrite = "inscrite"
    refusee = "refusee"


class Admission(Base):
    __tablename__ = "admissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    nom_enfant: Mapped[str] = mapped_column(String(100))
    prenom_enfant: Mapped[str] = mapped_column(String(100))
    date_naissance: Mapped[date] = mapped_column(Date)
    niveau_souhaite: Mapped[str] = mapped_column(String(50))
    nom_parent: Mapped[str] = mapped_column(String(150))
    email_parent: Mapped[str] = mapped_column(String(255))
    telephone_parent: Mapped[str] = mapped_column(String(30))
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    statut: Mapped[StatutAdmission] = mapped_column(
        Enum(StatutAdmission, native_enum=False), default=StatutAdmission.nouvelle
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
