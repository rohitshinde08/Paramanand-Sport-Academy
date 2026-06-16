import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.connection import engine, Base
from app.routes import auth, registrations, queries, content, stats, uploads

# Ensure the upload directory exists
os.makedirs("./uploads", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions: automatically build database tables in PostgreSQL
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Auto-seed initial data
    from app.core.seed import seed_data
    try:
        await seed_data()
    except Exception as e:
        print(f"Lifespan seeding error: {e}")
    yield
    # Shutdown actions (if any)

app = FastAPI(
    title="Parmanand Sports Academy API",
    description="Backend API for managing registrations, contact queries, and dynamic content",
    version="1.0.0",
    lifespan=lifespan
)

# Set up CORS middleware to allow connection from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the local uploads folder statically at "/uploads"
app.mount("/uploads", StaticFiles(directory="./uploads"), name="uploads")

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(registrations.router, prefix="/api")
app.include_router(queries.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(uploads.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Parmanand Sports Academy API"}
