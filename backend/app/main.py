from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.v1.routers import router as api_v1_router
from app.db.mongodb import MongoDB

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB at startup
    await MongoDB.connect()
    yield
    # Disconnect from MongoDB at shutdown
    await MongoDB.disconnect()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    openapi_url=settings.OPENAPI_URL,
    docs_url=settings.API_DOCS_URL,
    redoc_url=settings.REDOC_URL,
    lifespan=lifespan,
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
