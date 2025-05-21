import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

load_dotenv()

from routers import router


def create_app() -> FastAPI:
    app = FastAPI()

    app.mount("/static", StaticFiles(directory="./static", html=True), name="static")

    app.include_router(router.webhook_router)
    app.include_router(router.logs_router)

    return app


app = create_app()

if __name__ == "__main__":
    if os.environ.get("ENV") == "prod":
        uvicorn.run("main:app", host="0.0.0.0", port=3004)
    elif os.environ.get("ENV") == "dev":
        uvicorn.run("main:app", host="0.0.0.0", port=3004, reload=True)
    else:
        print("Please set the ENV variable to 'prod' or 'dev'.")
        exit(1)
