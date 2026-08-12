from datetime import datetime

from pydantic import BaseModel


class ActualiteCreate(BaseModel):
    titre: str
    contenu: str
    image_url: str | None = None
    public: bool = False


class ActualiteOut(ActualiteCreate):
    id: int
    auteur_id: int | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    contenu: str


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    auteur_id: int
    contenu: str
    created_at: datetime
    lu: bool

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    sujet: str
    participant_ids: list[int]


class ConversationOut(BaseModel):
    id: int
    sujet: str
    created_at: datetime

    class Config:
        from_attributes = True


class RessourceCreate(BaseModel):
    titre: str
    description: str | None = None
    lien: str | None = None
    categorie: str


class RessourceOut(RessourceCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
