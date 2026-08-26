"""Clasificación heurística del área legal a partir del texto del usuario.

En Fase 2 esta capa la reemplaza el LLM con function calling. En Fase 1
alcanza con una tabla de aliases para probar el flujo end-to-end.
"""

from __future__ import annotations

from __future__ import annotations

import re

# Fragmentos que cubren familias completas de conjugaciones y variantes
# rioplatenses. El matching es por substring en el texto en minúsculas,
# por lo que "deten" cubre detenido/detenida/detuvieron/detención/detener.
AREA_KEYWORDS: dict[str, tuple[str, ...]] = {
    "penal": (
        "penal", "delito", "denuncia", "denunciar",
        "deten", "detuv", "detener", "arrestad", "arrestar",
        "preso", "presa", "encana", "en cana",
        "imputa", "imputad",
        "robo", "roba", "hurto",
        "amenaza", "amenazad",
        "estafa", "estafad", "defraud",
        "abuso", "abusad",
        "lesion", "herida", "puñalada", "punalada",
        "homicid", "femicid",
        "allanamient", "excarcelac", "excarcelar",
        "prision preventiva", "prisión preventiva",
        "fiscal", "fiscalia", "fiscalía",
        "juzgado penal", "camara penal", "cámara penal",
        "declaracion indagatoria", "declaración indagatoria",
        "juicio abreviado",
    ),
    "laboral": (
        "laboral", "despid", "despedir", "me echaron", "me rajaron",
        "sin causa", "art", "accidente de trabajo",
        "sueldo", "aguinaldo", "no me pagan", "no cobro",
        "horas extra", "acoso laboral", "en negro",
    ),
    "familia": (
        "familia", "divorci", "separaci",
        "mi ex", "mi marido", "mi esposa", "mi mujer", "mi pareja",
        "alimentos", "cuota alimentaria",
        "tenencia", "custodia",
        "régimen de comunicación", "regimen de comunicacion",
        "visitas", "adopci", "filiaci",
        "violencia familiar", "violencia de género", "violencia de genero",
        "violencia doméstica", "violencia domestica",
    ),
    "sucesiones": ("sucesi", "herenc", "hereder", "testament", "inventario"),
    "civil": (
        "civil", "vecino", "medianera",
        "reclamo civil", "danios", "daños",
        "contrato", "alquiler", "inquilino", "propietario",
        "desalojo", "deuda", "mutuo", "prescripci",
    ),
    "comercial": ("comercial", "sociedad", "quiebra", "concurso preventivo", "srl", "s.a"),
    "consumidor": (
        "consumidor", "defensa del consumidor",
        "producto fallad", "servicio no prestad",
        "garant", "facturacion indebida", "facturación indebida",
        "reclamo a la empresa", "reclamo a la compañía",
    ),
    "administrativo": ("municipal", "multa municipal", "administrativ", "tramite ante", "trámite ante"),
    "transito": ("transito", "tránsito", "choque", "chocaron", "siniestro vial", "constatac"),
    "contravenciones": ("contravencion", "contravención", "codigo contravencional", "código contravencional"),
}

# Términos que, si aparecen en la consulta, GARANTIZAN que es penal. Se usan
# como safety rail: aún si el LLM dijera lo contrario, el backend override.
# Cubrí conjugaciones a mano; el matching es por substring.
STRICT_PENAL_SIGNALS: tuple[str, ...] = (
    # Situaciones procesales
    "deten", "detuv", "detener", "detenc",
    "arrestad", "arrestar",
    "preso", "presa", "encana", " cana",
    "allanamient",
    "imputad", "imputa", "imputaci",
    "fiscal", "fiscalia", "fiscalía",
    "declaracion indagatoria", "declaración indagatoria",
    "excarcelac",
    "prision preventiva", "prisión preventiva",
    "juzgado penal", "camara penal", "cámara penal", "sala penal",
    "denuncia penal", "querella",
    "juicio abreviado", "suspension del juicio", "suspensión del juicio",
    "morigeraci",
    "tribunal oral",
    "policia", "policía", "comisaria", "comisaría", "flagrancia",
    # Delitos (fragmentos que cubren conjugaciones)
    "delito", "delictiv",
    "homicid", "femicid", "asesin",
    "lesion",
    "amenaza", "amenazad",
    "coacci", "coaccion", "coacción",
    "secuestr", "privacion ileg", "privación ileg",
    "acoso", "acosad",
    "injuri", "calumn",
    "robo", "robaron", "hurto", "hurtaron",
    "extorsi",
    "estafa", "estafar",
    "defraud",
    "apropiacion indebida", "apropiación indebida",
    "administracion fraudulenta", "administración fraudulenta",
    "lavado", "blanqueo",
    "evasion fiscal", "evasión fiscal",
    "cohecho", "malversac", "trafico de influencias", "tráfico de influencias",
    "incendio dolos",
    "portacion de arma", "portación de arma", "tenencia de arma",
    "alcoholemia", "conduccion imprudent", "conducción imprudent",
    "homicidio culpos", "lesiones culposa",
    "abuso sexual", "violacion sexual", "violación sexual", "violaron",
    "corrupcion de menores", "corrupción de menores",
    "ciberdelito", "ciberataque", "hacker", "hackeo", "hackear", "hackearon",
    "acceso indebido", "dano informatico", "daño informático",
    "violacion de correspondencia", "violación de correspondencia",
    "revelacion de secreto", "revelación de secreto",
    "violacion de domicilio", "violación de domicilio",
    "sedici", "resistencia a la autoridad", "atentado a la autoridad",
    "violencia domestica", "violencia doméstica",
    "violencia de genero", "violencia de género",
    "delito fiscal", "delito tributari",
    "crimen de lesa humanidad", "lesa humanidad",
    "narcomenudeo", "narcotrafico", "narcotráfico",
    "encubrimient",
)

URGENT_KEYWORDS = (
    "detenid", "detenc", "detuvieron",
    "urgente", "hoy", "ahora",
    "audiencia manana", "audiencia mañana",
    "plazo vence", "plazo por vencer",
    "flagrancia",
)


def _norm(text: str) -> str:
    """Lowercase + colapso de espacios para matching estable."""
    return re.sub(r"\s+", " ", text.lower()).strip()


def detect_area(text: str) -> str | None:
    lowered = _norm(text)
    for area, keywords in AREA_KEYWORDS.items():
        if any(k in lowered for k in keywords):
            return area
    return None


def detect_urgency(text: str) -> str:
    lowered = _norm(text)
    if any(k in lowered for k in URGENT_KEYWORDS):
        return "urgent"
    return "medium"


def is_strict_penal(text: str) -> bool:
    """True si la consulta menciona algo que es 100% penal por definición.

    Sirve como safety rail post-LLM: si el modelo clasifica mal una consulta
    con estos términos, la override.
    """
    lowered = _norm(text)
    return any(k in lowered for k in STRICT_PENAL_SIGNALS)
