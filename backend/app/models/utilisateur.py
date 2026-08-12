import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Role(str, enum.Enum):
    parent = "parent"
    enseignant = "enseignant"
    admin = "admin"


class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role, native_enum=False))
    nom: Mapped[str] = mapped_column(String(100))
    prenom: Mapped[str] = mapped_column(String(100))
    telephone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    actif: Mapped[bool] = mapped_column(Boolean, default=True)
    famille_id: Mapped[int | None] = mapped_column(
        ForeignKey("familles.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    famille: Mapped["Famille | None"] = relationship(back_populates="membres")
    classes_enseignees: Mapped[list["Classe"]] = relationship(back_populates="enseignant_principal")
