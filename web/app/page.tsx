import Link from "next/link";
import { ChatWidget } from "../components/ChatWidget";
import { DEMO_LAWYERS, TEAM_PLACEHOLDERS } from "../lib/demo-lawyers";

const STEPS = [
  {
    n: "1",
    title: "Contá qué te pasa",
    desc:
      "En el chat, en tus propias palabras. El asistente entiende y no juzga.",
  },
  {
    n: "2",
    title: "Evaluamos si es un caso penal",
    desc:
      "Nuestro estudio se dedica solo a derecho penal. Si tu caso es de otra área, te orientamos hacia el fuero adecuado.",
  },
  {
    n: "3",
    title: "Te contactamos",
    desc:
      "Si el caso es para nosotros, un abogado del equipo te llama o te agenda una consulta.",
  },
];

const AREAS = [
  {
    title: "Defensa penal",
    desc: "Imputaciones, detenciones, medidas cautelares, juicio oral.",
  },
  {
    title: "Recursos y apelaciones",
    desc: "Planteos ante la Cámara de Apelación y Garantías en lo Penal de MdP.",
  },
  {
    title: "Casos económicos y patrimoniales",
    desc: "Defensa en causas por estafa, administración fraudulenta y afines.",
  },
  {
    title: "Contravenciones",
    desc: "Actuación en el fuero contravencional de la provincia de Buenos Aires.",
  },
];

const FAQ = [
  {
    q: "¿El estudio atiende otros temas además de penal?",
    a: "No. El Estudio Moix Abogados se dedica exclusivamente a derecho penal. Si tu caso es de otra área, el asistente te orienta hacia el fuero correspondiente y te sugiere buscar un abogado en el CAMDP.",
  },
  {
    q: "¿La primera consulta tiene costo?",
    a: "La orientación inicial por el chat es sin cargo. El costo de honorarios profesionales se conversa con el abogado del equipo antes de tomar el caso.",
  },
  {
    q: "¿Cómo protegen mis datos?",
    a: "Cumplimos la Ley 25.326 de Protección de Datos Personales. Los datos que compartas solo se usan para tu consulta y no se ceden a terceros.",
  },
  {
    q: "¿Puedo agendar directo sin usar el chat?",
    a: "Sí. Podés escribir al mail del estudio o pedir una consulta desde el perfil del Dr. Moix.",
  },
];

const moix = DEMO_LAWYERS[0];

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-paper via-paper-warm to-paper" />
        <div className="container-narrow pt-16 md:pt-20 pb-12 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
              Mar del Plata · Derecho penal
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl leading-tight text-ink">
              Estudio Moix Abogados
            </h1>
            <p className="mt-4 text-lg text-ink/70 max-w-prose">
              Defensa penal en el Departamento Judicial Mar del Plata. Un equipo
              dedicado únicamente al fuero penal, con actuación regular en
              instancias de juicio y apelación.
            </p>
            <p className="mt-3 text-sm text-ink/60 max-w-prose">
              Escribí abajo, contale al asistente qué te pasa y te decimos si es
              un caso para nosotros. Si no lo es, te orientamos igual sobre qué
              tipo de abogado necesitás.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/abogados/cristian-moix"
                className="rounded-lg border border-ink/20 px-5 py-2.5 text-sm text-ink hover:bg-ink hover:text-paper transition"
              >
                Conocer al Dr. Moix
              </Link>
              <Link
                href="#equipo"
                className="rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-soft transition"
              >
                El equipo
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
          <h2 className="font-serif text-3xl text-ink">Cómo trabajamos</h2>
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

      {/* MOIX + ESTUDIO */}
      <section id="moix" className="py-16 bg-paper-warm border-t border-ink/10">
        <div className="container-narrow grid gap-8 md:grid-cols-[220px_1fr] items-start">
          <div className="mx-auto md:mx-0 h-48 w-48 rounded-full bg-ink/5 grid place-items-center text-5xl font-serif text-ink/50 border border-ink/10">
            CM
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Titular del estudio</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mt-2">Dr. Cristian Moix</h2>
            <p className="mt-3 text-ink/70 max-w-prose">
              Fundador y titular del estudio. Su práctica se centra en causas de
              complejidad ante los tribunales del fuero penal bonaerense, con
              actuación regular en instancias de apelación.
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

      {/* EQUIPO */}
      <section id="equipo" className="py-16 border-t border-ink/10">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl text-ink">El equipo del estudio</h2>
          <p className="mt-2 text-ink/70 max-w-2xl">
            Todos los integrantes son abogados dedicados a derecho penal en el
            Departamento Judicial Mar del Plata.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={`/abogados/${moix.slug}`}
              className="group block rounded-2xl border border-ink/10 bg-paper p-5 hover:shadow-soft transition"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Titular</p>
              <h3 className="mt-2 font-serif text-xl text-ink group-hover:text-ink-soft">
                {moix.full_name}
              </h3>
              {moix.headline && <p className="text-sm text-ink/70 mt-1">{moix.headline}</p>}
              <span className="mt-3 inline-block text-xs text-ink/50 underline underline-offset-2">
                Ver perfil ↗
              </span>
            </Link>

            {TEAM_PLACEHOLDERS.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-ink/20 bg-paper/60 p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/40">Integrante</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    Vista previa · Fase 2
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-xl text-ink/70">{m.role}</h3>
                <p className="text-sm text-ink/60 mt-1">{m.note}</p>
                <p className="mt-3 text-xs text-ink/50">
                  El perfil se completa cuando el propio abogado se sume al panel
                  privado del estudio.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS */}
      <section className="py-16 bg-paper-warm border-t border-ink/10">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl text-ink">Áreas de trabajo</h2>
          <p className="mt-2 text-ink/70">Ejercemos exclusivamente en derecho penal.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {AREAS.map((a) => (
              <div key={a.title} className="rounded-2xl border border-ink/10 bg-paper p-5">
                <p className="font-serif text-lg text-ink">{a.title}</p>
                <p className="text-sm text-ink/70 mt-1">{a.desc}</p>
              </div>
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

      {/* ROADMAP — pensado para explicarle al Dr. Moix qué sigue */}
      <section id="roadmap" className="py-16 bg-paper-warm border-t border-ink/10">
        <div className="container-narrow">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Roadmap</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink/70">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              3 fases
            </span>
          </div>
          <h2 className="mt-2 font-serif text-3xl text-ink">El proyecto en tres fases</h2>
          <p className="mt-2 text-ink/70 max-w-2xl">
            Se entrega por etapas para que vean resultados desde el primer día y
            decidan cada avance con evidencia.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/40 bg-paper p-6 relative">
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En vivo
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Fase 1 · Sitio institucional</p>
              <h3 className="mt-2 font-serif text-xl text-ink">Lo que ya está</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· Landing profesional del estudio.</li>
                <li>· Chat con IA real que filtra por área.</li>
                <li>· Perfil del titular y del equipo (placeholder).</li>
                <li>· Áreas de trabajo y FAQ.</li>
                <li>· Base técnica lista para portales.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gold/50 bg-paper p-6 relative">
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> ~4 semanas
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Fase 2 · Portal del estudio</p>
              <h3 className="mt-2 font-serif text-xl text-ink">El backoffice</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· Usuarios y perfiles para cada abogado del equipo.</li>
                <li>· Casos activos, documentación, notas internas.</li>
                <li>· Alta de leads del chat con un click.</li>
                <li>· Agenda con Cal.com + notificaciones (email + WhatsApp).</li>
                <li>· Cada abogado edita su perfil público.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/15 bg-paper p-6 relative">
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-ink/20 bg-ink/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/60">
                ~4 semanas
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Fase 3 · Portal del cliente</p>
              <h3 className="mt-2 font-serif text-xl text-ink">Para quien contrata al estudio</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                <li>· Cada cliente entra a un espacio privado por su caso.</li>
                <li>· Ve el avance, próximos pasos y audiencias.</li>
                <li>· Recibe notificaciones cuando hay novedades.</li>
                <li>· Sube y firma documentos (firma electrónica).</li>
                <li>· Asistente IA interno para preguntas frecuentes del caso.</li>
              </ul>
            </div>
          </div>

          {/* Modelo replicable */}
          <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Modelo replicable</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">
              Al terminar, el estudio queda con una plataforma propia
            </h3>
            <p className="mt-2 text-ink/75 max-w-3xl">
              El mismo modelo —sitio institucional con IA de filtro, portal
              del estudio y portal del cliente— se puede ofrecer a otros
              estudios como servicio. El Estudio Moix queda con la referencia
              probada y la posibilidad de sumar honorarios recurrentes por
              referirlo.
            </p>
          </div>

          <p className="mt-8 text-xs text-ink/50 max-w-3xl">
            Todos los desarrollos siguen la Ley 25.326 (Protección de Datos
            Personales) y las reglas del CAMDP sobre publicidad y ejercicio
            profesional.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 py-10 bg-paper-warm">
        <div className="container-narrow text-sm text-ink/60 grid gap-4 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg text-ink">Estudio Moix Abogados</p>
            <p className="mt-1">Mar del Plata, Buenos Aires — Argentina.</p>
            <p className="mt-1">contacto@moixabogados.com.ar</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-ink/50">Sitio</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="#equipo">El equipo</Link></li>
              <li><Link href="#moix">Dr. Moix</Link></li>
              <li><Link href="#roadmap">Roadmap</Link></li>
              <li><Link href="/mi-caso">Portal cliente (preview)</Link></li>
              <li><Link href="/admin">Panel del estudio (preview)</Link></li>
            </ul>
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-ink/50">Aviso</p>
            <p className="mt-2 text-xs">
              Este sitio no constituye asesoramiento legal. La información
              brindada por el asistente es orientativa y no reemplaza la
              consulta con un profesional matriculado.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
