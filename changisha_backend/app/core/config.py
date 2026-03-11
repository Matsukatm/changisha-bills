from typing import List
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Changisha Bills"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    DATABASE_URL: str
    REDIS_URL: str
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str
    
    M_PESA_CONSUMER_KEY: str
    M_PESA_CONSUMER_SECRET: str
    M_PESA_SHORTCODE: str
    M_PESA_PASSKEY: str
    
    SMS_API_KEY: str = ""
    EMAIL_USERNAME: str = ""
    EMAIL_PASSWORD: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()