"""Padrón del Colegio de Abogados de Mar del Plata.

Fuente de verdad. Sin coincidencia acá el perfil no se publica.
Este módulo es un scaffold: la implementación real requiere validar
el formulario del sitio y respetar throttling y ToS.
"""

from __future__ import annotations

from .models import BarRecord

CAMDP_BASE = "https://camdp.org.ar/wp/"


def lookup_by_name(full_name: str) -> BarRecord | None:
    """Busca por nombre en el padrón. Placeholder para Fase 1.

    Fase 2: consulta HTTP con throttling, parsing con BeautifulSoup,
    y persistencia en cache local (TTL 30 días).
    """
    return None


def lookup_by_bar_number(bar_number: str) -> BarRecord | None:
    """Busca por número de matrícula. Placeholder para Fase 1."""
    return None
