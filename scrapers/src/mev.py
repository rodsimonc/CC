"""Mesa de Entradas Virtual (MEV) — Suprema Corte de Justicia bonaerense.

Extrae estadística de expedientes públicos por nombre del letrado:
volumen, fueros, juzgados frecuentes.
"""

from __future__ import annotations

from .models import MEVStats

MEV_BASE = "https://mev.scba.gov.ar/"


def stats_by_lawyer_name(full_name: str) -> MEVStats:
    """Consulta expedientes públicos y agrega estadística. Placeholder."""
    return MEVStats(lawyer_name=full_name, total_cases=0)
