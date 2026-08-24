import { lawyersRepo } from '../repositories/lawyers.repo.js';

const AREA_ALIASES = {
  penal: ['penal', 'delito', 'detencion', 'imputacion'],
  laboral: ['laboral', 'despido', 'trabajo', 'ART'],
  familia: ['familia', 'divorcio', 'alimentos', 'tenencia'],
  civil: ['civil', 'contrato', 'daños', 'reclamo'],
  comercial: ['comercial', 'sociedad', 'quiebra'],
  sucesiones: ['sucesion', 'herencia', 'testamento'],
  consumidor: ['consumidor', 'defensa'],
};

export function detectArea(text) {
  const norm = text.toLowerCase();
  for (const [area, kws] of Object.entries(AREA_ALIASES)) {
    if (kws.some((k) => norm.includes(k))) return area;
  }
  return null;
}

export function recommendLawyers({ area, limit = 3 }) {
  const rows = lawyersRepo.listPublished({ area, limit });
  return rows.map((r) => ({
    slug: r.slug,
    full_name: r.full_name,
    headline: r.headline,
    reason: buildReason(r, area),
  }));
}

function buildReason(lawyer, area) {
  const areas = JSON.parse(lawyer.practice_areas ?? '[]');
  if (area && areas.includes(area)) {
    return `Especialidad declarada en ${area}. ${lawyer.headline ?? ''}`.trim();
  }
  return lawyer.headline ?? 'Profesional matriculado en Mar del Plata.';
}
