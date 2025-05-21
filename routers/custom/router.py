from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from dependencies.db import log_webhook
from dependencies.verify_chat_info import ChatInfo, verify_chat_info
from dependencies.verify_key import verify_key
from utils.onebot import SendMessageResponse, send_message

router = APIRouter(prefix="/custom")


class CustomMessage(BaseModel):
    message: str = Field(..., min_length=1)


@router.post(
    "/{key}", dependencies=[Depends(verify_key)], response_model=SendMessageResponse
)
async def custom_webhook(
    data: CustomMessage, chat_info: ChatInfo = Depends(verify_chat_info)
):
    log_id = log_webhook("custom", data.model_dump_json())

    message = f"""Custom Webhook
Log ID: {log_id}
{data.message}"""

    return await send_message(chat_info, data.message.strip())
