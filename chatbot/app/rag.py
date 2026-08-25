"""Motor de respuesta del chatbot.

Fase 2 (con GOOGLE_API_KEY seteada): llama a Gemini con un system prompt
apretado que devuelve JSON con área, urgencia y respuesta empática en
voseo rioplatense. El propio módulo arma las recomendaciones cruzando el
área contra `data/lawyers.jsonl`.

Fallback (sin API key o si Gemini falla): detector heurístico + respuestas
plantilla. Garantiza que el chat siga funcionando aún sin proveedor LLM.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .config import settings
from .router import detect_area, detect_urgency

log = logging.getLogger(__name__)

DISCLAIMER = "Esto no constituye asesoramiento legal."

SYSTEM_PROMPT = """Sos el asistente legal del sitio Moix Legal (Mar del Plata, Argentina).

Reglas obligatorias:
- Escribís en español rioplatense (voseo, "vos" en vez de "tú", "querés" en vez de "quieres").
- Tono empático y profesional. Nunca das asesoramiento legal directo ni prometés resultados.
- Nunca inventás datos, plazos o normativa que no sepas con certeza. Si no sabés, decís que un profesional puede evaluarlo.
- Cerrás toda respuesta con el disclaimer: "Esto no constituye asesoramiento legal."
- Longitud: entre 3 y 6 oraciones. Directo, sin rodeos innecesarios.

Tu tarea es entender la consulta del usuario y devolver EXCLUSIVAMENTE un JSON válido con este formato:

{
  "area": "penal" | "laboral" | "familia" | "sucesiones" | "civil" | "consumidor" | "transito" | "administrativo" | "contravenciones" | "otro" | null,
  "urgent": true | false,
  "answer": "<respuesta empática al usuario, terminando con el disclaimer>"
}

Reglas para "area":
- "penal": delitos, denuncias, detenciones, imputaciones, violencia con víctima identificada.
- "laboral": despidos, ART, sueldos, aguinaldo, acoso laboral.
- "familia": divorcio, alimentos, tenencia, régimen de comunicación, violencia doméstica.
- "sucesiones": herencias, testamentos, declaratoria de herederos.
- "civil": contratos privados, vecinos, daños, alquileres, deudas civiles.
- "consumidor": defensa del consumidor, servicios, garantías, facturación indebida.
- "transito": siniestros viales, multas, licencias.
- "administrativo": trámites ante organismos públicos, multas municipales.
- "contravenciones": código contravencional.
- null: si la consulta es un saludo, pregunta muy vaga, o fuera del ámbito legal.

Regla para "urgent": true si menciona detención actual, plazo procesal a punto de vencer, medida cautelar inminente, violencia física en curso.

Devolvé SOLO el JSON, sin ningún texto extra, sin backticks, sin ```json.
"""


@dataclass
class Recommendation:
    slug: str
    full_name: str
    headline: str
    reason: str


@dataclass
class ChatResult:
    answer: str
    recommendations: list[Recommendation] = field(default_factory=list)
    booking_cta: dict | None = None
    area: str | None = None
    urgency: str = "medium"
    engine: str = "fallback"


# --- carga de perfiles desde data/lawyers.jsonl ---------------------------


def _load_lawyers() -> list[dict]:
    path = Path("data/lawyers.jsonl")
    if not path.exists():
        return []
    rows: list[dict] = []
    with path.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return rows


LAWYERS = _load_lawyers()

_AREA_ALIASES = {
    "sucesiones": ["sucesion", "sucesiones", "familia"],
    "familia": ["familia"],
    "penal": ["penal", "academico"],
    "laboral": ["laboral"],
    "civil": ["civil"],
    "comercial": ["comercial", "civil"],
    "consumidor": ["consumidor", "civil", "comercial"],
    "transito": ["civil", "comercial"],
    "administrativo": ["administrativo", "civil"],
    "contravenciones": ["penal"],
}


def _pick_lawyers(area: str | None, limit: int = 1) -> list[Recommendation]:
    if not area or not LAWYERS:
        return []
    wanted = _AREA_ALIASES.get(area, [area])
    matches: list[Recommendation] = []
    for lw in LAWYERS:
        practice = lw.get("practice_areas") or []
        if any(a in practice for a in wanted):
            matches.append(
                Recommendation(
                    slug=lw["slug"],
                    full_name=lw["full_name"],
                    headline=lw.get("headline") or "",
                    reason=f"Especialidad declarada en {area}. {lw.get('headline') or ''}".strip(),
                )
            )
            if len(matches) >= limit:
                break
    return matches


def _booking_from(rec: Recommendation) -> dict:
    return {
        "lawyer_slug": rec.slug,
        "href": f"/abogados/{rec.slug}#agendar",
        "label": "Agendar consulta",
    }


# --- fallback heurístico -------------------------------------------------


def _fallback(question: str) -> ChatResult:
    area = detect_area(question)
    urgency = detect_urgency(question)
    recs = _pick_lawyers(area)

    if not area:
        answer = (
            "Contame un poco más para poder orientarte. ¿Es un tema laboral, "
            "de familia, un problema con un vecino o comercio, algo de tránsito "
            "o una situación penal? Cuanto más detalle me des, mejor. " + DISCLAIMER
        )
        return ChatResult(answer=answer, area=None, urgency=urgency, engine="fallback-heuristic")

    prefix = "Entiendo que es urgente. " if urgency == "urgent" else ""
    core = {
        "penal": "Suena a una cuestión del fuero penal. Los tiempos corren rápido, así que conviene consultar cuanto antes con un defensor técnico.",
        "laboral": "Parece un tema laboral. Hay plazos que corren desde el hecho, así que conviene consultar pronto con un abogado laboralista.",
        "familia": "Es un asunto del fuero de familia. Según el caso puede resolverse por mediación o por vía judicial.",
        "sucesiones": "Se trata de una sucesión. El proceso tiene varios pasos (declaratoria de herederos, inventario, adjudicación).",
        "civil": "Es un tema civil. Un abogado civilista puede revisar tu caso y evaluar plazos y prescripción.",
        "consumidor": "Suena a defensa del consumidor. Hay vías administrativas y también reclamo judicial cuando corresponde.",
        "transito": "Parece un tema de tránsito. Es importante recopilar la documentación (constatación, denuncia, testigos) antes de reclamar.",
        "administrativo": "Es un tema administrativo. Un abogado con experiencia en el fuero puede orientarte sobre el trámite.",
        "contravenciones": "Es una cuestión contravencional. Un abogado del fuero puede asesorarte.",
    }.get(area, "Un abogado matriculado puede orientarte con más detalle.")

    answer = f"{prefix}{core} {DISCLAIMER}"
    return ChatResult(
        answer=answer,
        recommendations=recs,
        booking_cta=_booking_from(recs[0]) if recs else None,
        area=area,
        urgency=urgency,
        engine="fallback-heuristic",
    )


# --- Gemini --------------------------------------------------------------


_gemini_model = None


def _get_gemini():
    global _gemini_model
    if _gemini_model is not None:
        return _gemini_model
    if not settings.has_llm:
        return None
    try:
        import google.generativeai as genai  # type: ignore

        genai.configure(api_key=settings.google_api_key)
        _gemini_model = genai.GenerativeModel(
            settings.gemini_model,
            system_instruction=SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"},
        )
        return _gemini_model
    except Exception:  # pragma: no cover
        log.exception("no pude inicializar Gemini; caigo a fallback")
        return None


def _ask_gemini(question: str) -> dict[str, Any] | None:
    model = _get_gemini()
    if model is None:
        return None
    try:
        response = model.generate_content(question)
        raw = (response.text or "").strip()
        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.startswith("json"):
                raw = raw[4:].strip()
        return json.loads(raw)
    except Exception:
        log.exception("fallo la llamada a Gemini o parseo del JSON")
        return None


# --- entrada pública -----------------------------------------------------


def answer_with_rag(question: str, session_id: str) -> ChatResult:
    log.debug("chat request session=%s", session_id)
    parsed = _ask_gemini(question)
    if not parsed:
        return _fallback(question)

    answer = (parsed.get("answer") or "").strip()
    if not answer:
        return _fallback(question)
    if DISCLAIMER not in answer:
        answer = f"{answer} {DISCLAIMER}"

    area = parsed.get("area")
    if area == "otro":
        area = None
    urgency = "urgent" if bool(parsed.get("urgent")) else "medium"

    recs = _pick_lawyers(area)
    return ChatResult(
        answer=answer,
        recommendations=recs,
        booking_cta=_booking_from(recs[0]) if recs else None,
        area=area,
        urgency=urgency,
        engine="gemini",
    )
