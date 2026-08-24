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

Primarias (obligatorias, base del perfil):

- **CAMDP** — `src/camdp.py` — padrón oficial: matrícula, estado, año de inscripción, datos de contacto. Fuente de verdad.
- **MEV SCBA** — `src/mev.py` — expedientes públicos: volumen, fueros, juzgados frecuentes.

Complementarias (enriquecen, no bloquean publicación):

- **CIJ** — `src/cij.py` — fallos donde el letrado es mencionado.
- **SAIJ** — `src/saij.py` — publicaciones doctrinarias.
- **Prensa local** — `src/prensa.py` — La Capital MdP, 0223, Ahora MdP.
- (extensible: UNMDP/UFASTA/UCA para cargos docentes; LinkedIn público sólo con ToS respetados; Boletín Oficial PBA para designaciones y sanciones; Google Scholar para papers).

## Pipeline

`src/pipeline.py` orquesta:

1. `camdp.lookup_by_bar_number` (o `lookup_by_name`) → si no hay coincidencia, aborta.
2. `mev.stats_by_lawyer_name` → agrega estadística de desempeño.
3. Fuentes complementarias corren en paralelo (`ThreadPoolExecutor`).
4. Devuelve un `LawyerProfileDraft` no publicado.
5. Un admin revisa el draft, obtiene consentimiento del abogado y recién ahí publica.

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
