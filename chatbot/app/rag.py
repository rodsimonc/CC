"""Placeholder de la cadena RAG.

En Fase 1 devolvemos respuestas dummy pero con la forma final del contrato
(answer + recommendations + booking_cta) para que el frontend ya pueda
consumirla. Fase 2 reemplaza `answer_with_rag` por una cadena real de
LangChain sobre el índice FAISS.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .router import detect_area, detect_urgency

DISCLAIMER = (
    "Esto no constituye asesoramiento legal. Es orientación general para ayudarte "
    "a decidir con qué profesional consultar."
)


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


DEMO_LAWYERS: dict[str, list[Recommendation]] = {
    "penal": [
        Recommendation(
            slug="cristian-moix",
            full_name="Dr. Cristian Moix",
            headline="Abogado penalista con más de 25 años en Mar del Plata.",
            reason="Especialidad principal en derecho penal, referente local.",
        ),
    ],
    "familia": [
        Recommendation(
            slug="ana-benitez",
            full_name="Dra. Ana Benítez",
            headline="Familia, divorcios y sucesiones. Enfoque colaborativo.",
            reason="12 años en el fuero de familia de MdP, mediación y procesos colaborativos.",
        ),
    ],
    "laboral": [
        Recommendation(
            slug="martin-losada",
            full_name="Dr. Martín Losada",
            headline="Derecho laboral. Representación de trabajadores.",
            reason="Trayectoria en despidos, ART y reclamos individuales.",
        ),
    ],
    "civil": [
        Recommendation(
            slug="lucia-ferrari",
            full_name="Dra. Lucía Ferrari",
            headline="Civil y comercial. Defensa del consumidor.",
            reason="Contratos, daños y perjuicios, y defensa del consumidor.",
        ),
    ],
}


def answer_with_rag(question: str, session_id: str) -> ChatResult:
    area = detect_area(question)
    urgency = detect_urgency(question)
    recs = DEMO_LAWYERS.get(area or "", [])

    if not area:
        answer = (
            "Contame un poco más sobre qué te está pasando. ¿Es un problema penal, "
            "laboral, de familia, civil o comercial? Cuanto más detalle me des, "
            "mejor puedo orientarte. " + DISCLAIMER
        )
        return ChatResult(answer=answer, area=None, urgency=urgency)

    if urgency == "urgent":
        prefix = "Entiendo que es urgente. "
    else:
        prefix = ""

    core = {
        "penal": "Parece una cuestión de derecho penal. Te sugiero conversar cuanto antes con un abogado penalista.",
        "laboral": "Suena a un tema laboral. Un abogado especializado en derecho del trabajo puede orientarte sobre plazos y reclamos.",
        "familia": "Es un asunto de familia. Un profesional del fuero puede ayudarte a evaluar los pasos a seguir.",
        "civil": "Es un tema civil. Un abogado civilista puede revisar tu caso concreto.",
        "comercial": "Es un tema comercial. Conviene consultar con un abogado con experiencia societaria.",
        "sucesiones": "Se trata de una sucesión. Un abogado del fuero puede acompañarte todo el proceso.",
        "consumidor": "Es un tema de defensa del consumidor. Un abogado puede orientarte sobre plazos y vías de reclamo.",
        "administrativo": "Es un tema administrativo. Un abogado con experiencia en administrativo puede orientarte.",
        "transito": "Es un tema de tránsito. Un abogado con experiencia en siniestros viales puede evaluar tu caso.",
        "contravenciones": "Es una cuestión contravencional. Un abogado del fuero puede asesorarte.",
    }.get(area, "Vamos a orientarte con un profesional adecuado.")

    answer = f"{prefix}{core} {DISCLAIMER}"

    booking = None
    if recs:
        booking = {
            "lawyer_slug": recs[0].slug,
            "href": f"/abogados/{recs[0].slug}#agendar",
            "label": "Agendar consulta",
        }

    return ChatResult(answer=answer, recommendations=recs, booking_cta=booking, area=area, urgency=urgency)
