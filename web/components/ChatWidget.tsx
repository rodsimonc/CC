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

const DISCLAIMER = "Esto no constituye asesoramiento legal.";

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hola. Soy el asistente del Estudio Moix Abogados. El estudio se dedica solo a derecho penal — contame en pocas palabras qué te está pasando y te digo si es un caso para nosotros. Si no lo es, te oriento igual.",
};

// Fallback local por si el backend está frío o falla el fetch.
const FALLBACK_PENAL: Message = {
  role: "assistant",
  content:
    "Por lo que contás, suena a una cuestión del fuero penal. El estudio te puede acompañar. Si querés, un abogado del equipo te contacta. " +
    DISCLAIMER,
  recommendations: [
    {
      slug: "cristian-moix",
      full_name: "Dr. Cristian Moix",
      headline: "Abogado penalista · Titular del Estudio Moix Abogados",
      reason: "Estudio dedicado a derecho penal en Mar del Plata.",
    },
  ],
  booking_cta: {
    lawyer_slug: "cristian-moix",
    href: "/abogados/cristian-moix#agendar",
    label: "Agendar consulta",
  },
};

const FALLBACK_NO_PENAL: Message = {
  role: "assistant",
  content:
    "Te agradezco la consulta. El Estudio Moix Abogados se dedica solo a derecho penal, así que este caso no es para nosotros. Te conviene un abogado del fuero correspondiente — podés buscar uno matriculado en el CAMDP. " +
    DISCLAIMER,
};

function fallbackLocal(text: string): Message {
  const t = text.toLowerCase();
  // Cubre conjugaciones y variantes rioplatenses.
  const penal = /(penal|delito|delictiv|denuncia|deten|detuv|arrestad|preso|presa|en cana|imputa|amenaza|robo|hurto|estafa|abus|lesion|homicid|femicid|allanamient|excarcelac|prision preventiva|prisi[oó]n preventiva|fiscal[ií]a|indagatori|contravenci|juzgado penal|c[aá]mara penal|juicio abreviado)/.test(
    t,
  );
  if (penal) return FALLBACK_PENAL;
  const otro = /(despid|me\s+echaron|me\s+rajaron|laboral|trabajo|art|aguinald|sueldo|no me pagan|divorci|familia|alimentos|tenencia|custodia|violencia\s+(familiar|dom[eé]stica)|sucesi|herenc|hereder|vecino|contrato|reclamo\s+civil|da[nñ]os|consumidor|garant[ií]a|tr[aá]nsito|choque|multa\s+municipal|siniestro|administrativ|municipal)/.test(
    t,
  );
  if (otro) return FALLBACK_NO_PENAL;
  return {
    role: "assistant",
    content:
      "Contame un poco más para poder orientarte. ¿Qué te está pasando? " +
      DISCLAIMER,
  };
}

const SUGGESTIONS: { label: string; text: string }[] = [
  { label: "Estoy imputado", text: "Me llamaron de una fiscalía, estoy imputado en una causa penal." },
  { label: "Detuvieron a un familiar", text: "Detuvieron a un familiar esta madrugada." },
  { label: "Me estafaron", text: "Me estafaron una suma importante de plata, quiero hacer denuncia." },
  { label: "Me despidieron", text: "Me despidieron sin causa hace una semana." },
  { label: "Un tema de familia", text: "Estoy iniciando un divorcio, tenemos hijos menores." },
];

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

    const newHistory: Message[] = [...messages, { role: "user", content: clean }];
    setMessages(newHistory);
    setPending(true);

    // El history que le mandamos al backend NO incluye el mensaje actual
    // (va aparte como `question`); incluye el welcome + turnos previos.
    const historyForBackend = newHistory
      .slice(0, -1)
      .slice(-20) // límite defensivo
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          session_id: "web-demo",
          question: clean,
          history: historyForBackend,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && typeof data.answer === "string") {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.answer,
            recommendations: Array.isArray(data.recommendations) ? data.recommendations : undefined,
            booking_cta: data.booking_cta ?? undefined,
          },
        ]);
      } else {
        // Log a la consola del navegador para poder diagnosticar sin
        // esconder el problema detrás del fallback silencioso.
        console.warn("[chat] respuesta inválida", res.status, data);
        setMessages((m) => [...m, fallbackLocal(clean)]);
      }
    } catch (err) {
      console.warn("[chat] fetch failed", err);
      setMessages((m) => [...m, fallbackLocal(clean)]);
    } finally {
      setPending(false);
    }
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
            <span className="text-sm font-medium text-ink">Asistente del estudio · en línea</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            IA · Demo
          </span>
        </div>
        <p className="text-xs text-ink/60 mt-0.5">
          Estudio Moix Abogados · Derecho penal · Mar del Plata
        </p>
      </header>
      <div className="px-4 py-2 border-b border-ink/10 bg-gold/5 text-[11px] text-ink/70 leading-snug">
        <strong className="text-ink">IA real conectada.</strong> El asistente decide si tu caso es
        penal (lo tomamos) o de otra área (te orientamos hacia el fuero correcto).
        Si duda, pregunta antes de decidir.
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
