from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "employee-management-system"
    environment: str = "development"
    cors_origins: List[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()


