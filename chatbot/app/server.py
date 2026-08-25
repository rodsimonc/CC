from __future__ import annotations

import logging

from fastapi import FastAPI
from pydantic import BaseModel, Field

from .config import settings
from .ingest import reindex
from .rag import answer_with_rag

logging.basicConfig(level=settings.log_level)
log = logging.getLogger("chatbot")

app = FastAPI(title="Moix Legal Chatbot", version="0.1.0")


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=80)
    question: str = Field(min_length=1, max_length=2000)


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
    engine: str = "fallback"


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "service": "chatbot",
        "version": "0.1.0",
        "provider": settings.llm_provider,
        "llm_ready": settings.has_llm,
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    log.debug("chat request", extra={"session_id": req.session_id})
    result = answer_with_rag(req.question, req.session_id)
    return ChatResponse(
        answer=result.answer,
        recommendations=[RecommendationDto(**r.__dict__) for r in result.recommendations],
        booking_cta=result.booking_cta,
        area=result.area,
        urgency=result.urgency,
        engine=result.engine,
    )


@app.post("/api/reindex")
def reindex_route() -> dict:
    return reindex()
