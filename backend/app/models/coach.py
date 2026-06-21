from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class Coach(Base):
    __tablename__ = "coaches"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    specialty: Mapped[str] = mapped_column(String(100))
    bio: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(255))
