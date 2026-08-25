import type { Lawyer } from "./api";

// Perfiles para Fase 1 (MVP visual) cuando la API no está corriendo.
export const DEMO_LAWYERS: Lawyer[] = [
  {
    slug: "cristian-moix",
    full_name: "Dr. Cristian Moix",
    bar_number: "CAMDP · matrícula activa",
    bar_status: "active",
    practice_areas: ["penal"],
    headline: "Abogado penalista · Estudio propio en Mar del Plata",
    bio: "Abogado dedicado al ejercicio de la defensa penal en el Departamento Judicial Mar del Plata. Titular y fundador del estudio Moix Abogados. Su práctica se centra en causas de complejidad ante los tribunales del fuero penal bonaerense, con actuación regular en instancias de apelación.",
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
  {
    slug: "ana-benitez",
    full_name: "Dra. Ana Benítez",
    bar_number: "CAMDP T° VII F° 812",
    bar_status: "active",
    practice_areas: ["familia", "sucesiones"],
    headline: "Familia, divorcios y sucesiones. Enfoque colaborativo.",
    bio: "Doce años ejerciendo en el fuero de familia de Mar del Plata. Especializada en mediación y procesos colaborativos.",
    city: "Mar del Plata",
  },
  {
    slug: "martin-losada",
    full_name: "Dr. Martín Losada",
    bar_number: "CAMDP T° V F° 431",
    bar_status: "active",
    practice_areas: ["laboral"],
    headline: "Derecho laboral. Representación de trabajadores.",
    bio: "Representación de trabajadores en despidos, accidentes y reclamos individuales. Trayectoria en juicios ante los tribunales del trabajo de MdP.",
    city: "Mar del Plata",
  },
  {
    slug: "lucia-ferrari",
    full_name: "Dra. Lucía Ferrari",
    bar_number: "CAMDP T° IX F° 1024",
    bar_status: "active",
    practice_areas: ["civil", "comercial", "consumidor"],
    headline: "Civil y comercial. Defensa del consumidor.",
    bio: "Contratos, defensa del consumidor, daños y perjuicios. Enfoque práctico y directo.",
    city: "Mar del Plata",
  },
];

export function findDemoLawyer(slug: string): Lawyer | undefined {
  return DEMO_LAWYERS.find((l) => l.slug === slug);
}
