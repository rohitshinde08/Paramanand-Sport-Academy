from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.connection import get_db
from app.models import Query
from app.schemas.schemas import QueryCreate, QueryUpdateStatus, QueryOut
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/queries", tags=["Contact Queries"])

@router.post("/", response_model=QueryOut, status_code=status.HTTP_201_CREATED)
async def create_query(
    query_data: QueryCreate,
    db: AsyncSession = Depends(get_db)
):
    new_query = Query(
        full_name=query_data.full_name,
        email=query_data.email,
        phone_number=query_data.phone_number,
        message=query_data.message,
        status="pending"
    )
    db.add(new_query)
    await db.commit()
    await db.refresh(new_query)
    return new_query

@router.get("/", response_model=List[QueryOut])
async def list_queries(
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Query).order_by(Query.created_at.desc())
    result = await db.execute(query)
    queries = result.scalars().all()
    return queries

@router.put("/{query_id}", response_model=QueryOut)
async def update_query_status(
    query_id: int,
    status_data: QueryUpdateStatus,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Query).where(Query.id == query_id)
    result = await db.execute(query)
    contact_query = result.scalars().first()
    
    if not contact_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
        
    contact_query.status = status_data.status
    await db.commit()
    await db.refresh(contact_query)
    return contact_query

@router.delete("/{query_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_query(
    query_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Query).where(Query.id == query_id)
    result = await db.execute(query)
    contact_query = result.scalars().first()
    
    if not contact_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
        
    await db.delete(contact_query)
    await db.commit()
    return None
