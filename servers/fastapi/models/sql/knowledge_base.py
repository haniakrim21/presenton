from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel

from utils.datetime_utils import get_current_utc_datetime


class KBFolder(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    parent_id: Optional[uuid.UUID] = Field(default=None, foreign_key="kbfolder.id")
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), nullable=False, default=get_current_utc_datetime
        ),
    )


class KBDocument(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    file_path: str
    folder_id: Optional[uuid.UUID] = Field(default=None, foreign_key="kbfolder.id")
    size: int
    file_type: str
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), nullable=False, default=get_current_utc_datetime
        ),
    )
