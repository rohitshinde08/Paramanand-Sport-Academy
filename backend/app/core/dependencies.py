from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.connection import get_db
from app.models import Admin
from app.core.security import decode_access_token

# Define OAuth2 bearer scheme pointing to login route
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
        
    query = select(Admin).where(Admin.username == username)
    result = await db.execute(query)
    admin = result.scalars().first()
    if admin is None:
        raise credentials_exception
        
    return admin
