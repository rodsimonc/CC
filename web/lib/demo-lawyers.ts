import type { Lawyer } from "./api";

// Perfiles para Fase 1 (MVP visual) cuando la API no está corriendo.
export const DEMO_LAWYERS: Lawyer[] = [
  {
    slug: "cristian-moix",
    full_name: "Dr. Cristian Moix",
    bar_number: "CAMDP T° I F° 245",
    bar_status: "active",
    practice_areas: ["penal", "academico"],
    headline: "Abogado penalista. Ex rector universitario. Docente.",
    bio: "Especialista en derecho penal con más de 25 años de trayectoria en Mar del Plata. Ex rector universitario y docente titular de Derecho Penal. Referente en la orientación de casos de complejidad y en la formación de generaciones de abogados de la ciudad.",
    city: "Mar del Plata",
    photo_url: null,
    email: "contacto@moixlegal.com.ar",
    phone: null,
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
