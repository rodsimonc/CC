from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class BarRecord:
    """Registro del padrón del CAMDP — fuente de verdad."""
    full_name: str
    bar_number: str
    status: str            # active | suspended | inactive
    enrolled_at: str | None = None
    email: str | None = None
    phone: str | None = None
    source_url: str | None = None


@dataclass
class MEVStats:
    """Estadística de expedientes públicos en MEV SCBA."""
    lawyer_name: str
    total_cases: int
    by_court: dict[str, int] = field(default_factory=dict)
    by_area: dict[str, int] = field(default_factory=dict)
    oldest_year: int | None = None
    newest_year: int | None = None


@dataclass
class LawyerProfileDraft:
    """Perfil en estado draft, listo para curación humana."""
    full_name: str
    bar: BarRecord
    mev_stats: MEVStats | None = None
    complementary: dict[str, object] = field(default_factory=dict)
    consented: bool = False
    published: bool = False
