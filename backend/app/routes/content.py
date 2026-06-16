from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.connection import get_db
from app.models.postgres_models import Sport, Coach, Achievement, Testimonial, GalleryItem
from app.schemas.schemas import (
    SportCreate, SportOut,
    CoachCreate, CoachOut,
    AchievementCreate, AchievementOut,
    TestimonialCreate, TestimonialOut,
    GalleryItemCreate, GalleryItemOut
)
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/content", tags=["Content Management"])

# ==========================================
# SPORTS ENDPOINTS
# ==========================================

@router.get("/sports", response_model=List[SportOut])
async def list_sports(db: AsyncSession = Depends(get_db)):
    query = select(Sport).order_by(Sport.id.asc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/sports/{slug}", response_model=SportOut)
async def get_sport_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    query = select(Sport).where(Sport.slug == slug)
    result = await db.execute(query)
    sport = result.scalars().first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")
    return sport

@router.post("/sports", response_model=SportOut, status_code=status.HTTP_201_CREATED)
async def create_sport(
    sport_data: SportCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    # Check if slug exists
    query = select(Sport).where(Sport.slug == sport_data.slug)
    result = await db.execute(query)
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Sport slug already exists")
        
    new_sport = Sport(
        name=sport_data.name,
        slug=sport_data.slug,
        description=sport_data.description,
        schedule_json=sport_data.schedule_json,
        image_url=sport_data.image_url
    )
    db.add(new_sport)
    await db.commit()
    await db.refresh(new_sport)
    return new_sport

@router.put("/sports/{sport_id}", response_model=SportOut)
async def update_sport(
    sport_id: int,
    sport_data: SportCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Sport).where(Sport.id == sport_id)
    result = await db.execute(query)
    sport = result.scalars().first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")
        
    sport.name = sport_data.name
    sport.slug = sport_data.slug
    sport.description = sport_data.description
    sport.schedule_json = sport_data.schedule_json
    sport.image_url = sport_data.image_url
    
    await db.commit()
    await db.refresh(sport)
    return sport

@router.delete("/sports/{sport_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sport(
    sport_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Sport).where(Sport.id == sport_id)
    result = await db.execute(query)
    sport = result.scalars().first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")
        
    await db.delete(sport)
    await db.commit()
    return None

# ==========================================
# COACHES ENDPOINTS
# ==========================================

@router.get("/coaches", response_model=List[CoachOut])
async def list_coaches(db: AsyncSession = Depends(get_db)):
    query = select(Coach).order_by(Coach.id.asc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/coaches", response_model=CoachOut, status_code=status.HTTP_201_CREATED)
async def create_coach(
    coach_data: CoachCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    new_coach = Coach(
        name=coach_data.name,
        specialty=coach_data.specialty,
        bio=coach_data.bio,
        image_url=coach_data.image_url
    )
    db.add(new_coach)
    await db.commit()
    await db.refresh(new_coach)
    return new_coach

@router.put("/coaches/{coach_id}", response_model=CoachOut)
async def update_coach(
    coach_id: int,
    coach_data: CoachCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Coach).where(Coach.id == coach_id)
    result = await db.execute(query)
    coach = result.scalars().first()
    if not coach:
        raise HTTPException(status_code=404, detail="Coach not found")
        
    coach.name = coach_data.name
    coach.specialty = coach_data.specialty
    coach.bio = coach_data.bio
    coach.image_url = coach_data.image_url
    
    await db.commit()
    await db.refresh(coach)
    return coach

@router.delete("/coaches/{coach_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_coach(
    coach_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Coach).where(Coach.id == coach_id)
    result = await db.execute(query)
    coach = result.scalars().first()
    if not coach:
        raise HTTPException(status_code=404, detail="Coach not found")
        
    await db.delete(coach)
    await db.commit()
    return None

# ==========================================
# ACHIEVEMENTS ENDPOINTS
# ==========================================

@router.get("/achievements", response_model=List[AchievementOut])
async def list_achievements(db: AsyncSession = Depends(get_db)):
    query = select(Achievement).order_by(Achievement.year.desc(), Achievement.id.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/achievements", response_model=AchievementOut, status_code=status.HTTP_201_CREATED)
async def create_achievement(
    ach_data: AchievementCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    new_ach = Achievement(
        title=ach_data.title,
        category=ach_data.category,
        description=ach_data.description,
        image_url=ach_data.image_url,
        year=ach_data.year
    )
    db.add(new_ach)
    await db.commit()
    await db.refresh(new_ach)
    return new_ach

@router.put("/achievements/{ach_id}", response_model=AchievementOut)
async def update_achievement(
    ach_id: int,
    ach_data: AchievementCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Achievement).where(Achievement.id == ach_id)
    result = await db.execute(query)
    ach = result.scalars().first()
    if not ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
        
    ach.title = ach_data.title
    ach.category = ach_data.category
    ach.description = ach_data.description
    ach.image_url = ach_data.image_url
    ach.year = ach_data.year
    
    await db.commit()
    await db.refresh(ach)
    return ach

@router.delete("/achievements/{ach_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_achievement(
    ach_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Achievement).where(Achievement.id == ach_id)
    result = await db.execute(query)
    ach = result.scalars().first()
    if not ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
        
    await db.delete(ach)
    await db.commit()
    return None

# ==========================================
# TESTIMONIALS ENDPOINTS
# ==========================================

@router.get("/testimonials", response_model=List[TestimonialOut])
async def list_testimonials(db: AsyncSession = Depends(get_db)):
    query = select(Testimonial).order_by(Testimonial.id.asc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/testimonials", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    test_data: TestimonialCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    new_test = Testimonial(
        parent_name=test_data.parent_name,
        relationship=test_data.relationship,
        feedback=test_data.feedback,
        image_url=test_data.image_url
    )
    db.add(new_test)
    await db.commit()
    await db.refresh(new_test)
    return new_test

@router.put("/testimonials/{test_id}", response_model=TestimonialOut)
async def update_testimonial(
    test_id: int,
    test_data: TestimonialCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Testimonial).where(Testimonial.id == test_id)
    result = await db.execute(query)
    test = result.scalars().first()
    if not test:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    test.parent_name = test_data.parent_name
    test.relationship = test_data.relationship
    test.feedback = test_data.feedback
    test.image_url = test_data.image_url
    
    await db.commit()
    await db.refresh(test)
    return test

@router.delete("/testimonials/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(
    test_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(Testimonial).where(Testimonial.id == test_id)
    result = await db.execute(query)
    test = result.scalars().first()
    if not test:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    await db.delete(test)
    await db.commit()
    return None

# ==========================================
# GALLERY ENDPOINTS
# ==========================================

@router.get("/gallery", response_model=List[GalleryItemOut])
async def list_gallery(db: AsyncSession = Depends(get_db)):
    query = select(GalleryItem).order_by(GalleryItem.id.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/gallery", response_model=GalleryItemOut, status_code=status.HTTP_201_CREATED)
async def create_gallery_item(
    gal_data: GalleryItemCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    new_gal = GalleryItem(
        category=gal_data.category,
        image_url=gal_data.image_url,
        title=gal_data.title
    )
    db.add(new_gal)
    await db.commit()
    await db.refresh(new_gal)
    return new_gal

@router.delete("/gallery/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    query = select(GalleryItem).where(GalleryItem.id == item_id)
    result = await db.execute(query)
    gal = result.scalars().first()
    if not gal:
        raise HTTPException(status_code=404, detail="Gallery item not found")
        
    await db.delete(gal)
    await db.commit()
    return None
