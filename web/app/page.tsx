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

      {/* ROADMAP — así va a crecer el sitio (para mostrar potencial al Dr. Moix) */}
      <section id="roadmap" className="py-16 bg-paper-warm border-t border-ink/10">
        <div className="container-narrow">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs uppercase tracking-widest text-ink/50">Roadmap</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink/70">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Próximos pasos
            </span>
          </div>
          <h2 className="mt-2 font-serif text-3xl text-ink">Cómo va a crecer el sitio</h2>
          <p className="mt-2 text-ink/70 max-w-2xl">
            Esta es una vista previa. Lo que ya ves funciona; lo que sigue se
            construye en la próxima fase manteniendo la misma estética y flujo.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-paper p-6">
              <p className="text-xs uppercase tracking-widest text-gold">Fase 2 · IA real</p>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Chatbot conectado a la normativa y al padrón oficial
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· RAG sobre el padrón del <strong>CAMDP</strong> (matrículas verificadas).</li>
                <li>· Estadística de expedientes desde la <strong>MEV SCBA</strong>.</li>
                <li>· Normativa argentina indexada (Código Penal, CPP Buenos Aires, Ley 24.240, Ley 20.744).</li>
                <li>· Respuestas empáticas en voseo, con disclaimer y CTA de agenda.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-paper p-6">
              <p className="text-xs uppercase tracking-widest text-gold">Fase 2 · Agenda real</p>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Cal.com por abogado + notificaciones
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· Cada abogado con su propio calendario embebido en el perfil.</li>
                <li>· Confirmación automática por email (Resend) y WhatsApp (Twilio).</li>
                <li>· Recordatorios 24 h y 1 h antes del turno.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-paper p-6">
              <p className="text-xs uppercase tracking-widest text-gold">Fase 2 · Perfiles enriquecidos</p>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Cada abogado con desempeño judicial verificado
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· Bloque "Desempeño en tribunales de MdP" (fueros, causas, juzgados).</li>
                <li>· Publicaciones indexadas de SAIJ y Google Scholar.</li>
                <li>· Casos destacados cargados por el propio abogado (anonimizados).</li>
                <li>· Consentimiento explícito antes de publicar (Ley 25.326).</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-paper p-6">
              <p className="text-xs uppercase tracking-widest text-gold">Fase 3 · Panel y métricas</p>
              <h3 className="mt-2 font-serif text-xl text-ink">
                Panel privado para abogados y para el Dr. Moix
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· Cada abogado ve sus leads, turnos y perfil editable.</li>
                <li>· Dr. Moix ve la red completa: derivaciones, conversión, actividad.</li>
                <li>· Tracking "referido por Moix" en cada lead para transparencia.</li>
                <li>· Reportes mensuales por email.</li>
              </ul>
            </div>
          </div>

          <p className="mt-8 text-xs text-ink/50">
            Todos los desarrollos siguen la Ley 25.326 (Protección de Datos
            Personales) y las reglas del Colegio de Abogados de MdP sobre publicidad
            profesional.
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
