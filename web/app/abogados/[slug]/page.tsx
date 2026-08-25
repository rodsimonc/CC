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
    { year: "2019", title: "Defensa en la causa Fonapa", detail: "Representación de Carlos Pampillón, líder del Foro Nacional Patriótico." },
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

type MockCase = { year: string; title: string; summary: string; source?: { label: string; href: string } };
type MockPub = { year: string; title: string; venue: string };
type MockStats = {
  total_cases: number;
  years_range: string;
  by_fuero: { name: string; count: number }[];
  top_court: string;
};

const CASES_BY_SLUG: Record<string, MockCase[]> = {
  "cristian-moix": [
    {
      year: "2024",
      title: "Defensa de funcionarios policiales en causa por asociación ilícita",
      summary:
        "Intervención como defensor de un oficial imputado en la causa de asociación ilícita mixta que involucra a policías y particulares en Mar del Plata. El planteo cuestiona el valor probatorio de declaraciones de coimputados frente a las carreras profesionales de los defendidos.",
      source: {
        label: "Infobrisas · MdP",
        href: "https://www.infobrisas.com/noticias/2024/05/09/68564-abogado-de-policias-detenidos-cuestiona-que-se-privilegie-declaraciones-de-presos-frente-a-carreras-intachables",
      },
    },
    {
      year: "2019",
      title: "Defensa de Carlos Pampillón (Foro Nacional Patriótico)",
      summary:
        "Representación del líder del FoNaPa en la causa por hechos vinculados a violencia política en Mar del Plata. Actuación técnica ante el tribunal de juicio, con planteos sobre acuerdos alternativos al debate.",
      source: {
        label: "La Capital MdP",
        href: "https://www.lacapitalmdp.com/temas/cristian-moix/",
      },
    },
    {
      year: "s/f",
      title: "Defensa en caso Viglione — reclamos por inversiones",
      summary:
        "Patrocinio de un imputado en una causa por inversiones fraudulentas con múltiples denunciantes, con declaraciones públicas sobre disposición a responder patrimonialmente.",
      source: {
        label: "La Capital MdP",
        href: "https://www.lacapitalmdp.com/temas/cristian-moix/",
      },
    },
  ],
  "ana-benitez": [
    {
      year: "2023",
      title: "Divorcio con acuerdo integral en mediación",
      summary:
        "Proceso de mediación con acuerdo sobre alimentos, régimen de comunicación y liquidación de bienes. Sin audiencia contenciosa.",
    },
    {
      year: "2022",
      title: "Sucesión con inmuebles en dos jurisdicciones",
      summary:
        "Tramitación conjunta ante juzgados de MdP y CABA, adjudicación de partes y venta coordinada de un inmueble para partir.",
    },
  ],
  "martin-losada": [
    {
      year: "2023",
      title: "Despido sin causa — hotelería estacional",
      summary:
        "Reclamo por despido durante temporada. Sentencia de primera instancia condenatoria por indemnización agravada.",
    },
    {
      year: "2021",
      title: "Accidente in itinere — ART",
      summary:
        "Reclamo contra ART por incapacidad parcial permanente. Cobro del capital y honorarios en menos de un año.",
    },
  ],
  "lucia-ferrari": [
    {
      year: "2024",
      title: "Defensa del consumidor — servicio de telecomunicaciones",
      summary:
        "Acción individual por facturación indebida y suspensión de servicio. Sentencia con daño punitivo.",
    },
    {
      year: "2022",
      title: "Rescisión de contrato inmobiliario",
      summary:
        "Reclamo por incumplimiento y devolución de seña doblada. Acuerdo homologado en audiencia preliminar.",
    },
  ],
};

const PUBS_BY_SLUG: Record<string, MockPub[]> = {
  "cristian-moix": [],
  "ana-benitez": [
    { year: "2022", title: "Mediación familiar: buenas prácticas en el fuero de MdP", venue: "Colegio de Abogados de Mar del Plata" },
  ],
  "martin-losada": [
    { year: "2021", title: "Ley 26.773 y actualización de indemnizaciones", venue: "Errepar · Doctrina Laboral" },
  ],
  "lucia-ferrari": [],
};

const STATS_BY_SLUG: Record<string, MockStats> = {
  "cristian-moix": {
    total_cases: 214,
    years_range: "2010–2025",
    by_fuero: [
      { name: "Penal", count: 168 },
      { name: "Constitucional", count: 26 },
      { name: "Civil", count: 20 },
    ],
    top_court: "Cámara de Apelación en lo Penal de MdP",
  },
  "ana-benitez": {
    total_cases: 302,
    years_range: "2013–2025",
    by_fuero: [
      { name: "Familia", count: 241 },
      { name: "Sucesiones", count: 47 },
      { name: "Civil", count: 14 },
    ],
    top_court: "Juzgado de Familia N° 3 de MdP",
  },
  "martin-losada": {
    total_cases: 187,
    years_range: "2012–2025",
    by_fuero: [
      { name: "Laboral", count: 179 },
      { name: "Civil", count: 8 },
    ],
    top_court: "Tribunal del Trabajo N° 2 de MdP",
  },
  "lucia-ferrari": {
    total_cases: 156,
    years_range: "2016–2025",
    by_fuero: [
      { name: "Civil y comercial", count: 98 },
      { name: "Consumidor", count: 58 },
    ],
    top_court: "Juzgado Civil y Comercial N° 5 de MdP",
  },
};

export default function LawyerPage({ params }: Props) {
  const lawyer = findDemoLawyer(params.slug);
  if (!lawyer) return notFound();
  const timeline = TIMELINES[lawyer.slug] ?? [];
  const cases = CASES_BY_SLUG[lawyer.slug] ?? [];
  const pubs = PUBS_BY_SLUG[lawyer.slug] ?? [];
  const stats = STATS_BY_SLUG[lawyer.slug];

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

  const totalFueroCases = stats?.by_fuero.reduce((s, f) => s + f.count, 0) ?? 0;

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

          {/* Desempeño judicial — MEV SCBA (Fase 2) */}
          {stats && (
            <section className="mt-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-serif text-2xl text-ink">Desempeño en tribunales de MdP</h2>
                <PreviewBadge />
              </div>
              <PreviewNote>
                Estadística agregada de expedientes públicos del letrado, extraída
                automáticamente de la <strong>MEV SCBA</strong> (Mesa de Entradas
                Virtual de la Suprema Corte de Buenos Aires) y actualizada cada
                noche. Los datos que ves acá son ilustrativos.
              </PreviewNote>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-ink/10 bg-paper p-5">
                  <p className="text-xs uppercase tracking-widest text-ink/50">Causas indexadas</p>
                  <p className="mt-2 font-serif text-3xl text-ink">{stats.total_cases}</p>
                  <p className="mt-1 text-xs text-ink/60">Período {stats.years_range}</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-paper p-5 sm:col-span-2">
                  <p className="text-xs uppercase tracking-widest text-ink/50">Distribución por fuero</p>
                  <ul className="mt-3 space-y-2">
                    {stats.by_fuero.map((f) => {
                      const pct = totalFueroCases > 0 ? Math.round((f.count / totalFueroCases) * 100) : 0;
                      return (
                        <li key={f.name}>
                          <div className="flex items-center justify-between text-sm text-ink/80">
                            <span>{f.name}</span>
                            <span className="tabular-nums text-ink/60">
                              {f.count} · {pct}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-ink/5 overflow-hidden">
                            <div
                              className="h-full bg-ink/70"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-ink/10 bg-paper-warm px-4 py-3">
                <p className="text-xs uppercase tracking-widest text-ink/50">Juzgado con mayor actividad</p>
                <p className="mt-1 text-ink font-medium">{stats.top_court}</p>
              </div>
            </section>
          )}

          {/* Casos destacados */}
          {cases.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-serif text-2xl text-ink">Casos destacados</h2>
                {!cases.every((c) => c.source) && <PreviewBadge />}
              </div>
              {cases.every((c) => c.source) ? (
                <p className="mt-2 text-sm text-ink/60">
                  Selección de intervenciones profesionales con cobertura pública.
                  Enlace a la fuente en cada caso.
                </p>
              ) : (
                <PreviewNote>
                  Cada abogado va a cargar sus propios casos (anonimizados) desde el
                  panel privado. Estos ejemplos son ilustrativos.
                </PreviewNote>
              )}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {cases.map((c, i) => (
                  <article key={i} className="rounded-2xl border border-ink/10 bg-paper p-5">
                    <p className="text-xs uppercase tracking-widest text-ink/50">{c.year}</p>
                    <h3 className="mt-1 font-serif text-lg text-ink">{c.title}</h3>
                    <p className="mt-2 text-sm text-ink/75 leading-relaxed">{c.summary}</p>
                    {c.source && (
                      <a
                        href={c.source.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-3 inline-flex items-center gap-1 text-xs text-ink/60 underline underline-offset-2 hover:text-ink"
                      >
                        Fuente: {c.source.label} ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Publicaciones (mock ilustrativo — SAIJ + Google Scholar) */}
          <section className="mt-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-serif text-2xl text-ink">Publicaciones</h2>
              <PreviewBadge />
            </div>
            <PreviewNote>
              Se indexan automáticamente desde <strong>SAIJ</strong> y{" "}
              <strong>Google Scholar</strong>. Cada publicación va con enlace a la
              fuente original.
            </PreviewNote>
            {pubs.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {pubs.map((p, i) => (
                  <li key={i} className="rounded-xl border border-ink/10 bg-paper p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-serif text-base text-ink">{p.title}</p>
                      <span className="text-xs text-ink/50 tabular-nums">{p.year}</span>
                    </div>
                    <p className="text-xs text-ink/60 mt-1">{p.venue}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink/60 italic">
                Sin publicaciones indexadas hasta el momento.
              </p>
            )}
          </section>
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
