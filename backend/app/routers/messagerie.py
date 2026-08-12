from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models.message import Conversation, ConversationParticipant, Message
from app.models.utilisateur import Utilisateur
from app.schemas.communication import ConversationCreate, ConversationOut, MessageCreate, MessageOut

router = APIRouter(prefix="/api/messagerie", tags=["messagerie"])


async def _ensure_participant(db: AsyncSession, user: Utilisateur, conversation_id: int) -> None:
    participant = await db.scalar(
        select(ConversationParticipant).where(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.utilisateur_id == user.id,
        )
    )
    if participant is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Vous ne participez pas à cette conversation")


@router.get("/conversations", response_model=list[ConversationOut])
async def mes_conversations(
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(get_current_user),
) -> list[Conversation]:
    result = await db.scalars(
        select(Conversation)
        .join(ConversationParticipant)
        .where(ConversationParticipant.utilisateur_id == user.id)
        .order_by(Conversation.created_at.desc())
    )
    return list(result.all())


@router.post("/conversations", response_model=ConversationOut, status_code=201)
async def creer_conversation(
    payload: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(get_current_user),
) -> Conversation:
    conversation = Conversation(sujet=payload.sujet)
    db.add(conversation)
    await db.flush()

    participant_ids = set(payload.participant_ids) | {user.id}
    for participant_id in participant_ids:
        db.add(ConversationParticipant(conversation_id=conversation.id, utilisateur_id=participant_id))

    await db.commit()
    await db.refresh(conversation)
    return conversation


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageOut])
async def messages_conversation(
    conversation_id: int,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(get_current_user),
) -> list[Message]:
    await _ensure_participant(db, user, conversation_id)
    result = await db.scalars(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    return list(result.all())


@router.post("/conversations/{conversation_id}/messages", response_model=MessageOut, status_code=201)
async def envoyer_message(
    conversation_id: int,
    payload: MessageCreate,
    db: AsyncSession = Depends(get_db),
    user: Utilisateur = Depends(get_current_user),
) -> Message:
    await _ensure_participant(db, user, conversation_id)
    message = Message(conversation_id=conversation_id, auteur_id=user.id, contenu=payload.contenu)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message
