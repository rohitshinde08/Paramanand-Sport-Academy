import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/uploads", tags=["File Uploads"])

UPLOAD_DIR = "./uploads"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin)
):
    # Validate file content types
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file.content_type} not supported. Allowed types: JPEG, PNG, GIF, WEBP, MP4, WEBM"
        )

    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            # Read and write chunks
            while content := await file.read(1024 * 1024):  # 1MB chunks
                buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )

    # Return relative path for client consumption
    relative_url = f"/uploads/{unique_filename}"
    return {"url": relative_url, "filename": file.filename}
