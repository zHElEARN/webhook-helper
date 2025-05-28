import os

import aiohttp
from pydantic import BaseModel

from dependencies.verify_chat_info import ChatInfo

ONEBOT_API_URL = os.environ.get("ONEBOT_API_URL")
if not ONEBOT_API_URL:
    raise ValueError("ONEBOT_API_URL environment variable is not set.")

ONEBOT_ACCESS_TOKEN = os.environ.get("ONEBOT_ACCESS_TOKEN")


class SendMessageResponse(BaseModel):
    status: str
    retcode: int
    message: str


async def send_message(chat_info: ChatInfo, message: str):
    if chat_info.chat_type == "group":
        endpoint = "/send_group_msg"
        payload = {
            "group_id": chat_info.chat_number,
            "message": [{"type": "text", "data": {"text": message}}],
        }
    elif chat_info.chat_type == "private":
        endpoint = "/send_private_msg"
        payload = {
            "user_id": chat_info.chat_number,
            "message": [{"type": "text", "data": {"text": message}}],
        }
    else:
        raise ValueError("Invalid chat type. Must be 'group' or 'private'.")

    async with aiohttp.ClientSession() as session:
        headers = {"Content-Type": "application/json"}
        if ONEBOT_ACCESS_TOKEN:
            headers["Authorization"] = f"Bearer {ONEBOT_ACCESS_TOKEN}"

        async with session.post(
            f"{ONEBOT_API_URL}{endpoint}",
            json=payload,
            headers=headers,
        ) as response:
            if response.status != 200:
                return SendMessageResponse(
                    status="error",
                    retcode=response.status,
                    message="Failed to send message",
                )
            else:
                response_data = await response.json()
                return SendMessageResponse(
                    status=response_data.get("status"),
                    retcode=response_data.get("retcode"),
                    message=response_data.get("message"),
                )
