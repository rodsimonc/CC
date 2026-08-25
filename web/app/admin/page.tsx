import Link from "next/link";
import { PreviewBadge, PreviewNote } from "../../components/PreviewBadge";

type Lead = {
  id: string;
  when: string;
  area: string;
  urgency: "low" | "medium" | "high" | "urgent";
  summary: string;
  contact: string;
  lawyer: string;
  status: "nuevo" | "contactado" | "agendado" | "cerrado";
};

const KPIS = [
  { label: "Leads este mes", value: 47, delta: "+18%", helper: "vs. mes anterior" },
  { label: "Consultas del chat", value: 312, delta: "+42%", helper: "sesiones únicas" },
  { label: "Turnos agendados", value: 21, delta: "+9%", helper: "44% conversión" },
  { label: "Abogados activos", value: 8, delta: "+2", helper: "en la red" },
];

const LEADS: Lead[] = [
  {
    id: "L-2708",
    when: "hoy · 09:41",
    area: "penal",
    urgency: "urgent",
    summary: "Familiar detenido esta madrugada. Necesita orientación.",
    contact: "María G. · +54 223 5xx-xxxx",
    lawyer: "Dr. Cristian Moix",
    status: "contactado",
  },
  {
    id: "L-2707",
    when: "hoy · 08:12",
    area: "laboral",
    urgency: "high",
    summary: "Despido sin causa en hotel del centro, 6 años de antigüedad.",
    contact: "Julián R. · julian@…",
    lawyer: "Dr. Martín Losada",
    status: "agendado",
  },
  {
    id: "L-2706",
    when: "ayer · 19:28",
    area: "familia",
    urgency: "medium",
    summary: "Divorcio con hijos menores. Quiere mediación.",
    contact: "Carolina B. · +54 223 4xx-xxxx",
    lawyer: "Dra. Ana Benítez",
    status: "contactado",
  },
  {
    id: "L-2705",
    when: "ayer · 15:03",
    area: "consumidor",
    urgency: "low",
    summary: "Facturación indebida en servicio de telecomunicaciones.",
    contact: "Diego P. · diego@…",
    lawyer: "Dra. Lucía Ferrari",
    status: "nuevo",
  },
  {
    id: "L-2704",
    when: "ayer · 11:47",
    area: "sucesiones",
    urgency: "medium",
    summary: "Sucesión con inmuebles en dos jurisdicciones.",
    contact: "Nora S. · nora@…",
    lawyer: "Dra. Ana Benítez",
    status: "cerrado",
  },
];

const ACTIVITY = [
  { when: "hace 12 min", text: "Nuevo lead penal derivado al Dr. Moix (urgente)." },
  { when: "hace 1 h", text: "Turno confirmado — Dra. Benítez · miércoles 15:00." },
  { when: "hace 3 h", text: "Dra. Ferrari actualizó su perfil (nueva área)." },
  { when: "ayer", text: "Sincronización MEV SCBA · 4 nuevos expedientes indexados." },
  { when: "ayer", text: "Padrón CAMDP verificado · 8/8 matrículas activas." },
];

const AREA_DIST = [
  { name: "penal", value: 34 },
  { name: "laboral", value: 22 },
  { name: "familia", value: 18 },
  { name: "civil", value: 12 },
  { name: "consumidor", value: 8 },
  { name: "otros", value: 6 },
];

const URGENCY_COLOR: Record<Lead["urgency"], string> = {
  urgent: "bg-red-500/15 text-red-700 border-red-500/30",
  high: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  medium: "bg-ink/5 text-ink/70 border-ink/15",
  low: "bg-ink/5 text-ink/50 border-ink/10",
};

const STATUS_COLOR: Record<Lead["status"], string> = {
  nuevo: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  contactado: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  agendado: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  cerrado: "bg-ink/5 text-ink/50 border-ink/15",
};

const maxArea = Math.max(...AREA_DIST.map((a) => a.value));

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-paper-warm">
      <div className="border-b border-ink/10 bg-paper">
        <div className="container-narrow py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-ink/60 hover:text-ink">← Volver</Link>
            <span className="text-ink/20">/</span>
            <p className="font-serif text-lg text-ink">Panel — Moix Legal</p>
            <PreviewBadge />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-ink/60">Dr. Cristian Moix · admin</span>
          </div>
        </div>
      </div>

      <div className="container-narrow py-8">
        <PreviewNote>
          Este panel privado se activa en <strong>Fase 3</strong>. El Dr. Moix ve
          la red completa (todos los leads, turnos y actividad); cada abogado ve
          solo sus propios leads y su calendario. Autenticación con contraseña
          (scrypt) o Google/Microsoft SSO.
        </PreviewNote>

        {/* KPIs */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-2xl border border-ink/10 bg-paper p-5">
              <p className="text-xs uppercase tracking-widest text-ink/50">{k.label}</p>
              <p className="mt-2 font-serif text-3xl text-ink tabular-nums">{k.value}</p>
              <p className="mt-1 text-xs text-ink/60">
                <span className="text-emerald-700 font-medium">{k.delta}</span> · {k.helper}
              </p>
            </div>
          ))}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          {/* Leads */}
          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl text-ink">Leads recientes</h2>
              <div className="flex items-center gap-2 text-xs text-ink/60">
                <button className="rounded-lg border border-ink/15 bg-paper px-2.5 py-1 hover:border-ink/30">Todos</button>
                <button className="rounded-lg border border-ink/15 bg-paper px-2.5 py-1 hover:border-ink/30">Urgentes</button>
                <button className="rounded-lg border border-ink/15 bg-paper px-2.5 py-1 hover:border-ink/30">Sin contactar</button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-ink/10 bg-paper overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-paper-warm text-xs uppercase tracking-widest text-ink/50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-normal">Lead</th>
                    <th className="text-left px-4 py-2.5 font-normal">Área</th>
                    <th className="text-left px-4 py-2.5 font-normal hidden md:table-cell">Abogado</th>
                    <th className="text-left px-4 py-2.5 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((l) => (
                    <tr key={l.id} className="border-t border-ink/10 hover:bg-paper-warm/50">
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums text-xs text-ink/50">{l.id}</span>
                          <span
                            className={
                              "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                              URGENCY_COLOR[l.urgency]
                            }
                          >
                            {l.urgency}
                          </span>
                        </div>
                        <p className="mt-1 text-ink text-sm leading-snug">{l.summary}</p>
                        <p className="mt-1 text-xs text-ink/50">{l.when} · {l.contact}</p>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="text-xs text-ink/70 capitalize">{l.area}</span>
                      </td>
                      <td className="px-4 py-3 align-top hidden md:table-cell">
                        <span className="text-xs text-ink/70">{l.lawyer}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                            STATUS_COLOR[l.status]
                          }
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Distribución por área */}
            <div className="mt-6 rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Distribución por área — últimos 30 días</h3>
              <ul className="mt-4 space-y-2">
                {AREA_DIST.map((a) => (
                  <li key={a.name}>
                    <div className="flex items-center justify-between text-sm text-ink/80">
                      <span className="capitalize">{a.name}</span>
                      <span className="tabular-nums text-ink/60">{a.value}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-ink/5 overflow-hidden">
                      <div
                        className="h-full bg-ink/70"
                        style={{ width: `${(a.value / maxArea) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Actividad</h3>
              <ul className="mt-4 space-y-3">
                {ACTIVITY.map((a, i) => (
                  <li key={i} className="text-sm">
                    <p className="text-xs uppercase tracking-widest text-ink/50">{a.when}</p>
                    <p className="text-ink/80 mt-0.5">{a.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Salud de la red</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">CAMDP · matrículas</span>
                  <span className="text-emerald-700 font-medium">8/8 activas</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">MEV SCBA · última sync</span>
                  <span className="text-ink/80">hace 4 h</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">Chatbot · uptime 30d</span>
                  <span className="text-emerald-700 font-medium">99.7%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">Consentimientos pendientes</span>
                  <span className="text-amber-700 font-medium">2</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-paper p-5">
              <h3 className="font-serif text-lg text-ink">Acciones</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <button className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-left text-ink/80 hover:border-ink/30">
                  Invitar abogado a la red
                </button>
                <button className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-left text-ink/80 hover:border-ink/30">
                  Exportar leads (CSV)
                </button>
                <button className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-left text-ink/80 hover:border-ink/30">
                  Ver reporte mensual
                </button>
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-10 text-center text-xs text-ink/50">
          Panel de demostración · Los datos son ilustrativos. Los perfiles de abogados,
          leads y métricas reales se cargan y actualizan en Fase 3.
        </p>
      </div>
    </main>
  );
}
