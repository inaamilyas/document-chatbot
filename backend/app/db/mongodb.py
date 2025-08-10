from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


class MongoDB:
    from typing import Optional

    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        cls.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            maxPoolSize=settings.MONGODB_MAX_CONNECTIONS,
            connectTimeoutMS=settings.MONGODB_TIMEOUT_MS,
        )
        cls.db = cls.client[settings.MONGODB_DB_NAME]
        print("Connected to MongoDB")

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()
            print("Disconnected from MongoDB")

    @classmethod
    def get_db(cls):
        if cls.db is None:
            raise RuntimeError("Database not connected")
        return cls.db
