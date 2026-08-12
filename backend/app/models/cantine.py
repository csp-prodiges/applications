import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TypeTransaction(str, enum.Enum):
    credit = "credit"
    debit = "debit"


class CantineTransaction(Base):
    __tablename__ = "cantine_transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    enfant_id: Mapped[int] = mapped_column(ForeignKey("enfants.id"))
    montant: Mapped[float] = mapped_column(Float)
    type: Mapped[TypeTransaction] = mapped_column(Enum(TypeTransaction, native_enum=False))
    description: Mapped[str | None] = mapped_column(String(300), nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    enfant: Mapped["Enfant"] = relationship(back_populates="transactions_cantine")
