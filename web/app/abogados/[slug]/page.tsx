import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { LawyerHero } from "../../../components/LawyerHero";
import { Timeline, type TimelineItem } from "../../../components/Timeline";
import { BookingCalendar } from "../../../components/BookingCalendar";
import { PreviewBadge, PreviewNote } from "../../../components/PreviewBadge";
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
    { year: "Ejercicio", title: "Estudio Moix Abogados", detail: "Titular del estudio en Mar del Plata, con foco en derecho penal." },
    { year: "2019", title: "Defensa en la causa FoNaPa", detail: "Representación de Carlos Pampillón, líder del Foro Nacional Patriótico." },
    { year: "2024", title: "Defensa de personal policial imputado", detail: "Intervención en causas por asociación ilícita mixta con funcionarios policiales." },
    { year: "Hoy", title: "Referente penalista de la red", detail: "Orienta a la red de abogados asociados a Moix Legal." },
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
  const mentions = lawyer.mentions ?? [];

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

          {/* Menciones en medios — solo si hay data verificable */}
          {mentions.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl text-ink">Menciones en medios</h2>
              <p className="mt-2 text-sm text-ink/60">
                Notas de prensa donde el letrado interviene o es citado profesionalmente.
                Enlace a la fuente en cada mención.
              </p>
              <ul className="mt-5 space-y-3">
                {mentions.map((m, i) => (
                  <li key={i} className="rounded-2xl border border-ink/10 bg-paper p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-xs uppercase tracking-widest text-ink/50">
                        {m.outlet}
                      </p>
                      <span className="text-xs text-ink/50 tabular-nums">{m.year ?? ""}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg text-ink leading-snug">
                      {m.title}
                    </h3>
                    {m.snippet && (
                      <p className="mt-2 text-sm text-ink/75 leading-relaxed">{m.snippet}</p>
                    )}
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-ink/60 underline underline-offset-2 hover:text-ink"
                    >
                      Leer nota original ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Casos destacados — cada abogado los carga en Fase 3 (opcional) */}
          {mentions.length === 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-serif text-2xl text-ink">Casos y experiencia</h2>
                <PreviewBadge label="Vista previa · Fase 3" />
              </div>
              <PreviewNote>
                Cada abogado va a poder cargar sus propios casos representativos
                (anonimizados) y experiencia relevante desde el panel privado.
                Publicación con consentimiento explícito.
              </PreviewNote>
            </section>
          )}
        </div>

        <aside id="agendar" className="md:sticky md:top-8">
          <div className="rounded-2xl border border-ink/10 bg-paper-warm p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-widest text-ink/50">Agendar consulta</p>
              <PreviewBadge label="Preview" />
            </div>
            <p className="mt-2 font-serif text-lg text-ink">Con {lawyer.full_name}</p>
            <p className="mt-1 text-sm text-ink/60">Primera orientación, sin compromiso.</p>
            <div className="mt-4">
              <BookingCalendar lawyerSlug={lawyer.slug} />
            </div>
            <p className="mt-3 text-[11px] text-ink/60 leading-relaxed">
              En Fase 2 el calendario se conecta al{" "}
              <strong>Cal.com</strong> propio del abogado, con sus horarios reales
              y confirmación por email/WhatsApp.
            </p>
          </div>
        </aside>
      </div>

      <footer className="border-t border-ink/10 py-8 text-center text-xs text-ink/50">
        Este sitio no constituye asesoramiento legal. Referido por la red del Dr. Moix.
      </footer>
    </main>
  );
}
