import Link from "next/link";
import { PreviewBadge, PreviewNote } from "../../components/PreviewBadge";

const KPIS = [
  { label: "Casos activos", value: 24, delta: "+3", helper: "este mes" },
  { label: "Consultas del chat", value: 187, delta: "+42%", helper: "vs. mes anterior" },
  { label: "Casos penales tomados", value: 14, delta: "+2", helper: "del chat" },
  { label: "Casos derivados", value: 39, delta: "+7", helper: "no penales, orientados" },
];

type Case = {
  id: string;
  client: string;
  caption: string;
  stage: string;
  next: string;
  owner: string;
  status: "activo" | "audiencia_hoy" | "en_espera";
};

const CASES: Case[] = [
  {
    id: "C-2401",
    client: "J. Pérez",
    caption: "IPP · s/ estafa (art. 172 CP)",
    stage: "Investigación preparatoria",
    next: "Audiencia · hoy 09:30",
    owner: "Dr. Cristian Moix",
    status: "audiencia_hoy",
  },
  {
    id: "C-2394",
    client: "M. R.",
    caption: "IPP · s/ lesiones",
    stage: "Investigación preparatoria",
    next: "Vencimiento plazo · mañana",
    owner: "Dr. Cristian Moix",
    status: "activo",
  },
  {
    id: "C-2388",
    client: "L. G.",
    caption: "Recurso de casación",
    stage: "Ante Cámara de Apelación",
    next: "En estudio",
    owner: "Integrante del equipo",
    status: "en_espera",
  },
  {
    id: "C-2382",
    client: "F. B.",
    caption: "IPP · s/ administración fraudulenta",
    stage: "Investigación preparatoria",
    next: "Testimoniales · miércoles",
    owner: "Integrante del equipo",
    status: "activo",
  },
  {
    id: "C-2377",
    client: "S. P.",
    caption: "Juicio abreviado",
    stage: "Etapa intermedia",
    next: "Audiencia · jueves 11:00",
    owner: "Dr. Cristian Moix",
    status: "activo",
  },
];

type Lead = {
  id: string;
  when: string;
  is_criminal: boolean;
  summary: string;
  status: "nuevo" | "convertido" | "derivado";
};

const LEADS: Lead[] = [
  {
    id: "L-2708",
    when: "hoy · 09:41",
    is_criminal: true,
    summary: "Familiar detenido esta madrugada. Consulta urgente.",
    status: "nuevo",
  },
  {
    id: "L-2707",
    when: "hoy · 08:12",
    is_criminal: false,
    summary: "Despido sin causa. Orientado hacia laboralista.",
    status: "derivado",
  },
  {
    id: "L-2706",
    when: "ayer · 19:28",
    is_criminal: false,
    summary: "Divorcio con hijos menores. Orientado hacia familia.",
    status: "derivado",
  },
  {
    id: "L-2705",
    when: "ayer · 15:03",
    is_criminal: true,
    summary: "Estafa por venta online, quiere hacer denuncia.",
    status: "convertido",
  },
];

const STATUS_COLOR: Record<string, string> = {
  activo: "bg-ink/5 text-ink/70 border-ink/15",
  audiencia_hoy: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  en_espera: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  nuevo: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  convertido: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  derivado: "bg-ink/5 text-ink/50 border-ink/15",
};

const STATUS_LABEL: Record<string, string> = {
  activo: "Activo",
  audiencia_hoy: "Audiencia hoy",
  en_espera: "En espera",
  nuevo: "Nuevo",
  convertido: "Convertido",
  derivado: "Derivado",
};

const TEAM_TASKS = [
  { who: "Dr. Cristian Moix", task: "Preparar alegato para el juicio del jueves", due: "en 2 días" },
  { who: "Integrante del equipo", task: "Redactar recurso de casación C-2388", due: "en 4 días" },
  { who: "Integrante del equipo", task: "Reunión con cliente J. Pérez", due: "hoy 16:00" },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-paper-warm">
      <div className="border-b border-ink/10 bg-paper">
        <div className="container-narrow py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/" className="text-sm text-ink/60 hover:text-ink">← Volver</Link>
            <span className="text-ink/20">/</span>
            <p className="font-serif text-lg text-ink">Panel del estudio — Moix Abogados</p>
            <PreviewBadge label="Vista previa · Fase 2" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-ink/60">Dr. Cristian Moix · titular</span>
          </div>
        </div>
      </div>

      <div className="container-narrow py-8">
        <PreviewNote>
          Panel privado del estudio. Cada abogado del equipo tiene su usuario,
          ve los casos que tiene asignados y edita su perfil público. El titular
          ve toda la operación. En Fase 3 se conecta con el portal del cliente.
        </PreviewNote>

        {/* KPIs */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-2xl border border-ink/10 bg-paper p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{k.label}</p>
              <p className="mt-2 font-serif text-3xl text-ink tabular-nums">{k.value}</p>
              <p className="mt-1 text-xs text-ink/60">
                <span className="text-emerald-700 font-medium">{k.delta}</span> · {k.helper}
              </p>
            </div>
          ))}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          <section>
            {/* Casos activos */}
            <h2 className="font-serif text-xl text-ink">Casos activos</h2>
            <div className="mt-4 rounded-2xl border border-ink/10 bg-paper overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-paper-warm text-xs uppercase tracking-[0.2em] text-ink/50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-normal">Caso</th>
                    <th className="text-left px-4 py-2.5 font-normal hidden md:table-cell">Etapa</th>
                    <th className="text-left px-4 py-2.5 font-normal hidden md:table-cell">A cargo</th>
                    <th className="text-left px-4 py-2.5 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {CASES.map((c) => (
                    <tr key={c.id} className="border-t border-ink/10 hover:bg-paper-warm/50">
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums text-xs text-ink/50">{c.id}</span>
                          <span className="text-[10px] uppercase tracking-wide text-ink/60">
                            · {c.client}
                          </span>
                        </div>
                        <p className="mt-1 text-ink text-sm">{c.caption}</p>
                        <p className="mt-1 text-xs text-ink/50">{c.next}</p>
                      </td>
                      <td className="px-4 py-3 align-top hidden md:table-cell">
                        <span className="text-xs text-ink/70">{c.stage}</span>
                      </td>
                      <td className="px-4 py-3 align-top hidden md:table-cell">
                        <span className="text-xs text-ink/70">{c.owner}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                            (STATUS_COLOR[c.status] ?? STATUS_COLOR.activo)
                          }
                        >
                          {STATUS_LABEL[c.status] ?? c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leads del chat */}
            <div className="mt-8">
              <h2 className="font-serif text-xl text-ink">Leads del chat</h2>
              <p className="mt-1 text-sm text-ink/60">
                Consultas que llegaron por el asistente virtual. Los penales quedan
                en el estudio; los demás se orientan hacia el fuero adecuado.
              </p>
              <ul className="mt-4 space-y-3">
                {LEADS.map((l) => (
                  <li key={l.id} className="rounded-2xl border border-ink/10 bg-paper p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums text-xs text-ink/50">{l.id}</span>
                        <span className="text-[11px] text-ink/50">{l.when}</span>
                        {l.is_criminal ? (
                          <span className="rounded-full bg-ink/5 border border-ink/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink/70">
                            Penal
                          </span>
                        ) : (
                          <span className="rounded-full bg-paper-warm border border-ink/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink/60">
                            No penal
                          </span>
                        )}
                      </div>
                      <span
                        className={
                          "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                          (STATUS_COLOR[l.status] ?? STATUS_COLOR.nuevo)
                        }
                      >
                        {STATUS_LABEL[l.status] ?? l.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink/80">{l.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-6">
            {/* Próximas audiencias */}
            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Agenda semanal</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                    Hoy · 09:30
                  </p>
                  <p className="text-ink mt-0.5">Audiencia J. Pérez</p>
                </li>
                <li>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                    Miércoles · 15:00
                  </p>
                  <p className="text-ink mt-0.5">Testimoniales F. B.</p>
                </li>
                <li>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                    Jueves · 11:00
                  </p>
                  <p className="text-ink mt-0.5">Juicio abreviado S. P.</p>
                </li>
              </ul>
            </div>

            {/* Tareas del equipo */}
            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Tareas del equipo</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {TEAM_TASKS.map((t, i) => (
                  <li key={i}>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                      {t.who}
                    </p>
                    <p className="text-ink/80 mt-0.5">{t.task}</p>
                    <p className="text-xs text-ink/50">Vence {t.due}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Acciones */}
            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Acciones</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <button className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-left text-ink/80 hover:border-ink/30">
                  Sumar abogado al equipo
                </button>
                <button className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-left text-ink/80 hover:border-ink/30">
                  Alta manual de caso
                </button>
                <button className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-left text-ink/80 hover:border-ink/30">
                  Exportar leads (CSV)
                </button>
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-10 text-center text-xs text-ink/50">
          Panel del estudio · Vista previa. Los datos son ilustrativos; los casos
          reales se cargan en Fase 2.
        </p>
      </div>
    </main>
  );
}
