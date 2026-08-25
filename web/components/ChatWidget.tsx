"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Recommendation = {
  slug: string;
  full_name: string;
  headline: string;
  reason: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  recommendations?: Recommendation[];
  booking_cta?: { lawyer_slug: string; href: string; label?: string } | null;
};

type AreaKey =
  | "penal"
  | "laboral"
  | "familia"
  | "sucesiones"
  | "civil"
  | "consumidor"
  | "transito";

const REC: Record<string, Recommendation> = {
  "cristian-moix": {
    slug: "cristian-moix",
    full_name: "Dr. Cristian Moix",
    headline: "Abogado penalista · Estudio propio en Mar del Plata",
    reason: "Defensa técnica en causas del fuero penal bonaerense.",
  },
  "martin-losada": {
    slug: "martin-losada",
    full_name: "Dr. Martín Losada",
    headline: "Derecho laboral · Representación de trabajadores",
    reason: "Despidos, ART y reclamos individuales.",
  },
  "ana-benitez": {
    slug: "ana-benitez",
    full_name: "Dra. Ana Benítez",
    headline: "Familia y sucesiones · Enfoque colaborativo",
    reason: "Divorcios, alimentos, tenencia, sucesiones.",
  },
  "lucia-ferrari": {
    slug: "lucia-ferrari",
    full_name: "Dra. Lucía Ferrari",
    headline: "Civil, comercial y defensa del consumidor",
    reason: "Contratos, daños y perjuicios, reclamos al consumidor.",
  },
};

const DISCLAIMER = "Esto no constituye asesoramiento legal.";

function make(
  slug: keyof typeof REC,
  content: string,
  cta = "Agendar consulta"
): Message {
  return {
    role: "assistant",
    content,
    recommendations: [REC[slug]],
    booking_cta: {
      lawyer_slug: slug,
      href: `/abogados/${slug}#agendar`,
      label: cta,
    },
  };
}

const ANSWERS: Record<AreaKey, Message> = {
  penal: make(
    "cristian-moix",
    `Entiendo. Suena a una cuestión del fuero penal. Los tiempos en penal corren rápido, así que conviene consultar cuanto antes con un defensor técnico para evaluar la situación procesal y los pasos a seguir. ${DISCLAIMER}`
  ),
  laboral: make(
    "martin-losada",
    `Parece un tema laboral. Hay plazos que corren desde el hecho (despido, accidente, no pago), así que conviene consultar pronto con un abogado laboralista para no perder derechos. ${DISCLAIMER}`
  ),
  familia: make(
    "ana-benitez",
    `Es un tema del fuero de familia. Según el caso puede resolverse por mediación o por vía judicial. Un profesional del fuero puede orientarte y evaluar el mejor camino. ${DISCLAIMER}`
  ),
  sucesiones: make(
    "ana-benitez",
    `Se trata de una sucesión. El proceso puede iniciarse en el domicilio del causante y tiene varios pasos (declaratoria de herederos, inventario, adjudicación). Un abogado del fuero puede acompañar todo el trámite. ${DISCLAIMER}`
  ),
  civil: make(
    "lucia-ferrari",
    `Es un tema civil. Un abogado civilista puede revisar tu caso, evaluar plazos y prescripción y proponer una estrategia. ${DISCLAIMER}`
  ),
  consumidor: make(
    "lucia-ferrari",
    `Suena a un caso de defensa del consumidor. Hay vías administrativas rápidas y también reclamo judicial con daño punitivo cuando corresponde. Un abogado del área puede orientarte. ${DISCLAIMER}`
  ),
  transito: make(
    "lucia-ferrari",
    `Parece un tema de tránsito o daños derivados de un siniestro vial. Es importante recopilar la documentación (constatación, denuncia, fotos, testigos) antes de reclamar. ${DISCLAIMER}`
  ),
};

// Detección heurística amplia con vocabulario coloquial rioplatense.
// En Fase 2 la reemplaza el clasificador del LLM.
const PATTERNS: Array<[AreaKey, RegExp]> = [
  [
    "penal",
    /(penal|delito|denuncia\s|denunciar|detenid|detenc|preso|imputad|imputac|amenaza|amenazad|robo|hurto|estafa|estafad|abuso|abusad|lesion|lesion(es|ad)|homicid|femicid|allanamiento|excarcelaci|libertad\s+condicional|fuerza\s+p[uú]blica|polic[ií]a|comisar[ií]a|fiscal[ií]a|proces(o|ad)|imputaci)/,
  ],
  [
    "laboral",
    /(despid|despedir|me\s+echaron|me\s+rajaron|liquidaci[oó]n|indemnizaci|laboral|trabajo\s+en\s+negro|art|aseguradora\s+de\s+riesgo|accidente\s+de\s+trabajo|aguinald|sueldo|no\s+me\s+pagan|no\s+cobro|horas\s+extra|joyner|patr[oó]n|jefe|convenio\s+colectivo|renuncia\s+forzada|acoso\s+laboral)/,
  ],
  [
    "familia",
    /(divorci|separaci[oó]n|mi\s+(ex|marido|esposa|mujer|pareja)|hij[oa]s?|alimentos|cuota\s+alimentaria|tenencia|custodia|r[eé]gimen\s+de\s+comunicaci|visitas|violencia\s+(familiar|de\s+g[eé]nero|dom[eé]stica)|denuncia\s+de\s+violencia|adopci|filiaci|paternidad|mediaci[oó]n\s+familiar)/,
  ],
  [
    "sucesiones",
    /(sucesi|herenc|hereder|testament|falleci[oó]|muri[oó]|inventario|declaratoria\s+de\s+hereder|bienes\s+de\s+mi|casa\s+de\s+mis?\s+padres|departamento\s+heredad)/,
  ],
  [
    "consumidor",
    /(consumidor|defensa\s+del\s+consumidor|producto\s+fallad|servicio\s+no\s+prestad|no\s+me\s+entregan|garant[ií]a|facturaci[oó]n\s+indebida|d[ée]bito\s+indebido|tel[eé]fono|internet\s+no\s+funciona|reclamo\s+a\s+(la\s+empresa|la\s+compa[nñ][ií]a)|banco|tarjeta|estafa\s+telef[oó]nica|no\s+me\s+devuelven)/,
  ],
  [
    "transito",
    /(tr[aá]nsito|choque|chocaron|siniestro\s+vial|accidente\s+de\s+tr[aá]nsito|multa|infracci[oó]n\s+de\s+tr[aá]nsito|licencia\s+de\s+conducir|constatac(i|iones))/,
  ],
  [
    "civil",
    /(civil|vecino|medianera|contrato|contract|reclamo|da[nñ]os|perjuicio|alquiler|inquilino|propietario|desalojo|deuda|mutuo|prescripci[oó]n)/,
  ],
];

function detectArea(text: string): AreaKey | null {
  const t = text.toLowerCase();
  for (const [area, re] of PATTERNS) {
    if (re.test(t)) return area;
  }
  return null;
}

const SUGGESTIONS: { label: string; text: string }[] = [
  { label: "Me despidieron", text: "Me despidieron sin causa hace una semana." },
  { label: "Consulta penal", text: "Un familiar quedó imputado en una causa penal." },
  { label: "Quiero divorciarme", text: "Quiero iniciar un divorcio, tenemos hijos menores." },
  { label: "Una sucesión", text: "Falleció un familiar y tenemos que iniciar la sucesión." },
  { label: "Defensa del consumidor", text: "Una empresa me está facturando algo que no contraté." },
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hola. Soy el asistente legal de la red del Dr. Moix. Contame en pocas palabras qué te está pasando y te orienta con un profesional matriculado de Mar del Plata. Si querés, empezá tocando alguna de las sugerencias.",
};

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [suggestionsUsed, setSuggestionsUsed] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || pending) return;
    setInput("");
    setSuggestionsUsed(true);
    setMessages((m) => [...m, { role: "user", content: clean }]);
    setPending(true);
    await new Promise((r) => setTimeout(r, 550));

    const area = detectArea(clean);
    if (area) {
      setMessages((m) => [...m, ANSWERS[area]]);
    } else {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            `Contame un poco más para poder orientarte. Por ejemplo: ¿es algo que pasó en el trabajo, en tu familia, con un vecino o comercio, un tema de tránsito, o una situación con la policía o la justicia penal? Cuanto más detalle, mejor. ${DISCLAIMER}`,
        },
      ]);
    }
    setPending(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="flex flex-col h-[560px] w-full max-w-xl rounded-2xl border border-ink/10 bg-paper shadow-soft overflow-hidden">
      <header className="px-5 py-3 border-b border-ink/10 bg-white/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-ink">Asistente legal · en línea</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Demo
          </span>
        </div>
        <p className="text-xs text-ink/60 mt-0.5">
          Español rioplatense · Mar del Plata · <span className="text-ink/50">respuestas de ejemplo</span>
        </p>
      </header>
      <div className="px-4 py-2 border-b border-ink/10 bg-gold/5 text-[11px] text-ink/70 leading-snug">
        <strong className="text-ink">Demo funcional.</strong> Reconoce el área de tu consulta y
        te sugiere un abogado de la red. En Fase 2 lo reemplaza un asistente con IA real (Gemini o Claude).
      </div>

      <div ref={boxRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-paper to-paper-warm">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-ink text-paper px-4 py-2.5 text-sm"
                    : "max-w-[92%] rounded-2xl rounded-bl-md bg-white text-ink px-4 py-3 text-sm shadow-sm border border-ink/5"
                }
              >
                <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                {m.recommendations && m.recommendations.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {m.recommendations.map((r) => (
                      <li key={r.slug} className="rounded-xl border border-ink/10 p-3 bg-paper">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-serif text-base text-ink">{r.full_name}</p>
                          <Link
                            href={`/abogados/${r.slug}`}
                            className="text-xs text-ink/70 underline underline-offset-2 hover:text-ink"
                          >
                            ver perfil
                          </Link>
                        </div>
                        <p className="text-xs text-ink/70 mt-1">{r.headline}</p>
                        <p className="text-xs text-ink/60 mt-1 italic">{r.reason}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {m.booking_cta && (
                  <Link
                    href={m.booking_cta.href}
                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink hover:bg-gold-soft transition"
                  >
                    {m.booking_cta.label ?? "Agendar consulta"}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Chips de sugerencias — solo en el primer mensaje, hasta que el usuario escriba algo */}
        {!suggestionsUsed && (
          <div className="pt-1 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => send(s.text)}
                className="text-xs rounded-full border border-ink/15 bg-white px-3 py-1.5 text-ink/75 hover:border-ink/30 hover:text-ink transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {pending && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-ink/50 border border-ink/5 shadow-sm">
              escribiendo…
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-ink/10 bg-white/70 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Contame qué te pasa…"
          className="flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold/60"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-50 hover:bg-ink-soft transition"
        >
          Enviar
        </button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-ink/50 bg-white/70">
        Esto no constituye asesoramiento legal. Es orientación general.
      </p>
    </div>
  );
}
