from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    parent_name: Mapped[str] = mapped_column(String(100))
    relationship: Mapped[str] = mapped_column(String(50), default="parent")
    feedback: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(255))
