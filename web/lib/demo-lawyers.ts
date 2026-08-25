import type { Lawyer } from "./api";

// Perfiles para Fase 1 (MVP visual) cuando la API no está corriendo.
export const DEMO_LAWYERS: Lawyer[] = [
  {
    slug: "cristian-moix",
    full_name: "Dr. Cristian Moix",
    bar_number: "CAMDP · matrícula activa",
    bar_status: "active",
    practice_areas: ["penal"],
    headline: "Abogado penalista. Titular del estudio Moix Abogados en Mar del Plata.",
    bio: "Abogado penalista con ejercicio en Mar del Plata. Titular del estudio Moix Abogados. Defensor en causas de alto perfil del fuero penal marplatense —incluidas causas por asociación ilícita, delitos contra el orden constitucional y defensa de funcionarios policiales imputados—, con intervención habitual en la Cámara de Apelación en lo Penal local.",
    city: "Mar del Plata",
    photo_url: null,
    email: "contacto@moixabogados.com.ar",
    phone: null,
    mentions: [
      {
        year: "2024",
        title:
          "Abogado de policías detenidos cuestiona que se privilegie declaraciones de presos frente a carreras intachables",
        outlet: "Infobrisas",
        url: "https://www.infobrisas.com/noticias/2024/05/09/68564-abogado-de-policias-detenidos-cuestiona-que-se-privilegie-declaraciones-de-presos-frente-a-carreras-intachables",
        snippet:
          "Defensa de personal policial imputado en la causa de asociación ilícita mixta en Mar del Plata.",
      },
      {
        year: "s/f",
        title:
          "Pampillón sin juicio: el Tribunal fundamentó que no puede interceder en un acuerdo entre partes",
        outlet: "La Capital MdP",
        url: "https://www.lacapitalmdp.com/temas/cristian-moix/",
        snippet:
          "Intervención en la causa por hechos vinculados al FoNaPa, con acuerdos alternativos al debate.",
      },
      {
        year: "s/f",
        title:
          "Su abogado dijo que Viglione está dispuesto a responder con su patrimonio",
        outlet: "La Capital MdP",
        url: "https://www.lacapitalmdp.com/temas/cristian-moix/",
        snippet:
          "Defensa técnica en una causa de inversiones fraudulentas, con planteos sobre patrimonio del imputado.",
      },
    ],
    links: [
      {
        title: "Estudio Moix Abogados en Instagram",
        outlet: "Instagram",
        url: "https://www.instagram.com/moixabogados/",
        snippet: "Novedades del estudio, casos y actividad profesional en Mar del Plata.",
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
