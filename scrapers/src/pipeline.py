"""Orquestador del armado de perfil.

Reglas:
1. Sin CAMDP no hay perfil.
2. MEV enriquece con desempeño real.
3. Fuentes complementarias corren en paralelo, no bloquean publicación.
4. El resultado queda en `draft` hasta curación humana.
"""

from __future__ import annotations

from dataclasses import asdict
from concurrent.futures import ThreadPoolExecutor

from . import camdp, cij, mev, prensa, saij
from .models import LawyerProfileDraft


def build_profile(full_name: str | None = None, bar_number: str | None = None) -> LawyerProfileDraft | None:
    bar = None
    if bar_number:
        bar = camdp.lookup_by_bar_number(bar_number)
    elif full_name:
        bar = camdp.lookup_by_name(full_name)

    if not bar:
        return None

    with ThreadPoolExecutor(max_workers=4) as pool:
        f_mev = pool.submit(mev.stats_by_lawyer_name, bar.full_name)
        f_cij = pool.submit(cij.mentions, bar.full_name)
        f_saij = pool.submit(saij.publications, bar.full_name)
        f_prensa = pool.submit(prensa.mentions, bar.full_name)

    return LawyerProfileDraft(
        full_name=bar.full_name,
        bar=bar,
        mev_stats=f_mev.result(),
        complementary={
            "cij": f_cij.result(),
            "saij": f_saij.result(),
            "prensa": f_prensa.result(),
        },
    )


def to_api_payload(draft: LawyerProfileDraft) -> dict:
    return {
        "full_name": draft.full_name,
        "bar_number": draft.bar.bar_number,
        "bar_status": draft.bar.status,
        "practice_areas": [],
        "published": draft.published,
        "consented": draft.consented,
        "meta": {
            "mev": asdict(draft.mev_stats) if draft.mev_stats else None,
            "complementary": draft.complementary,
        },
    }
