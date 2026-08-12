from pydantic import BaseModel, EmailStr

from app.models.utilisateur import Role


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UtilisateurOut(BaseModel):
    id: int
    email: str
    role: Role
    nom: str
    prenom: str
    telephone: str | None = None
    famille_id: int | None = None

    class Config:
        from_attributes = True
