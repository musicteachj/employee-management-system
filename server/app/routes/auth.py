"""Authentication routes."""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database import get_database
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import create_user, authenticate_user
from app.utils.security import create_access_token
from app.utils.dependencies import get_current_user
from app.models.user import UserInDB
from app.config import settings

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Register a new user.
    
    - **email**: User's email address (must be unique)
    - **password**: User's password (min 8 characters)
    - **full_name**: User's full name
    - **is_admin**: Whether user should have admin privileges (default: False)
    """
    user = await create_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Login with email and password to get an access token.
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns a JWT access token that should be included in the Authorization header
    for subsequent requests as: `Authorization: Bearer <token>`
    """
    user = await authenticate_user(db, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    # Get user _id from MongoDB
    user_doc = await db.users.find_one({"email": user.email})
    user_id = str(user_doc["_id"]) if user_doc else None
    
    access_token = create_access_token(
        data={"user_id": user_id, "email": user.email},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60  # Convert to seconds
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get current authenticated user information.
    
    Requires authentication via JWT token in Authorization header.
    """
    # Get user document with _id
    user_doc = await db.users.find_one({"email": current_user.email})
    
    return UserResponse(
        _id=str(user_doc["_id"]) if user_doc else None,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_admin=current_user.is_admin,
        created_at=current_user.created_at
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Refresh an access token.
    
    Requires a valid JWT token. Returns a new token with extended expiration.
    """
    # Get user _id from MongoDB
    user_doc = await db.users.find_one({"email": current_user.email})
    user_id = str(user_doc["_id"]) if user_doc else None
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"user_id": user_id, "email": current_user.email},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60
    )
