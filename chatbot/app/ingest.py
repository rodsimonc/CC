"""Placeholder del script de ingesta.

En Fase 2 este módulo:
1. Lee `data/lawyers.jsonl` (sincronizado desde `api/`).
2. Lee `data/normativa/*.md` (Código Penal AR, CPP Buenos Aires, leyes clave).
3. Genera embeddings y persiste el índice FAISS en `storage/faiss_index/`.
"""

from __future__ import annotations

import json
from pathlib import Path

from .config import settings


def reindex() -> dict:
    lawyers_path = Path("data/lawyers.jsonl")
    normativa_dir = Path("data/normativa")
    docs = 0
    if lawyers_path.exists():
        with lawyers_path.open() as f:
            docs += sum(1 for _ in f)
    if normativa_dir.exists():
        docs += sum(1 for _ in normativa_dir.rglob("*.md"))
    return {
        "ok": True,
        "provider": settings.embeddings_provider,
        "index_path": settings.faiss_index_path,
        "docs_seen": docs,
        "note": "Fase 1 placeholder. Fase 2: generar embeddings y persistir FAISS.",
    }


if __name__ == "__main__":
    print(json.dumps(reindex(), indent=2, ensure_ascii=False))
