import Link from "next/link";
import { PreviewBadge, PreviewNote } from "../../components/PreviewBadge";

const TIMELINE = [
  {
    when: "Hoy · 09:30",
    kind: "Audiencia",
    title: "Audiencia de formalización",
    detail: "Sala 3 · Juzgado de Garantías Nº 4.",
    status: "próximo",
  },
  {
    when: "Ayer · 18:12",
    kind: "Escrito",
    title: "Presentación de pruebas testimoniales",
    detail: "El estudio presentó el listado de testigos. Documento firmado.",
    status: "listo",
  },
  {
    when: "Hace 3 días",
    kind: "Notificación",
    title: "Resolución sobre medida cautelar",
    detail: "El juzgado resolvió mantener la medida vigente hasta la próxima audiencia.",
    status: "leído",
  },
  {
    when: "Hace 1 semana",
    kind: "Documento",
    title: "Firma del poder para representación",
    detail: "Poder especial firmado electrónicamente por el cliente.",
    status: "firmado",
  },
];

const DOCS_PENDING = [
  { title: "DNI (ambas caras)", note: "Foto legible del documento." },
  { title: "Constancia de domicilio", note: "Servicio a tu nombre, últimos 3 meses." },
];

const STATUS_COLOR: Record<string, string> = {
  próximo: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  listo: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  leído: "bg-ink/5 text-ink/50 border-ink/15",
  firmado: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
};

export default function MiCasoPage() {
  return (
    <main className="min-h-screen bg-paper-warm">
      <div className="border-b border-ink/10 bg-paper">
        <div className="container-narrow py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/" className="text-sm text-ink/60 hover:text-ink">← Volver</Link>
            <span className="text-ink/20">/</span>
            <p className="font-serif text-lg text-ink">Mi caso · Estudio Moix Abogados</p>
            <PreviewBadge label="Vista previa · Fase 3" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-ink/60">Sesión activa · Juan Pérez</span>
          </div>
        </div>
      </div>

      <div className="container-narrow py-8">
        <PreviewNote>
          Portal privado del <strong>cliente</strong> que contrata al estudio. Cada
          cliente accede con un enlace de invitación y ve solo el caso donde es
          parte. Los datos que ves son ilustrativos.
        </PreviewNote>

        {/* Encabezado del caso */}
        <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Causa</p>
              <h1 className="mt-1 font-serif text-2xl text-ink">
                Investigación penal preparatoria · caratulada s/ estafa
              </h1>
              <p className="mt-1 text-sm text-ink/60">
                Fiscalía Nº 5 · Departamento Judicial Mar del Plata
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Etapa de investigación
            </span>
          </div>
          <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Abogado a cargo</dt>
              <dd className="mt-1 text-ink/80">Dr. Cristian Moix</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Iniciada</dt>
              <dd className="mt-1 text-ink/80">15 de mayo de 2026</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Próxima audiencia</dt>
              <dd className="mt-1 text-ink/80">Hoy, 09:30</dd>
            </div>
          </dl>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          {/* Actividad del caso */}
          <section>
            <h2 className="font-serif text-xl text-ink">Avance del caso</h2>
            <ol className="mt-5 relative border-l border-ink/15 pl-6 space-y-6">
              {TIMELINE.map((t, i) => (
                <li key={i}>
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-gold border border-ink/20" />
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                        {t.when} · {t.kind}
                      </p>
                      <p className="mt-1 font-serif text-lg text-ink">{t.title}</p>
                    </div>
                    <span
                      className={
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                        (STATUS_COLOR[t.status] ?? STATUS_COLOR["leído"])
                      }
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink/70">{t.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Consultá al asistente interno */}
            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-serif text-lg text-ink">Asistente del caso</h3>
                <PreviewBadge label="IA · Fase 3" />
              </div>
              <p className="mt-2 text-sm text-ink/70">
                Preguntá lo que necesites entender: qué significa un tecnicismo,
                cómo prepararte para una audiencia, qué documento falta. El
                asistente responde con contexto de tu caso.
              </p>
              <div className="mt-3 rounded-xl border border-dashed border-ink/20 bg-paper-warm/60 px-3 py-2 text-xs text-ink/50">
                "¿Qué debo llevar mañana a la audiencia?"
              </div>
            </div>

            {/* Documentación pendiente */}
            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Documentación pendiente</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {DOCS_PENDING.map((d, i) => (
                  <li key={i} className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-ink">{d.title}</p>
                      <span className="text-[10px] uppercase tracking-wide text-amber-700">
                        Falta
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink/60">{d.note}</p>
                    <button className="mt-2 rounded-lg border border-ink/15 bg-paper px-3 py-1.5 text-xs text-ink/80 hover:border-ink/30">
                      Subir archivo
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notificaciones */}
            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Notificaciones</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">Email</span>
                  <span className="text-emerald-700 font-medium">activadas</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">WhatsApp</span>
                  <span className="text-emerald-700 font-medium">activadas</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">Firma electrónica</span>
                  <span className="text-emerald-700 font-medium">configurada</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <p className="mt-10 text-center text-xs text-ink/50">
          Portal del cliente · Vista previa. En producción, cada cliente accede con
          un enlace personal y ve solo su caso.
        </p>
      </div>
    </main>
  );
}
