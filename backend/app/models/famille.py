from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Famille(Base):
    __tablename__ = "familles"

    id: Mapped[int] = mapped_column(primary_key=True)
    nom_famille: Mapped[str] = mapped_column(String(150))

    membres: Mapped[list["Utilisateur"]] = relationship(back_populates="famille")
    enfants: Mapped[list["Enfant"]] = relationship(back_populates="famille")
    commandes: Mapped[list["Commande"]] = relationship(back_populates="famille")
