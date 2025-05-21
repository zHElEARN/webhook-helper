from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from dependencies.chat_info import ChatInfo, chat_info
from dependencies.verify_key import verify_key

router = APIRouter(prefix="/custom")


class CustomMessage(BaseModel):
    message: str = Field(..., min_length=1)


@router.post("/{key}", dependencies=[Depends(verify_key)])
async def custom_webhook(data: CustomMessage, chat_info: ChatInfo = Depends(chat_info)):
    pass
