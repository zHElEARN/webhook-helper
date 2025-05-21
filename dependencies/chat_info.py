from fastapi import HTTPException, Query, status
from pydantic import BaseModel


class ChatInfo(BaseModel):
    chat_type: str
    chat_number: str


async def chat_info(chat_type: str = Query(...), chat_number: str = Query(...)):
    if chat_type not in ["group", "private"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid chat type. Must be 'group' or 'private'.",
        )

    if not chat_number.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat number must be a digit.",
        )

    return ChatInfo(chat_type=chat_type, chat_number=chat_number)
