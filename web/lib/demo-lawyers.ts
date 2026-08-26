import type { Lawyer } from "./api";

// El sitio corresponde al Estudio Moix Abogados (todo el equipo es penalista).
// Único perfil con datos verificables públicamente: Dr. Cristian Moix.
// El resto del equipo se completa desde el panel privado en Fase 2.
export const DEMO_LAWYERS: Lawyer[] = [
  {
    slug: "cristian-moix",
    full_name: "Dr. Cristian Moix",
    bar_number: "CAMDP · matrícula activa",
    bar_status: "active",
    practice_areas: ["penal"],
    headline: "Abogado penalista · Titular del Estudio Moix Abogados",
    bio: "Abogado dedicado al ejercicio de la defensa penal en el Departamento Judicial Mar del Plata. Titular y fundador del Estudio Moix Abogados. Su práctica se centra en causas de complejidad ante los tribunales del fuero penal bonaerense, con actuación regular en instancias de apelación.",
    city: "Mar del Plata",
    photo_url: null,
    email: "contacto@moixabogados.com.ar",
    phone: null,
    practice_details: [
      {
        title: "Defensa técnica en el fuero penal",
        detail:
          "Representación en todas las etapas del proceso: investigación penal preparatoria, juicio oral y recursos.",
      },
      {
        title: "Recursos y garantías",
        detail:
          "Planteos ante la Cámara de Apelación y Garantías en lo Penal del Departamento Judicial Mar del Plata.",
      },
      {
        title: "Asesoramiento previo",
        detail:
          "Análisis de situación procesal y estrategia de defensa desde el primer contacto con el sistema penal.",
      },
    ],
    mentions: [
      {
        year: "2024",
        title:
          "Abogado de policías detenidos cuestiona que se privilegie declaraciones de presos frente a carreras intachables",
        outlet: "Infobrisas",
        url: "https://www.infobrisas.com/noticias/2024/05/09/68564-abogado-de-policias-detenidos-cuestiona-que-se-privilegie-declaraciones-de-presos-frente-a-carreras-intachables",
        snippet:
          "Actuación profesional como defensor técnico. Declaraciones sobre estándares probatorios en causas complejas.",
      },
      {
        year: "s/f",
        title:
          "Pampillón sin juicio: el Tribunal fundamentó que no puede interceder en un acuerdo entre partes",
        outlet: "La Capital MdP",
        url: "https://www.lacapitalmdp.com/temas/cristian-moix/",
        snippet:
          "Cobertura de una causa penal en la que intervino como defensor, con planteos sobre soluciones alternativas al debate.",
      },
      {
        year: "s/f",
        title:
          "Su abogado dijo que Viglione está dispuesto a responder con su patrimonio",
        outlet: "La Capital MdP",
        url: "https://www.lacapitalmdp.com/temas/cristian-moix/",
        snippet:
          "Declaraciones profesionales publicadas en la prensa local en el marco de una causa comercial-penal.",
      },
    ],
    links: [
      {
        title: "Estudio Moix Abogados en Instagram",
        outlet: "Instagram",
        url: "https://www.instagram.com/moixabogados/",
        snippet: "Cuenta institucional del estudio.",
      },
    ],
  },
];

export function findDemoLawyer(slug: string): Lawyer | undefined {
  return DEMO_LAWYERS.find((l) => l.slug === slug);
}

// El equipo del estudio, mostrado como placeholders hasta que cada integrante
// cargue su perfil desde el panel privado. Sin nombres inventados.
export const TEAM_PLACEHOLDERS = [
  { role: "Abogado penalista", note: "Segundo titular del estudio" },
  { role: "Abogado penalista", note: "Miembro del equipo" },
  { role: "Abogado penalista", note: "Miembro del equipo" },
];
