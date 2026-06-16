from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.connection import get_db
from app.models.postgres_models import Registration
from app.schemas.schemas import RegistrationCreate, RegistrationUpdateStatus, RegistrationOut
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/registrations", tags=["Registrations"])

@router.post("/", response_model=RegistrationOut, status_code=status.HTTP_201_CREATED)
async def create_registration(
    reg_data: RegistrationCreate,
    db: AsyncSession = Depends(get_db)
):
    new_reg = Registration(
        full_name=reg_data.full_name,
        email=reg_data.email,
        phone_number=reg_data.phone_number,
        birth_date=reg_data.birth_date,
        sports=reg_data.sports,
        status="pending"
    )
    db.add(new_reg)
    await db.commit()
    await db.refresh(new_reg)
    return new_reg

@router.get("/", response_model=List[RegistrationOut])
async def list_registrations(
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Registration).order_by(Registration.created_at.desc())
    result = await db.execute(query)
    registrations = result.scalars().all()
    return registrations

@router.put("/{reg_id}", response_model=RegistrationOut)
async def update_registration_status(
    reg_id: int,
    status_data: RegistrationUpdateStatus,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Registration).where(Registration.id == reg_id)
    result = await db.execute(query)
    registration = result.scalars().first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
        
    registration.status = status_data.status
    await db.commit()
    await db.refresh(registration)
    return registration

@router.delete("/{reg_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_registration(
    reg_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Registration).where(Registration.id == reg_id)
    result = await db.execute(query)
    registration = result.scalars().first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
        
    await db.delete(registration)
    await db.commit()
    return None
