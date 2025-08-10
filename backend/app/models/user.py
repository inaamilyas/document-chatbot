from pydantic import BaseModel, EmailStr, Field, ConfigDict
from bson import ObjectId
from enum import Enum
from typing import Optional

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str = Field(min_length=6)
    role: UserRole = UserRole.USER
    
    
class UserInDB(UserBase):
    id: ObjectId = Field(alias="_id")
    hashed_password: str
    role: UserRole
    disabled: bool = False

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    role: Optional[str] = None