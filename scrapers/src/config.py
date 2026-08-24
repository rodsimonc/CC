from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    api_internal_url: str = "http://localhost:4000"
    api_internal_token: str = ""
    camdp_throttle_ms: int = 2000
    mev_throttle_ms: int = 3000
    user_agent: str = "Moix-Legal-Bot/0.1 (contacto@moixlegal.com.ar)"
    cache_dir: str = "./.cache"


settings = Settings()
