from datetime import date, datetime
from typing import List
from sqlalchemy import String, Date, DateTime, JSON, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class Registration(Base):
    __tablename__ = "registrations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    phone_number: Mapped[str] = mapped_column(String(20))
    birth_date: Mapped[date] = mapped_column(Date)
    sports: Mapped[List[str]] = mapped_column(JSON)  # List of selected sports e.g., ["Gymnastics"]
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, approved, rejected
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
