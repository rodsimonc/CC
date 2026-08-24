"""Clasificación heurística del área legal a partir del texto del usuario.

En Fase 2 esta capa la reemplaza el LLM con function calling. En Fase 1
alcanza con una tabla de aliases para probar el flujo end-to-end.
"""

from __future__ import annotations

AREA_KEYWORDS: dict[str, tuple[str, ...]] = {
    "penal": ("penal", "delito", "denuncia", "detencion", "detenido", "imputad", "robo", "amenaza"),
    "laboral": ("laboral", "despido", "sin causa", "art", "accidente de trabajo", "sueldo", "aguinaldo"),
    "familia": ("familia", "divorcio", "alimentos", "tenencia", "custodia", "violencia"),
    "sucesiones": ("sucesion", "herencia", "testamento", "heredero"),
    "civil": ("civil", "vecino", "medianera", "reclamo", "danios", "daños"),
    "comercial": ("comercial", "sociedad", "quiebra", "concurso", "sa", "srl"),
    "consumidor": ("consumidor", "defensa del consumidor", "producto fallado", "servicio no prestado"),
    "administrativo": ("municipal", "multa", "administrativ", "tramite ante"),
    "transito": ("transito", "tránsito", "choque", "siniestro vial"),
    "contravenciones": ("contravencion", "código contravencional", "codigo contravencional"),
}


URGENT_KEYWORDS = ("detenido", "detencion", "urgente", "hoy", "ahora", "audiencia manana", "audiencia mañana", "plazo vence")


def detect_area(text: str) -> str | None:
    lowered = text.lower()
    for area, keywords in AREA_KEYWORDS.items():
        if any(k in lowered for k in keywords):
            return area
    return None


def detect_urgency(text: str) -> str:
    lowered = text.lower()
    if any(k in lowered for k in URGENT_KEYWORDS):
        return "urgent"
    return "medium"
