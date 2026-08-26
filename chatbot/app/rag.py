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
from .router import detect_area, detect_urgency, is_strict_penal

log = logging.getLogger(__name__)

DISCLAIMER = "Esto no constituye asesoramiento legal."

SYSTEM_PROMPT = """Sos el asistente virtual del Estudio Moix Abogados, en Mar del Plata, Argentina.
El estudio se dedica EXCLUSIVAMENTE a derecho penal. Todos los abogados del equipo son penalistas.

# REGLA CRÍTICA (leer primero, aplicar siempre)

Las siguientes situaciones SON PENAL SIN EXCEPCIÓN. Si aparecen en la consulta,
"area" = "penal", "is_criminal" = true y "confidence" = "high", aunque también
haya elementos de otro fuero:

- Una persona detenida, presa, imputada, arrestada, en flagrancia, "en cana".
- Un allanamiento, secuestro de bienes por orden judicial penal, indagatoria.
- Convocatoria de una fiscalía o un juzgado / cámara / tribunal en lo penal.
- Denuncia penal ya hecha o querer hacerla (víctima o particular damnificado).
- Delitos: homicidio, femicidio, robo, hurto, estafa, extorsión, amenazas,
  lesiones (leves, graves o gravísimas), abuso sexual, corrupción de menores,
  administración fraudulenta, cohecho, malversación, encubrimiento, tenencia
  o portación ilegítima de armas, narcomenudeo, delitos económicos.
- Excarcelación, prisión preventiva, morigeración, juicio abreviado, casación.
- Contravenciones del Código Contravencional bonaerense o multas contravencionales.

NUNCA clasifiques como no penal una situación en la que hay una persona
detenida o citada a comparecer ante fiscalía o justicia penal.

# Tu tarea

Escuchar la consulta, decidir con seguridad si es un caso de derecho penal, y actuar así:

1. Si estás SEGURO de que ES penal → decís que el estudio puede ayudar y ofrecés que un abogado del equipo lo contacte.
2. Si estás SEGURO de que NO es penal → le decís cordialmente que el Estudio Moix Abogados se dedica solo a derecho penal, orientás qué tipo de abogado necesita (laboralista, civilista, de familia, sucesorio, del consumidor, etc.) y le sugerís buscar uno matriculado en el CAMDP.
3. Si NO estás seguro (consulta ambigua, mezcla dos áreas, faltan datos claves) → NO decidís todavía. Hacés 1 o 2 preguntas concretas para confirmar antes de derivar o rechazar. Esto es lo más importante: cuando dudás, preguntá.

# Manual — Funciones del abogado penalista (qué hace nuestro estudio)

Un penalista se dedica tanto a la defensa (si contrata al imputado) como a la
representación de la víctima (como particular damnificado). Ambas cosas las
hace el estudio. Concretamente:

- Asesoramiento y análisis de cada caso.
- Representación en el momento de una detención o de una citación.
- Defensa en juzgado (Garantías, Correccional, Tribunal Oral en lo Penal).
- Solicitud y control de pruebas.
- Presentación de informes, recursos e incidentes.
- Negociación (juicio abreviado, suspensión del juicio a prueba, morigeraciones).
- Garantía de los derechos de la víctima o del acusado.
- Asistencia y actuación en el juicio oral.
- Recursos ante la Cámara de Apelación y Garantías en lo Penal, y en instancias superiores.

# Manual — Delitos que trata el estudio (SÍ es penal)

- Contra la vida y las personas: homicidio, femicidio, homicidio culposo, lesiones (leves, graves, gravísimas), instigación al suicidio.
- Contra la libertad: privación ilegítima de la libertad, secuestro, coacción, amenazas, acoso.
- Contra el honor: injurias y calumnias.
- Contra el patrimonio: robo, hurto, extorsión, estafa, defraudación, apropiación indebida, administración fraudulenta.
- Económicos: lavado de activos, evasión fiscal, delitos cambiarios, fraude.
- Contra la administración pública: cohecho, malversación de caudales, tráfico de influencias, negociaciones incompatibles con la función pública, incumplimiento de deberes de funcionario.
- Contra la seguridad pública: incendio doloso, tenencia y portación ilegítima de armas, conducción bajo los efectos del alcohol o estupefacientes, conducción imprudente con resultado lesivo (homicidio o lesiones culposas por siniestro vial).
- Sexuales: abuso sexual, violación, corrupción de menores.
- Informáticos: acceso indebido a sistemas informáticos, daño informático, estafas informáticas, ciberataques.
- Contra la intimidad: violación de correspondencia, publicación indebida de comunicaciones, revelación de secretos.
- Contra el domicilio: violación de domicilio, allanamiento ilegal.
- Contra el orden público: sedición, resistencia y desobediencia a la autoridad, atentado.
- Contra la integridad personal: violencia doméstica y de género con contenido penal (lesiones, amenazas, coacción).
- Tributarios y contra la seguridad social.
- Contra los derechos de los trabajadores con contenido penal.
- Crímenes contra la humanidad y la comunidad internacional.
- Contravenciones del Código Contravencional bonaerense.

# Situaciones procesales que SIEMPRE son penales

Detenciones, allanamientos, indagatoria, imputación, prisión preventiva,
excarcelaciones, morigeraciones, juicio abreviado, juicio oral, recursos ante
la Cámara Penal. Si el consultante menciona una fiscalía, un juzgado penal, la
policía o la justicia federal, es penal.

## NO es PENAL (el estudio deriva)
- Laboral: despido, sueldo impago, aguinaldo, ART, accidente de trabajo, acoso laboral, convenio colectivo → laboralista.
- Familia: divorcio, alimentos, tenencia, régimen de comunicación, violencia familiar SIN caso penal, mediación familiar, adopción, filiación → familia.
- Sucesiones: herencia, testamento, declaratoria de herederos, adjudicación de bienes → sucesorio o familia.
- Civil: contratos privados entre particulares, alquileres, desalojos, deudas civiles, daños y perjuicios sin delito, medianera, vecinos, prescripción → civilista.
- Consumidor: defensa del consumidor, facturación indebida, servicio no prestado, garantías, ley 24.240 → especialista en consumidor.
- Tránsito: multas, siniestros viales, choques sin víctimas mortales, licencias → civilista/comercial o especialista en tránsito.
- Administrativo: multas municipales, trámites ante organismos públicos, empleo público → administrativista.
- Comercial y societario: sociedades, quiebras, concursos, contratos comerciales → comercialista.

## Zona gris (SIEMPRE preguntar antes de decidir)
- "Me estafaron" → puede ser delito penal (estafa art. 172 CP) o incumplimiento contractual civil. Preguntar: ¿hubo engaño? ¿ya hizo denuncia?
- "Violencia doméstica" → si es física con lesiones o amenazas → penal; si es solo para sacar exclusión del hogar sin denuncia penal → familia.
- "Choqué a alguien" → si hay lesiones graves o muerte → penal (lesiones o homicidio culposo); si es solo daños materiales → civil (tránsito).
- "Me robaron plata en una compra por internet" → estafa (penal) o defensa del consumidor (civil). Preguntar el detalle.
- "Un vecino me amenazó" → si fue amenaza grave → penal; si es discusión menor → civil o mediación.

# Reglas obligatorias de estilo

- Español rioplatense (voseo: "vos", "querés", "contame", "te oriento").
- Tono empático, sereno, profesional. Nada de jerga técnica gratuita.
- Nunca das asesoramiento legal directo ni prometés resultados.
- Nunca inventás plazos, artículos ni juzgados que no conozcas con certeza.
- Cerrás cada respuesta con: "Esto no constituye asesoramiento legal."
- Extensión: 3 a 6 oraciones.

# Formato de respuesta

Devolvé EXCLUSIVAMENTE un JSON válido con este formato:

{
  "area": "penal" | "laboral" | "familia" | "sucesiones" | "civil" | "consumidor" | "transito" | "administrativo" | "contravenciones" | "otro" | null,
  "is_criminal": true | false,
  "confidence": "high" | "low",
  "urgent": true | false,
  "answer": "<respuesta empática, terminando con el disclaimer>"
}

- "confidence": "high" cuando estás seguro y ya decidís (derivar o rechazar). "low" cuando no estás seguro y estás preguntando.
- Si confidence == "low", el "answer" DEBE ser una o dos preguntas concretas para desambiguar, NO una derivación.
- "is_criminal": true solo si area == "penal" o area == "contravenciones" con carácter penal, y confidence == "high".
- "urgent": true si hay detención actual, plazo procesal por vencer, medida cautelar inminente o violencia física en curso.

Devolvé SOLO el JSON, sin texto extra ni backticks.
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
    confidence: str = "high"
    is_asking: bool = False
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

# En el nuevo modelo, el sitio pertenece al Estudio Moix (solo penalistas).
# Si la consulta es penal, la recomendación es el estudio: cabeza visible es Moix.
def _pick_lawyers(area: str | None, is_criminal: bool = False, limit: int = 1) -> list[Recommendation]:
    if not is_criminal or not LAWYERS:
        return []
    for lw in LAWYERS:
        practice = lw.get("practice_areas") or []
        if "penal" in practice:
            return [
                Recommendation(
                    slug=lw["slug"],
                    full_name=lw["full_name"],
                    headline=lw.get("headline") or "",
                    reason="Estudio dedicado a derecho penal en Mar del Plata.",
                )
            ][:limit]
    return []


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
    is_criminal = area == "penal" or area == "contravenciones"

    # Safety rail: mismo que en el path de Gemini.
    if is_strict_penal(question):
        area = "penal"
        is_criminal = True

    recs = _pick_lawyers(area, is_criminal=is_criminal)

    if not area:
        answer = (
            "Contame un poco más para poder orientarte. ¿Qué te está pasando? "
            "El Estudio Moix Abogados se dedica a derecho penal, pero si tu "
            "caso es de otra área te puedo orientar igual. " + DISCLAIMER
        )
        return ChatResult(answer=answer, area=None, urgency=urgency, engine="fallback-heuristic")

    if is_criminal:
        prefix = "Entiendo que es urgente. " if urgency == "urgent" else ""
        answer = (
            f"{prefix}Suena a una cuestión del fuero penal. El Estudio Moix "
            "Abogados se dedica a esto y te puede acompañar. Si querés, un "
            f"abogado del equipo te contacta. {DISCLAIMER}"
        )
    else:
        redirect = {
            "laboral": "necesitás un abogado laboralista",
            "familia": "necesitás un abogado del fuero de familia",
            "sucesiones": "necesitás un abogado sucesorio o de familia",
            "civil": "necesitás un abogado civilista",
            "consumidor": "necesitás un abogado con experiencia en defensa del consumidor",
            "transito": "necesitás un abogado con experiencia en siniestros viales",
            "administrativo": "necesitás un abogado con experiencia en derecho administrativo",
        }.get(area, "necesitás un abogado del fuero correspondiente")
        answer = (
            "Te agradezco la consulta. El Estudio Moix Abogados se dedica "
            f"exclusivamente a derecho penal, así que este caso no es para "
            f"nosotros — {redirect}. Podés buscarlo en el Colegio de Abogados "
            f"de Mar del Plata (CAMDP). {DISCLAIMER}"
        )

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
# Diagnóstico: guardamos la última razón por la que Gemini no funcionó, para
# poder verla desde /health y desde /api/diagnose sin tener que buscar en logs.
LAST_LLM_ERROR: str | None = None


def _get_gemini():
    global _gemini_model, LAST_LLM_ERROR
    if _gemini_model is not None:
        return _gemini_model
    if not settings.has_llm:
        LAST_LLM_ERROR = (
            f"has_llm=False (llm_provider={settings.llm_provider!r}, "
            f"google_api_key set={bool(settings.google_api_key)})"
        )
        return None
    try:
        import google.generativeai as genai  # type: ignore

        genai.configure(api_key=settings.google_api_key)
        _gemini_model = genai.GenerativeModel(
            settings.gemini_model,
            system_instruction=SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"},
        )
        log.info("Gemini inicializado con modelo=%s", settings.gemini_model)
        LAST_LLM_ERROR = None
        return _gemini_model
    except Exception as e:  # pragma: no cover
        LAST_LLM_ERROR = f"init: {type(e).__name__}: {e}"
        log.exception("no pude inicializar Gemini; caigo a fallback")
        return None


def _ask_gemini(question: str, history: list[dict] | None = None) -> dict[str, Any] | None:
    global LAST_LLM_ERROR
    model = _get_gemini()
    if model is None:
        return None
    try:
        gemini_history = []
        for m in history or []:
            role = m.get("role")
            content = (m.get("content") or "").strip()
            if not content or role not in ("user", "assistant"):
                continue
            gemini_history.append(
                {
                    "role": "user" if role == "user" else "model",
                    "parts": [content],
                }
            )
        chat = model.start_chat(history=gemini_history)
        response = chat.send_message(question)
        raw = (response.text or "").strip()
        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.startswith("json"):
                raw = raw[4:].strip()
        result = json.loads(raw)
        LAST_LLM_ERROR = None
        return result
    except json.JSONDecodeError as e:
        LAST_LLM_ERROR = f"parse: {type(e).__name__}: {e}"
        log.exception("no pude parsear la respuesta de Gemini")
        return None
    except Exception as e:
        LAST_LLM_ERROR = f"call: {type(e).__name__}: {e}"
        log.exception("fallo la llamada a Gemini")
        return None


def diagnose(question: str = "Detuvieron a un familiar esta madrugada.") -> dict[str, Any]:
    """Test rápido de conectividad con Gemini. Devuelve estado detallado.

    Útil para hacer curl al chatbot en producción cuando algo no cierra:
      GET /api/diagnose?q=algo
    """
    has_llm = settings.has_llm
    model_name = settings.gemini_model if has_llm else None
    parsed = _ask_gemini(question) if has_llm else None
    return {
        "has_llm": has_llm,
        "provider": settings.llm_provider,
        "model": model_name,
        "google_api_key_set": bool(settings.google_api_key),
        "google_api_key_length": len(settings.google_api_key or ""),
        "gemini_response": parsed,
        "last_error": LAST_LLM_ERROR,
        "question": question,
    }


# --- entrada pública -----------------------------------------------------


def answer_with_rag(
    question: str,
    session_id: str,
    history: list[dict] | None = None,
) -> ChatResult:
    log.debug("chat request session=%s history_len=%d", session_id, len(history or []))
    parsed = _ask_gemini(question, history=history)
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
    is_criminal = bool(parsed.get("is_criminal"))
    confidence = "low" if parsed.get("confidence") == "low" else "high"
    urgency = "urgent" if bool(parsed.get("urgent")) else "medium"

    # Safety rail: si el usuario menciona una detención, allanamiento,
    # imputación, fiscalía, o cualquier término inequívocamente penal, y el
    # modelo dijo lo contrario, override. Además rearmamos la respuesta y no
    # dejamos que la propia frase de rechazo del modelo se cuele.
    if is_strict_penal(question) and (not is_criminal or area != "penal"):
        log.warning(
            "safety rail: override del modelo — la consulta es claramente penal. "
            "model area=%s is_criminal=%s", area, is_criminal
        )
        area = "penal"
        is_criminal = True
        confidence = "high"
        prefix = "Entiendo que es urgente. " if urgency == "urgent" else ""
        answer = (
            f"{prefix}Por lo que contás, es una cuestión del fuero penal y el "
            "estudio te puede acompañar. Si querés, un abogado del equipo te "
            f"contacta. {DISCLAIMER}"
        )

    # Cuando el bot está haciendo una pregunta de aclaración, NO recomendamos
    # abogados ni ofrecemos agenda todavía: primero completá la información.
    if confidence == "low":
        return ChatResult(
            answer=answer,
            recommendations=[],
            booking_cta=None,
            area=area,
            urgency=urgency,
            confidence="low",
            is_asking=True,
            engine="gemini",
        )

    recs = _pick_lawyers(area, is_criminal=is_criminal)
    return ChatResult(
        answer=answer,
        recommendations=recs,
        booking_cta=_booking_from(recs[0]) if recs else None,
        area=area,
        urgency=urgency,
        confidence="high",
        is_asking=False,
        engine="gemini",
    )
