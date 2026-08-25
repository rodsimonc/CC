# scrapers/ — Jobs de datos públicos

Servicio Python que arma perfiles a partir de fuentes públicas verificables y los deja en estado `draft` para curación humana. Sin coincidencia en el padrón del CAMDP, el perfil no se publica bajo ningún concepto.

## Requisitos

- Python **3.11+**
- pip

## Puesta en marcha

```bash
cd scrapers
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

En Fase 2, si se usan páginas con JavaScript pesado, descomentar `playwright` en `requirements.txt` y correr:

```bash
python -m playwright install --with-deps chromium
```

## Fuentes

Primarias (activas):

- **CAMDP** — `src/camdp.py` — padrón oficial: matrícula, estado, año de inscripción. Fuente de verdad.
- **Prensa local** — `src/prensa.py` — La Capital MdP, Infobrisas, 0223, Ahora MdP. Indexación de menciones donde el letrado interviene profesionalmente.

Descartadas tras evaluación:

- **MEV SCBA** — `src/mev.py` — requiere credenciales personales del letrado y el fuero penal está restringido a las partes. No puede consultarse sin autenticación ni cederse cuentas por ToS de la SCBA. Si un abogado quiere mostrar estadística judicial, la carga él mismo desde el panel privado con su respaldo.
- **CIJ** — `src/cij.py` — el Centro de Información Judicial fue **discontinuado por la CSJN en mayo 2025** (Acordada 10/2025). Si más adelante se estabiliza el reemplazo, se re-evalúa.
- **SAIJ** — `src/saij.py` — el portal aplica bot protection al scraping directo. Se cita puntualmente cuando el abogado aporta el enlace.

## Pipeline

`src/pipeline.py` orquesta:

1. `camdp.lookup_by_bar_number` (o `lookup_by_name`) → si no hay coincidencia, aborta.
2. `prensa.mentions` → indexa menciones recientes del letrado en medios locales.
3. Devuelve un `LawyerProfileDraft` no publicado.
4. Un admin revisa el draft, obtiene consentimiento del abogado y recién ahí publica.

Los módulos `mev.py`, `cij.py` y `saij.py` quedan como scaffolds sin implementación por las razones documentadas más arriba.

## Scripts

| Comando | Qué hace |
|---------|----------|
| `python -m src.pipeline` | (Fase 2) ejecuta el pipeline para un nombre o matrícula |
| `python schedule.py` | Cron interno; scheduler bloqueante |

## Cumplimiento

- Solo datos **públicos**.
- **Ley 25.326**: opt-out visible en cada perfil listado sin consentimiento previo (implementado en `web/`).
- **Consentimiento explícito** obligatorio antes de publicar.
- **Throttling** por fuente (`CAMDP_THROTTLE_MS`, `MEV_THROTTLE_MS`).
- **Respeto a `robots.txt`** y ToS de cada sitio.
- **User-Agent identificable** con contacto de responsable.
- **Cache local** con TTL para no golpear las fuentes.

Ver `docs/LEGAL-COMPLIANCE.md` para el detalle regulatorio.

## Estructura

```
scrapers/
├── src/
│   ├── config.py
│   ├── models.py
│   ├── camdp.py
│   ├── mev.py
│   ├── cij.py
│   ├── saij.py
│   ├── prensa.py
│   └── pipeline.py
├── schedule.py
├── requirements.txt
└── .env.example
```
