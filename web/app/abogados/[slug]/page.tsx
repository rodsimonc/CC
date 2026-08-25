import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { LawyerHero } from "../../../components/LawyerHero";
import { Timeline, type TimelineItem } from "../../../components/Timeline";
import { BookingCalendar } from "../../../components/BookingCalendar";
import { DEMO_LAWYERS, findDemoLawyer } from "../../../lib/demo-lawyers";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return DEMO_LAWYERS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const lawyer = findDemoLawyer(params.slug);
  if (!lawyer) return { title: "Abogado no encontrado" };
  return {
    title: `${lawyer.full_name}`,
    description: lawyer.headline ?? `Perfil profesional de ${lawyer.full_name} en Mar del Plata.`,
  };
}

const TIMELINES: Record<string, TimelineItem[]> = {
  "cristian-moix": [
    { year: "1998", title: "Ingreso a la matrícula del CAMDP", detail: "Inicio del ejercicio profesional en Mar del Plata." },
    { year: "2005", title: "Titular de cátedra", detail: "Docente titular de Derecho Penal en universidad local." },
    { year: "2015", title: "Rectorado universitario", detail: "Ejerció como rector durante un mandato." },
    { year: "Hoy", title: "Referente de la red", detail: "Cura y orienta la red Moix Legal." },
  ],
  "ana-benitez": [
    { year: "2012", title: "Ingreso a la matrícula del CAMDP" },
    { year: "2016", title: "Mediadora inscripta", detail: "Formación en mediación y procesos colaborativos." },
    { year: "Hoy", title: "Especializada en familia", detail: "Divorcios, alimentos, sucesiones." },
  ],
  "martin-losada": [
    { year: "2010", title: "Ingreso a la matrícula del CAMDP" },
    { year: "Hoy", title: "Representación de trabajadores", detail: "Despidos, ART, reclamos individuales." },
  ],
  "lucia-ferrari": [
    { year: "2015", title: "Ingreso a la matrícula del CAMDP" },
    { year: "Hoy", title: "Civil, comercial y consumidor", detail: "Contratos, daños, defensa del consumidor." },
  ],
};

export default function LawyerPage({ params }: Props) {
  const lawyer = findDemoLawyer(params.slug);
  if (!lawyer) return notFound();
  const timeline = TIMELINES[lawyer.slug] ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Attorney",
    name: lawyer.full_name,
    description: lawyer.bio,
    address: {
      "@type": "PostalAddress",
      addressLocality: lawyer.city ?? "Mar del Plata",
      addressCountry: "AR",
    },
    knowsAbout: lawyer.practice_areas,
    memberOf: { "@type": "Organization", name: "Colegio de Abogados de Mar del Plata" },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-narrow pt-6">
        <Link href="/" className="text-sm text-ink/60 hover:text-ink">← Volver</Link>
      </div>
      <LawyerHero lawyer={lawyer} />

      <div className="container-narrow pb-16 grid gap-10 md:grid-cols-[1fr_320px] items-start">
        <div>
          {lawyer.bio && (
            <section>
              <h2 className="font-serif text-2xl text-ink">Trayectoria y enfoque</h2>
              <p className="mt-3 text-ink/75 leading-relaxed">{lawyer.bio}</p>
            </section>
          )}

          {timeline.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl text-ink">Recorrido</h2>
              <div className="mt-5">
                <Timeline items={timeline} />
              </div>
            </section>
          )}

        </div>

        <aside id="agendar" className="md:sticky md:top-8">
          <div className="rounded-2xl border border-ink/10 bg-paper-warm p-5">
            <p className="text-xs uppercase tracking-widest text-ink/50">Agendar consulta</p>
            <p className="mt-2 font-serif text-lg text-ink">Con {lawyer.full_name}</p>
            <p className="mt-1 text-sm text-ink/60">Primera orientación, sin compromiso.</p>
            <div className="mt-4">
              <BookingCalendar lawyerSlug={lawyer.slug} />
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-ink/10 py-8 text-center text-xs text-ink/50">
        Este sitio no constituye asesoramiento legal. Referido por la red del Dr. Moix.
      </footer>
    </main>
  );
}
