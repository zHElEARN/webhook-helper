from fastapi import APIRouter

import routers.custom.router as custom_router
import routers.github.router as github_router
import routers.uptime_kuma.router as uptime_kuma_router

router = APIRouter(prefix="/webhook")

router.include_router(custom_router.router)
router.include_router(github_router.router)
router.include_router(uptime_kuma_router.router)
