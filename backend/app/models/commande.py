import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TypeCommande(str, enum.Enum):
    uniforme = "uniforme"
    livre = "livre"
    cantine_recharge = "cantine_recharge"


class StatutCommande(str, enum.Enum):
    en_attente = "en_attente"
    validee = "validee"
    livree = "livree"


class Commande(Base):
    __tablename__ = "commandes"

    id: Mapped[int] = mapped_column(primary_key=True)
    famille_id: Mapped[int] = mapped_column(ForeignKey("familles.id"))
    type: Mapped[TypeCommande] = mapped_column(Enum(TypeCommande, native_enum=False))
    details: Mapped[dict] = mapped_column(JSON, default=dict)
    montant: Mapped[float] = mapped_column(Float)
    statut: Mapped[StatutCommande] = mapped_column(
        Enum(StatutCommande, native_enum=False), default=StatutCommande.en_attente
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    famille: Mapped["Famille"] = relationship(back_populates="commandes")
