from typing import List, Optional
from fastapi import APIRouter
from services.icon_finder_service import ICON_FINDER_SERVICE

ICONS_ROUTER = APIRouter(prefix="/icons", tags=["Icons"])


@ICONS_ROUTER.get("/search", response_model=List[str])
async def search_icons(
    query: str,
    limit: int = 20,
    style: Optional[str] = None,
    icon_set: Optional[str] = None,
):
    return await ICON_FINDER_SERVICE.search_icons(query, limit, style=style, icon_set=icon_set)
