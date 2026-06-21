from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(150))
    category: Mapped[str] = mapped_column(String(50))  # Gymnastics, Basketball, etc.
    description: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(255))
    year: Mapped[int] = mapped_column(Integer)
