from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from dependencies.db import WEBHOOK_ENDPOINT, log_webhook
from dependencies.verify_chat_info import ChatInfo, verify_chat_info
from dependencies.verify_key import verify_key
from utils.onebot import SendMessageResponse, send_message

router = APIRouter(prefix="/uptime-kuma")


class Heartbeat(BaseModel):
    monitorID: int
    status: int
    time: str
    msg: str
    important: bool
    duration: int
    timezone: str
    timezoneOffset: str
    localDateTime: str


class Monitor(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    pathName: str
    parent: Optional[Any] = None
    childrenIDs: List[Any] = []
    url: str
    method: str
    hostname: str
    port: Optional[int] = None
    maxretries: int
    weight: int
    active: bool
    forceInactive: bool
    type: str
    timeout: int
    interval: int
    retryInterval: int
    resendInterval: int
    keyword: Optional[str] = None
    invertKeyword: bool
    expiryNotification: bool
    ignoreTls: bool
    upsideDown: bool
    packetSize: int
    maxredirects: int
    accepted_statuscodes: List[str]
    dns_resolve_type: str
    dns_resolve_server: str
    dns_last_result: Optional[str] = None
    docker_container: str
    docker_host: Optional[str] = None
    proxyId: Optional[int] = None
    notificationIDList: Dict[str, bool]
    tags: List[Any] = []
    maintenance: bool
    mqttTopic: str
    mqttSuccessMessage: str
    databaseQuery: Optional[str] = None
    authMethod: Optional[str] = None
    grpcUrl: Optional[str] = None
    grpcProtobuf: Optional[str] = None
    grpcMethod: Optional[str] = None
    grpcServiceName: Optional[str] = None
    grpcEnableTls: bool
    radiusCalledStationId: Optional[str] = None
    radiusCallingStationId: Optional[str] = None
    game: Optional[str] = None
    gamedigGivenPortOnly: bool
    httpBodyEncoding: Optional[str] = None
    jsonPath: Optional[str] = None
    expectedValue: Optional[str] = None
    kafkaProducerTopic: Optional[str] = None
    kafkaProducerBrokers: List[Any] = []
    kafkaProducerSsl: bool
    kafkaProducerAllowAutoTopicCreation: bool
    kafkaProducerMessage: Optional[str] = None
    screenshot: Optional[str] = None
    includeSensitiveData: bool


class UptimeKumaWebhook(BaseModel):
    heartbeat: Heartbeat
    monitor: Monitor
    msg: str


@router.post(
    "/{key}", dependencies=[Depends(verify_key)], response_model=SendMessageResponse
)
async def uptime_kuma_webhook(
    data: UptimeKumaWebhook, chat_info: ChatInfo = Depends(verify_chat_info)
):
    log_id = log_webhook("uptime-kuma", data.model_dump_json())

    message = f"""Uptime Kuma Webhook
详细: {WEBHOOK_ENDPOINT}/static/?{log_id}

Monitor: {data.monitor.name}
Message: {data.msg}"""

    return await send_message(chat_info, message.strip())
