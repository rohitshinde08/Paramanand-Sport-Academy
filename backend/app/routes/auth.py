from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.connection import get_db
from app.models.postgres_models import Admin
from app.schemas.schemas import AdminLogin, Token, AdminOut
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    query = select(Admin).where(Admin.username == form_data.username)
    result = await db.execute(query)
    admin = result.scalars().first()
    
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AdminOut)
async def get_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin

# Route to set up initial admin user if none exists
@router.post("/setup", response_model=AdminOut)
async def setup_admin(admin_data: AdminLogin, db: AsyncSession = Depends(get_db)):
    # Check if any admin exists
    query = select(Admin)
    result = await db.execute(query)
    existing_admin = result.scalars().first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin setup has already been completed."
        )
    
    hashed_pwd = get_password_hash(admin_data.password)
    new_admin = Admin(username=admin_data.username, hashed_password=hashed_pwd)
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)
    return new_admin
