from __future__ import annotations

import logging

from fastapi import FastAPI
from pydantic import BaseModel, Field

from .config import settings
from .ingest import reindex
from .rag import answer_with_rag, diagnose

logging.basicConfig(level=settings.log_level)
log = logging.getLogger("chatbot")

app = FastAPI(title="Moix Legal Chatbot", version="0.1.0")


class HistoryItem(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=80)
    question: str = Field(min_length=1, max_length=2000)
    history: list[HistoryItem] = []


class RecommendationDto(BaseModel):
    slug: str
    full_name: str
    headline: str
    reason: str


class ChatResponse(BaseModel):
    answer: str
    recommendations: list[RecommendationDto] = []
    booking_cta: dict | None = None
    area: str | None = None
    urgency: str = "medium"
    confidence: str = "high"
    is_asking: bool = False
    engine: str = "fallback"


@app.get("/health")
def health() -> dict:
    # LAST_LLM_ERROR se re-lee desde el módulo rag para reflejar el estado actual
    from . import rag as _rag
    return {
        "ok": True,
        "service": "chatbot",
        "version": "0.1.0",
        "provider": settings.llm_provider,
        "model": settings.gemini_model,
        "llm_ready": settings.has_llm,
        "last_error": _rag.LAST_LLM_ERROR,
    }


@app.get("/api/diagnose")
def diagnose_endpoint(q: str = "Detuvieron a un familiar esta madrugada.") -> dict:
    """Prueba de conectividad con Gemini. Ejemplo:
    curl 'https://moix-legal-chatbot-che0.onrender.com/api/diagnose?q=probando'
    """
    return diagnose(q)


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    log.debug("chat request", extra={"session_id": req.session_id})
    history = [h.model_dump() for h in req.history]
    result = answer_with_rag(req.question, req.session_id, history=history)
    return ChatResponse(
        answer=result.answer,
        recommendations=[RecommendationDto(**r.__dict__) for r in result.recommendations],
        booking_cta=result.booking_cta,
        area=result.area,
        urgency=result.urgency,
        confidence=result.confidence,
        is_asking=result.is_asking,
        engine=result.engine,
    )


@app.post("/api/reindex")
def reindex_route() -> dict:
    return reindex()
