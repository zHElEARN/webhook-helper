import os
import uuid
from datetime import datetime
from turtle import st
from typing import List, Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select

BASE_DIR = os.getcwd()
DATA_DIR = os.path.join(BASE_DIR, "data")
DATABASE_PATH = os.path.join(DATA_DIR, "data.db")

os.makedirs(DATA_DIR, exist_ok=True)

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"


class APIKey(SQLModel, table=True):
    __tablename__ = "api_keys"

    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(index=True, unique=True)
    created_at: datetime = Field(default_factory=datetime.now)


class WebhookLog(SQLModel, table=True):
    __tablename__ = "webhook_logs"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    webhook_type: str = Field(index=True)
    response_data: str
    created_at: datetime = Field(default_factory=datetime.now)


engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def add_key(key: str) -> bool:
    with Session(engine) as session:
        existing_key = session.exec(select(APIKey).where(APIKey.key == key)).first()
        if existing_key:
            return False

        api_key = APIKey(key=key)
        session.add(api_key)
        try:
            session.commit()
            return True
        except Exception:
            session.rollback()
            return False


def delete_key(key: str) -> bool:
    with Session(engine) as session:
        api_key = session.exec(select(APIKey).where(APIKey.key == key)).first()
        if not api_key:
            return False

        session.delete(api_key)
        session.commit()
        return True


def get_all_keys() -> List[str]:
    with Session(engine) as session:
        api_keys = session.exec(select(APIKey)).all()
        return [key.key for key in api_keys]


def key_exists(key: str) -> bool:
    with Session(engine) as session:
        api_key = session.exec(select(APIKey).where(APIKey.key == key)).first()
        return api_key is not None


def log_webhook(webhook_type: str, response_data: str) -> str:
    with Session(engine) as session:
        webhook_log = WebhookLog(
            webhook_type=webhook_type,
            response_data=response_data,
        )
        session.add(webhook_log)
        session.commit()
        session.refresh(webhook_log)
        return webhook_log.id


def get_webhook_log(log_id: str) -> Optional[WebhookLog]:
    with Session(engine) as session:
        webhook_log = session.exec(
            select(WebhookLog).where(WebhookLog.id == log_id)
        ).first()
        return webhook_log


create_db_and_tables()
