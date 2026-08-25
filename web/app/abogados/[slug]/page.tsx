import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { LawyerHero } from "../../../components/LawyerHero";
import { BookingCalendar } from "../../../components/BookingCalendar";
import { PreviewBadge, PreviewNote } from "../../../components/PreviewBadge";
import {
  LinkPreviewCard,
  LinkPreviewSkeleton,
} from "../../../components/LinkPreviewCard";
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

const MENTIONS_EXAMPLE = [
  {
    outlet: "La Capital MdP",
    title: "Ejemplo · nota de prensa donde el abogado interviene profesionalmente",
    snippet:
      "Cuando el abogado agrega el enlace desde su panel, aparece esta tarjeta con el logo del medio, el título y una bajada.",
  },
  {
    outlet: "Infobrisas",
    title: "Ejemplo · declaraciones profesionales publicadas en prensa local",
    snippet:
      "El sistema toma la previsualización del enlace pegado por el abogado.",
  },
];

const LINKS_EXAMPLE = [
  {
    outlet: "LinkedIn",
    title: "Ejemplo · perfil profesional en LinkedIn",
    snippet:
      "Espacio para perfiles públicos y presencia institucional del abogado.",
  },
  {
    outlet: "Publicación",
    title: "Ejemplo · artículo doctrinario o columna en un medio jurídico",
    snippet:
      "También sirve para publicaciones propias, sentencias comentadas o entrevistas.",
  },
];

export default function LawyerPage({ params }: Props) {
  const lawyer = findDemoLawyer(params.slug);
  if (!lawyer) return notFound();

  const practice = lawyer.practice_details ?? [];
  const education = lawyer.education ?? [];
  const mentions = lawyer.mentions ?? [];
  const links = lawyer.links ?? [];

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
              <h2 className="font-serif text-2xl text-ink">Perfil profesional</h2>
              <p className="mt-3 text-ink/80 leading-relaxed text-[15px]">{lawyer.bio}</p>
            </section>
          )}

          {/* Práctica profesional */}
          <section className="mt-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-serif text-2xl text-ink">Práctica profesional</h2>
              {practice.length === 0 && <PreviewBadge label="Vista previa · Fase 3" />}
            </div>
            {practice.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {practice.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-ink/10 bg-paper p-5">
                    <h3 className="font-serif text-base text-ink">{p.title}</h3>
                    {p.detail && (
                      <p className="mt-2 text-sm text-ink/70 leading-relaxed">{p.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <PreviewNote>
                Cada abogado detalla las áreas y tipo de trabajo que desarrolla,
                desde el panel privado.
              </PreviewNote>
            )}
          </section>

          {/* Formación */}
          <section className="mt-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-serif text-2xl text-ink">Formación</h2>
              {education.length === 0 && <PreviewBadge label="Vista previa · Fase 3" />}
            </div>
            {education.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {education.map((e, i) => (
                  <li key={i} className="rounded-xl border border-ink/10 bg-paper p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-serif text-base text-ink">{e.title}</p>
                      {e.year && (
                        <span className="text-xs text-ink/50 tabular-nums">{e.year}</span>
                      )}
                    </div>
                    {e.institution && (
                      <p className="mt-1 text-sm text-ink/60">{e.institution}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <PreviewNote>
                Título de grado, posgrados y cursos relevantes. Los carga el
                propio abogado desde el panel privado.
              </PreviewNote>
            )}
          </section>

          {/* Menciones en medios */}
          <section className="mt-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-serif text-2xl text-ink">Menciones en medios</h2>
              {mentions.length === 0 && <PreviewBadge label="Vista previa · Fase 3" />}
            </div>
            {mentions.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-ink/60">
                  Notas de prensa donde el letrado interviene profesionalmente.
                  Enlace directo a la fuente en cada tarjeta.
                </p>
                <ul className="mt-5 space-y-3">
                  {mentions.map((m, i) => (
                    <li key={i}>
                      <LinkPreviewCard item={m} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <PreviewNote>
                  El abogado pega el link a cada nota y el sitio arma esta
                  previsualización con logo del medio, título y bajada.
                </PreviewNote>
                <div className="mt-4 space-y-3">
                  {MENTIONS_EXAMPLE.map((m, i) => (
                    <LinkPreviewSkeleton key={i} outlet={m.outlet} title={m.title} snippet={m.snippet} />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Enlaces destacados del propio abogado */}
          <section className="mt-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-serif text-2xl text-ink">Enlaces destacados</h2>
              {links.length === 0 && <PreviewBadge label="Vista previa · Fase 3" />}
            </div>
            {links.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-ink/60">
                  Perfiles institucionales y publicaciones seleccionadas por el letrado.
                </p>
                <ul className="mt-5 space-y-3">
                  {links.map((l, i) => (
                    <li key={i}>
                      <LinkPreviewCard item={l} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <PreviewNote>
                  Espacio para perfiles públicos, publicaciones propias, columnas
                  en medios y sentencias comentadas.
                </PreviewNote>
                <div className="mt-4 space-y-3">
                  {LINKS_EXAMPLE.map((l, i) => (
                    <LinkPreviewSkeleton key={i} outlet={l.outlet} title={l.title} snippet={l.snippet} />
                  ))}
                </div>
              </>
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
              y confirmación por email o WhatsApp.
            </p>
          </div>

          {lawyer.email && (
            <div className="mt-4 rounded-2xl border border-ink/10 bg-paper p-5">
              <p className="text-xs uppercase tracking-widest text-ink/50">Contacto</p>
              <a
                href={`mailto:${lawyer.email}`}
                className="mt-2 block text-sm text-ink hover:text-ink-soft underline underline-offset-2"
              >
                {lawyer.email}
              </a>
              {lawyer.city && (
                <p className="mt-1 text-xs text-ink/60">{lawyer.city}, Argentina</p>
              )}
            </div>
          )}
        </aside>
      </div>

      <footer className="border-t border-ink/10 py-8 text-center text-xs text-ink/50">
        Este sitio no constituye asesoramiento legal. Referido por la red del Dr. Moix.
      </footer>
    </main>
  );
}
