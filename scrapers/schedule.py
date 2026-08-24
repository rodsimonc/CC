"""Cron interno con APScheduler. Corre pipelines periódicos.

Fase 1: scaffold. Fase 2: se activa cuando los módulos tienen implementación real.
"""

from __future__ import annotations

import logging

from apscheduler.schedulers.blocking import BlockingScheduler

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("scrapers.schedule")


def refresh_mev_stats() -> None:
    log.info("refresh_mev_stats — placeholder")


def refresh_camdp_padron() -> None:
    log.info("refresh_camdp_padron — placeholder")


def main() -> None:
    scheduler = BlockingScheduler(timezone="America/Argentina/Buenos_Aires")
    scheduler.add_job(refresh_camdp_padron, "cron", hour=3, minute=0)
    scheduler.add_job(refresh_mev_stats, "cron", hour=4, minute=0)
    log.info("scheduler arriba")
    scheduler.start()


if __name__ == "__main__":
    main()
