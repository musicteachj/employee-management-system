"""User models for authentication."""
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class User(BaseModel):
    """User model for authentication."""

    email: EmailStr
    hashed_password: str
    full_name: str
    is_active: bool = True
    is_admin: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@company.com",
                "full_name": "John Doe",
                "is_active": True,
                "is_admin": False,
            }
        }


class UserInDB(User):
    """User model as stored in database."""

    pass


class UserCreate(BaseModel):
    """Schema for creating a new user."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)
    is_admin: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@company.com",
                "password": "securepassword123",
                "full_name": "John Doe",
                "is_admin": False,
            }
        }


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@company.com",
                "password": "securepassword123",
            }
        }


class UserResponse(BaseModel):
    """Public user response (no password)."""

    _id: Optional[str] = None
    email: EmailStr
    full_name: str
    is_active: bool
    is_admin: bool
    created_at: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "email": "user@company.com",
                "full_name": "John Doe",
                "is_active": True,
                "is_admin": False,
            }
        }


class Token(BaseModel):
    """Token response model."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class TokenData(BaseModel):
    """Data encoded in JWT token."""

    email: Optional[str] = None
    user_id: Optional[str] = None
