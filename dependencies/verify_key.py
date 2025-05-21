from fastapi import HTTPException, status

from dependencies.db import key_exists


async def verify_key(key: str) -> None:
    if not key_exists(key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )
    return None
