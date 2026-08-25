"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
  recommendations?: { slug: string; full_name: string; headline: string; reason: string }[];
  booking_cta?: { lawyer_slug: string; href: string; label?: string } | null;
};

const DEMO_ANSWERS: Record<string, Message> = {
  penal: {
    role: "assistant",
    content:
      "Entiendo. Suena a una cuestión de derecho penal. Te sugiero conversar cuanto antes con un abogado penalista para evaluar plazos y acciones a seguir. Esto no constituye asesoramiento legal.",
    recommendations: [
      {
        slug: "cristian-moix",
        full_name: "Dr. Cristian Moix",
        headline: "Abogado penalista con más de 25 años en Mar del Plata.",
        reason: "Especialidad principal en derecho penal, referente local.",
      },
    ],
    booking_cta: { lawyer_slug: "cristian-moix", href: "/abogados/cristian-moix#agendar", label: "Agendar consulta" },
  },
  laboral: {
    role: "assistant",
    content:
      "Parece un tema laboral. Hay plazos que corren desde el despido; conviene consultar con un abogado especializado cuanto antes. Esto no constituye asesoramiento legal.",
    recommendations: [
      {
        slug: "martin-losada",
        full_name: "Dr. Martín Losada",
        headline: "Derecho laboral. Representación de trabajadores.",
        reason: "Trayectoria en despidos, ART y reclamos individuales en MdP.",
      },
    ],
    booking_cta: { lawyer_slug: "martin-losada", href: "/abogados/martin-losada#agendar", label: "Agendar consulta" },
  },
  familia: {
    role: "assistant",
    content:
      "Es un asunto de familia. Un profesional del fuero puede orientarte según tu situación específica y evaluar el mejor camino (mediación, proceso colaborativo o judicial). Esto no constituye asesoramiento legal.",
    recommendations: [
      {
        slug: "ana-benitez",
        full_name: "Dra. Ana Benítez",
        headline: "Familia, divorcios y sucesiones. Enfoque colaborativo.",
        reason: "12 años en el fuero de familia de MdP.",
      },
    ],
    booking_cta: { lawyer_slug: "ana-benitez", href: "/abogados/ana-benitez#agendar", label: "Agendar consulta" },
  },
  civil: {
    role: "assistant",
    content:
      "Es un tema civil. Un abogado civilista puede revisar tu caso y orientarte sobre plazos, prescripción y estrategia. Esto no constituye asesoramiento legal.",
    recommendations: [
      {
        slug: "lucia-ferrari",
        full_name: "Dra. Lucía Ferrari",
        headline: "Civil y comercial. Defensa del consumidor.",
        reason: "Contratos, daños y perjuicios, defensa del consumidor.",
      },
    ],
    booking_cta: { lawyer_slug: "lucia-ferrari", href: "/abogados/lucia-ferrari#agendar", label: "Agendar consulta" },
  },
};

function detectArea(text: string): keyof typeof DEMO_ANSWERS | null {
  const t = text.toLowerCase();
  if (/(penal|delito|denuncia|detenid|robo|imputad|amenaza)/.test(t)) return "penal";
  if (/(despid|laboral|trabajo|art|aguinald|sueldo)/.test(t)) return "laboral";
  if (/(divorci|familia|alimentos|tenencia|custodia|violencia)/.test(t)) return "familia";
  if (/(vecino|contrato|reclamo|daños|danios|consumidor)/.test(t)) return "civil";
  return null;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hola. Soy el asistente legal de la red del Dr. Moix. Contame en pocas palabras qué te está pasando y te oriento con un profesional de nuestra red en Mar del Plata.",
};

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setPending(true);

    // Fase 1: respuesta mock. Fase 2: apiClient.chat(...)
    await new Promise((r) => setTimeout(r, 600));
    const area = detectArea(text);
    if (area) {
      setMessages((m) => [...m, DEMO_ANSWERS[area]]);
    } else {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Contame un poco más: ¿es un problema penal, laboral, de familia o civil? Cuanto más detalle me des, mejor te oriento. Esto no constituye asesoramiento legal.",
        },
      ]);
    }
    setPending(false);
  }

  return (
    <div className="flex flex-col h-[540px] w-full max-w-xl rounded-2xl border border-ink/10 bg-paper shadow-soft overflow-hidden">
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
        <strong className="text-ink">En Fase 2</strong> este chat usa IA real (Gemini o Claude) para
        conversar, entender tu situación y recomendar 1 a 3 abogados de la red
        con razones claras, ofreciendo agenda directa.
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
