from typing import Optional
from app.db.mongodb import MongoDB
from app.models.user import UserInDB, UserCreate
from app.core.security import get_password_hash
from datetime import datetime


class UserService:
    @staticmethod
    async def get_collection():
        print("Getting user collection")
        return MongoDB.get_db().users

    @staticmethod
    async def get_user(email: str) -> Optional[UserInDB]:
        collection = await UserService.get_collection()
        user = await collection.find_one({"email": email})
        return UserInDB(**user) if user else None

    @staticmethod
    async def create_user(user: UserCreate) -> Optional[UserInDB]:
        print("Creating user:", user)
        collection = await UserService.get_collection()
        print("collection:", collection)
        print("Checking if user already exists:", user.email)

        if await UserService.get_user(user.email):
            raise ValueError("Email already registered")

        hashed_password = get_password_hash(user.password)
        user_dict = user.dict(exclude={"password"})
        user_dict.update(
            {
                "hashed_password": hashed_password,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "disabled": False,
            }
        )

        result = await collection.insert_one(user_dict)
        return await UserService.get_user(user.email)
