from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    llm_provider: str = "google"
    google_api_key: str = ""
    anthropic_api_key: str = ""

    embeddings_provider: str = "hf"
    faiss_index_path: str = "./storage/faiss_index"

    api_internal_url: str = "http://localhost:4000"
    api_internal_token: str = ""

    port: int = 8000
    log_level: str = "INFO"

    gemini_model: str = "gemini-1.5-flash"

    @property
    def has_llm(self) -> bool:
        return self.llm_provider == "google" and bool(self.google_api_key)


settings = Settings()
