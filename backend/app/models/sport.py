from sqlalchemy import String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class Sport(Base):
    __tablename__ = "sports"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    schedule_json: Mapped[dict] = mapped_column(JSON)  # E.g. {"Monday to Friday": "6:00pm to 7:00pm", ...}
    image_url: Mapped[str] = mapped_column(String(255))  # video or main banner URL/Path
