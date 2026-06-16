from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# Auth schemas
class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

# Registration schemas
class RegistrationCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(..., min_length=8, max_length=20)
    birth_date: date
    sports: List[str]

class RegistrationUpdateStatus(BaseModel):
    status: str = Field(..., description="Must be pending, approved, or rejected")

class RegistrationOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: str
    birth_date: date
    sports: List[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Query schemas
class QueryCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(..., min_length=8, max_length=20)
    message: str = Field(..., min_length=5)

class QueryUpdateStatus(BaseModel):
    status: str = Field(..., description="Must be pending or resolved")

class QueryOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: str
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Sport schemas
class SportCreate(BaseModel):
    name: str
    slug: str
    description: str
    schedule_json: dict
    image_url: str

class SportOut(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    schedule_json: dict
    image_url: str

    class Config:
        from_attributes = True

# Coach schemas
class CoachCreate(BaseModel):
    name: str
    specialty: str
    bio: str
    image_url: str

class CoachOut(BaseModel):
    id: int
    name: str
    specialty: str
    bio: str
    image_url: str

    class Config:
        from_attributes = True

# Achievement schemas
class AchievementCreate(BaseModel):
    title: str
    category: str
    description: str
    image_url: str
    year: int

class AchievementOut(BaseModel):
    id: int
    title: str
    category: str
    description: str
    image_url: str
    year: int

    class Config:
        from_attributes = True

# Testimonial schemas
class TestimonialCreate(BaseModel):
    parent_name: str
    relationship: str
    feedback: str
    image_url: str

class TestimonialOut(BaseModel):
    id: int
    parent_name: str
    relationship: str
    feedback: str
    image_url: str

    class Config:
        from_attributes = True

# GalleryItem schemas
class GalleryItemCreate(BaseModel):
    category: str
    image_url: str
    title: Optional[str] = ""

class GalleryItemOut(BaseModel):
    id: int
    category: str
    image_url: str
    title: Optional[str]

    class Config:
        from_attributes = True
