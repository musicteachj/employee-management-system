from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "employee-management-system"
    environment: str = "development"
    cors_origins: List[str] = ["http://localhost:5173"]
    
    # JWT Settings
    jwt_secret_key: str = "CHANGE-THIS-TO-A-RANDOM-SECRET-KEY-IN-PRODUCTION"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60  # 1 hour

    # AI / Anthropic Settings
    anthropic_api_key: str = ""
    ai_model: str = "claude-sonnet-4-6"
    ai_max_iterations: int = 5
    ai_daily_cap: int = 100  # per-user request cap (enforced in Phase 2)
    ai_monthly_cap: int = 1000  # per-user request cap (enforced in Phase 2)

    class Config:
        env_file = ".env"


settings = Settings()


