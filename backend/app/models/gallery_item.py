from typing import Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(String(50))  # events, gym, basket, badminton, etc.
    image_url: Mapped[str] = mapped_column(String(255))
    title: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default="")
