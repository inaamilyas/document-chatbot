from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.models.user import UserCreate, Token
from app.services.user import UserService
from app.core.security import create_access_token, create_refresh_token, verify_password
from app.config import settings

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    try:
        user = await UserService.create_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User creation failed"
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return {
        "access_token": create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=access_token_expires,
        ),
        "refresh_token": create_refresh_token(
            data={"sub": user.email}, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await UserService.get_user(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return {
        "access_token": create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=access_token_expires,
        ),
        "refresh_token": create_refresh_token(
            data={"sub": user.email}, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }
