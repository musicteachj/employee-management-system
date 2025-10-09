"""Authentication service for user management."""
from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.user import User, UserCreate, UserInDB, UserResponse
from app.utils.security import get_password_hash, verify_password


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> Optional[UserInDB]:
    """Get a user by email."""
    user_dict = await db.users.find_one({"email": email})
    if user_dict:
        return UserInDB(**user_dict)
    return None


async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> Optional[UserInDB]:
    """Get a user by ID."""
    from bson import ObjectId
    
    try:
        user_dict = await db.users.find_one({"_id": ObjectId(user_id)})
        if user_dict:
            user_dict["_id"] = str(user_dict["_id"])
            return UserInDB(**user_dict)
    except Exception:
        pass
    
    return None


async def create_user(db: AsyncIOMotorDatabase, user_data: UserCreate) -> UserResponse:
    """Create a new user."""
    # Check if user already exists
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_dict = {
        "email": user_data.email,
        "hashed_password": get_password_hash(user_data.password),
        "full_name": user_data.full_name,
        "is_active": True,
        "is_admin": user_data.is_admin,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    # Insert into database
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    return UserResponse(**user_dict)


async def authenticate_user(
    db: AsyncIOMotorDatabase, email: str, password: str
) -> Optional[UserInDB]:
    """Authenticate a user by email and password."""
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user
