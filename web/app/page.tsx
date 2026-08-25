import Link from "next/link";
import { ChatWidget } from "../components/ChatWidget";
import { LawyerCard } from "../components/LawyerCard";
import { DEMO_LAWYERS } from "../lib/demo-lawyers";

const AREAS = [
  { key: "penal", label: "Penal", desc: "Denuncias, defensa, medidas urgentes." },
  { key: "laboral", label: "Laboral", desc: "Despidos, ART, reclamos." },
  { key: "familia", label: "Familia", desc: "Divorcio, alimentos, tenencia." },
  { key: "civil", label: "Civil", desc: "Contratos, vecinos, daños." },
  { key: "sucesiones", label: "Sucesiones", desc: "Herencias, testamentos." },
  { key: "comercial", label: "Comercial", desc: "Sociedades, quiebras, concursos." },
  { key: "consumidor", label: "Consumidor", desc: "Defensa del consumidor." },
  { key: "administrativo", label: "Administrativo", desc: "Multas, trámites municipales." },
];

const STEPS = [
  { n: "1", title: "Contá qué te pasa", desc: "En el chat, en tus propias palabras. Sin formularios interminables." },
  { n: "2", title: "Recibí una recomendación", desc: "Te sugerimos 1 a 3 abogados de la red del Dr. Moix según tu caso." },
  { n: "3", title: "Agendá la consulta", desc: "Elegís horario y te contactamos por email o WhatsApp." },
];

const FAQ = [
  { q: "¿Cuánto sale la consulta?", a: "Depende del abogado y el tema. Muchos ofrecen una primera consulta orientativa sin cargo. Lo confirmamos antes de agendar." },
  { q: "¿Cómo eligen a los abogados de la red?", a: "Verificamos matrícula activa en el CAMDP y trayectoria pública. Todos los perfiles se publican con consentimiento del profesional." },
  { q: "¿Mis datos quedan expuestos?", a: "No. Cumplimos la Ley 25.326 y sólo compartimos tu consulta con el abogado que elijas. Podés pedir la baja en cualquier momento." },
  { q: "¿Y si mi tema no aparece en la lista?", a: "Contalo igual en el chat. Si tenemos un profesional adecuado te lo derivamos, y si no, te lo decimos con franqueza." },
];

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-paper via-paper-warm to-paper" />
        <div className="container-narrow pt-16 md:pt-20 pb-12 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50">
              Red del Dr. Cristian Moix · Mar del Plata
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl leading-tight text-ink">
              Encontrá al abogado indicado en dos minutos.
            </h1>
            <p className="mt-4 text-lg text-ink/70 max-w-prose">
              Contale tu problema al asistente. Te orientamos y te conectamos con un
              profesional matriculado de la red del Dr. Moix. Sin vueltas, sin formularios largos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#abogados"
                className="rounded-lg border border-ink/20 px-5 py-2.5 text-sm text-ink hover:bg-ink hover:text-paper transition"
              >
                Ver abogados
              </Link>
              <Link
                href="#moix"
                className="rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-soft transition"
              >
                Conocer al Dr. Moix
              </Link>
            </div>
          </div>
          <div className="md:justify-self-end w-full">
            <ChatWidget />
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="py-16 border-t border-ink/10">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl text-ink">Cómo funciona</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-ink/10 bg-paper p-6">
                <div className="h-10 w-10 rounded-full bg-ink text-paper grid place-items-center font-serif text-lg">
                  {s.n}
                </div>
                <h3 className="mt-4 font-serif text-xl text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="py-16 bg-paper-warm border-t border-ink/10">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl text-ink">Áreas de práctica</h2>
          <p className="mt-2 text-ink/70">Cobrimos los fueros más consultados en Mar del Plata.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {AREAS.map((a) => (
              <div key={a.key} className="rounded-xl border border-ink/10 bg-paper p-4">
                <p className="font-serif text-lg text-ink">{a.label}</p>
                <p className="text-sm text-ink/60 mt-1">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOIX */}
      <section id="moix" className="py-16 border-t border-ink/10">
        <div className="container-narrow grid gap-8 md:grid-cols-[220px_1fr] items-start">
          <div className="mx-auto md:mx-0 h-48 w-48 rounded-full bg-ink/5 grid place-items-center text-5xl font-serif text-ink/50 border border-ink/10">
            CM
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50">Referente de la red</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mt-2">Dr. Cristian Moix</h2>
            <p className="mt-3 text-ink/70 max-w-prose">
              Abogado penalista con más de 25 años de trayectoria en Mar del Plata. Ex rector universitario
              y docente titular de Derecho Penal. Referente en la orientación de casos de complejidad y
              en la formación de generaciones de abogados de la ciudad.
            </p>
            <div className="mt-5">
              <Link
                href="/abogados/cristian-moix"
                className="rounded-lg bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-soft transition"
              >
                Ver perfil completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RED */}
      <section id="abogados" className="py-16 bg-paper-warm border-t border-ink/10">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl text-ink">La red</h2>
          <p className="mt-2 text-ink/70">Profesionales matriculados en el CAMDP.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_LAWYERS.filter((l) => l.slug !== "cristian-moix").map((l) => (
              <LawyerCard key={l.slug} lawyer={l} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-ink/10">
        <div className="container-narrow max-w-3xl">
          <h2 className="font-serif text-3xl text-ink">Preguntas frecuentes</h2>
          <div className="mt-8 space-y-4">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl border border-ink/10 bg-paper p-5">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                  <span className="font-medium text-ink">{f.q}</span>
                  <span className="text-ink/40 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP — el proyecto en 3 fases + el producto final */}
      <section id="roadmap" className="py-16 bg-paper-warm border-t border-ink/10">
        <div className="container-narrow">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs uppercase tracking-widest text-ink/50">Roadmap</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink/70">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              3 fases
            </span>
          </div>
          <h2 className="mt-2 font-serif text-3xl text-ink">El proyecto en tres fases</h2>
          <p className="mt-2 text-ink/70 max-w-2xl">
            Un plan por etapas para que puedas ver resultados desde el primer día
            y decidir con evidencia cada avance. La estética, el flujo y los
            criterios de cumplimiento se mantienen en toda la evolución.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/40 bg-paper p-6 relative">
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En vivo
              </span>
              <p className="text-xs uppercase tracking-widest text-emerald-700">Fase 1 · MVP visual</p>
              <h3 className="mt-2 font-serif text-xl text-ink">Lo que ya ves funcionando</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· Landing profesional con chatbot embebido.</li>
                <li>· Red de abogados con perfil individual navegable.</li>
                <li>· Chat con clasificación de área y recomendación demo.</li>
                <li>· Calendario de agenda (mockup) por profesional.</li>
                <li>· Panel de administración (vista previa).</li>
                <li>· Backend REST + servicio de IA listos para conectar datos reales.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gold/50 bg-paper p-6 relative">
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> ~3 semanas
              </span>
              <p className="text-xs uppercase tracking-widest text-gold">Fase 2 · Producto real</p>
              <h3 className="mt-2 font-serif text-xl text-ink">Lo que se conecta a la realidad</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· <strong>Chatbot con IA real</strong> (Gemini/Claude) que conversa, clasifica el área y deriva con razones claras.</li>
                <li>· <strong>Agenda con Cal.com</strong> por abogado, con confirmación por email (Resend) y WhatsApp (Twilio).</li>
                <li>· <strong>Base de datos en producción</strong> (Postgres) para leads, turnos y perfiles.</li>
                <li>· <strong>Autenticación completa</strong> con alta guiada y consentimiento del abogado (Ley 25.326).</li>
                <li>· <strong>Verificación de matrícula</strong> en el padrón del CAMDP al momento de sumar cada abogado.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/15 bg-paper p-6 relative">
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-ink/20 bg-ink/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/60">
                ~4 semanas
              </span>
              <p className="text-xs uppercase tracking-widest text-ink/60">Fase 3 · Escala y gobierno</p>
              <h3 className="mt-2 font-serif text-xl text-ink">Lo que hace crecer la red</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· <strong>Panel por rol</strong>: cada abogado edita su perfil y carga sus casos representativos (anonimizados).</li>
                <li>· Cada abogado ve sus <strong>leads y turnos</strong> propios.</li>
                <li>· <strong>Vista del Dr. Moix</strong> sobre toda la red con métricas de derivación y conversión.</li>
                <li>· Tracking "referido por Moix" en cada lead para trazabilidad total.</li>
                <li>· Reportes mensuales automáticos por email y exportación (CSV).</li>
                <li>· Indexación automática de menciones en <strong>prensa local</strong> (La Capital MdP, Infobrisas) por perfil.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-ink/10 bg-paper/60 p-5 text-sm text-ink/70">
            <p className="text-xs uppercase tracking-widest text-ink/50">Qué no promete el proyecto</p>
            <p className="mt-2 leading-relaxed">
              El sitio <strong>no</strong> extrae expedientes del sistema MEV de
              la SCBA (requiere credenciales personales y el fuero penal está
              restringido), <strong>no</strong> replica el CIJ (discontinuado en
              mayo 2025) y <strong>no</strong> reemplaza al padrón oficial. La
              estadística judicial que quiera mostrarse en un perfil la carga el
              propio abogado, con el respaldo que decida (capturas, exportaciones
              propias de MEV, etc.).
            </p>
          </div>

          {/* El producto final — pensado para explicar al abogado que recibe el sitio */}
          <div className="mt-12 rounded-3xl border border-ink/10 bg-ink text-paper p-8 md:p-10">
            <p className="text-xs uppercase tracking-widest text-gold">Cierre · el producto final</p>
            <h3 className="mt-2 font-serif text-3xl">Cómo queda tu sitio al terminar las tres fases</h3>
            <p className="mt-3 text-paper/80 max-w-3xl">
              Un directorio legal marplatense con el Dr. Moix como figura central y
              una red curada de profesionales matriculados en el CAMDP, atendido
              24/7 por un asistente inteligente que orienta al consultante y lo
              lleva hasta la agenda del abogado adecuado.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div>
                <p className="font-serif text-lg text-gold">Para el consultante</p>
                <ul className="mt-2 space-y-1.5 text-sm text-paper/80">
                  <li>· Explica su problema en lenguaje coloquial.</li>
                  <li>· Recibe 1 a 3 recomendaciones fundamentadas.</li>
                  <li>· Agenda su consulta en dos clicks.</li>
                  <li>· Confirmación por email o WhatsApp.</li>
                </ul>
              </div>
              <div>
                <p className="font-serif text-lg text-gold">Para cada abogado</p>
                <ul className="mt-2 space-y-1.5 text-sm text-paper/80">
                  <li>· Perfil profesional editorial, con matrícula verificada en el CAMDP.</li>
                  <li>· Menciones en medios indexadas automáticamente.</li>
                  <li>· Sección de casos representativos cargada por él mismo.</li>
                  <li>· Calendario propio integrado (Cal.com).</li>
                  <li>· Panel privado con sus leads y turnos.</li>
                </ul>
              </div>
              <div>
                <p className="font-serif text-lg text-gold">Para el Dr. Moix</p>
                <ul className="mt-2 space-y-1.5 text-sm text-paper/80">
                  <li>· Vista integral de la red y su actividad.</li>
                  <li>· Cada lead trazado como "referido por Moix".</li>
                  <li>· Métricas de derivación y conversión.</li>
                  <li>· Reportes mensuales listos para leer.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 border-t border-paper/15 pt-8">
              <div>
                <p className="font-serif text-lg text-gold">Cumplimiento sin sorpresas</p>
                <ul className="mt-2 space-y-1.5 text-sm text-paper/80">
                  <li>· <strong>Ley 25.326</strong> de Protección de Datos Personales aplicada por diseño.</li>
                  <li>· Reglas del <strong>CAMDP</strong> sobre publicidad y derivación respetadas en todo el flujo.</li>
                  <li>· Consentimiento explícito de cada abogado antes de publicar.</li>
                  <li>· Opt-out visible en todo perfil y baja en 48 h hábiles.</li>
                </ul>
              </div>
              <div>
                <p className="font-serif text-lg text-gold">Sin ataduras</p>
                <ul className="mt-2 space-y-1.5 text-sm text-paper/80">
                  <li>· Código propio, sin dependencias de plataformas cerradas.</li>
                  <li>· Base de datos exportable en cualquier momento.</li>
                  <li>· Deploy en la nube con costo mensual controlado.</li>
                  <li>· Documentación técnica completa entregada al final.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-paper/15 pt-6 text-sm text-paper/70">
              <span className="rounded-full bg-paper/10 px-3 py-1">Tiempo total estimado: ~7 semanas</span>
              <span className="rounded-full bg-paper/10 px-3 py-1">Sitio en vivo desde la Fase 1</span>
              <span className="rounded-full bg-paper/10 px-3 py-1">Iteraciones semanales con el Dr. Moix</span>
            </div>
          </div>

          <p className="mt-8 text-xs text-ink/50">
            Los tiempos son estimativos y se ajustan según la disponibilidad de
            datos (verificación en el padrón del CAMDP, consentimientos, integraciones
            con Cal.com, Resend y Twilio).
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 py-10 bg-paper-warm">
        <div className="container-narrow text-sm text-ink/60 grid gap-4 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg text-ink">Moix Legal</p>
            <p className="mt-1">Mar del Plata, Buenos Aires — Argentina.</p>
            <p className="mt-1">contacto@moixlegal.com.ar</p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-xs text-ink/50">Sitio</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="#abogados">Abogados</Link></li>
              <li><Link href="#moix">Dr. Moix</Link></li>
              <li><Link href="#roadmap">Roadmap</Link></li>
              <li><Link href="/admin">Panel (preview)</Link></li>
            </ul>
          </div>
          <div>
            <p className="uppercase tracking-widest text-xs text-ink/50">Aviso</p>
            <p className="mt-2 text-xs">
              Este sitio no constituye asesoramiento legal. La información brindada es
              orientativa y no reemplaza la consulta con un profesional matriculado.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
