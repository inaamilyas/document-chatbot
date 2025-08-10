from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    # Project Metadata
    PROJECT_NAME: str = "Document Chat API"
    PROJECT_DESCRIPTION: str = "Backend API for document processing and chat"
    VERSION: str = "0.1.0"

    # API Documentation URLs
    API_DOCS_URL: str = "/docs"
    OPENAPI_URL: str = "/openapi.json"
    REDOC_URL: str = "/redoc"

    # Add API versioning
    API_V1_STR: str = "/api/v1"

    # CORS Origins - comma separated list
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # MongoDB Configuration
    MONGODB_URL: str = Field(..., description="MongoDB connection URL")
    MONGODB_DB_NAME: str = Field(
        default="document_chat", description="MongoDB database name"
    )
    MONGODB_MAX_CONNECTIONS: int = Field(
        default=100, description="Maximum MongoDB connections"
    )
    MONGODB_TIMEOUT_MS: int = Field(
        default=100, description="Maximum MongoDB connections"
    )

    # JWT Configuration
    JWT_SECRET_KEY: str = Field(..., description="Secret key for JWT signing")
    JWT_ALGORITHM: str = Field(default="HS256", description="Hashing algorithm for JWT")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30, description="Access token expiration time in minutes"
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7, description="Refresh token expiration time in days"
    )

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
    )


# Create settings instance
settings = Settings()  # type: ignore
