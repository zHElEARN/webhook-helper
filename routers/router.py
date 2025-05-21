import json

from fastapi import APIRouter, HTTPException, status

import routers.custom.router as custom_router
import routers.github.router as github_router
import routers.uptime_kuma.router as uptime_kuma_router
from dependencies.db import get_webhook_log

webhook_router = APIRouter(prefix="/webhook")

webhook_router.include_router(custom_router.router)
webhook_router.include_router(github_router.router)
webhook_router.include_router(uptime_kuma_router.router)


logs_router = APIRouter(prefix="/logs")


@logs_router.get("/{id}")
async def get_log(id: str):
    webhook_log = get_webhook_log(id)
    if not webhook_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook log not found",
        )
    webhook_log_dict = webhook_log.model_dump()
    webhook_log_dict["response_data"] = json.loads(webhook_log.response_data)
    return webhook_log_dict
