from datetime import date, datetime
from typing import List, Optional
from sqlalchemy import String, Text, Date, DateTime, JSON, Integer, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base

class Admin(Base):
    __tablename__ = "admins"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))

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

class Query(Base):
    __tablename__ = "queries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    phone_number: Mapped[str] = mapped_column(String(20))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, resolved
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

class Sport(Base):
    __tablename__ = "sports"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    schedule_json: Mapped[dict] = mapped_column(JSON)  # E.g. {"Monday to Friday": "6:00pm to 7:00pm", ...}
    image_url: Mapped[str] = mapped_column(String(255))  # video or main banner URL/Path

class Coach(Base):
    __tablename__ = "coaches"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    specialty: Mapped[str] = mapped_column(String(100))
    bio: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(255))

class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(150))
    category: Mapped[str] = mapped_column(String(50))  # Gymnastics, Basketball, etc.
    description: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(255))
    year: Mapped[int] = mapped_column(Integer)

class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    parent_name: Mapped[str] = mapped_column(String(100))
    relationship: Mapped[str] = mapped_column(String(50), default="parent")
    feedback: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(255))

class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(String(50))  # events, gym, basket, badminton, etc.
    image_url: Mapped[str] = mapped_column(String(255))
    title: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default="")
