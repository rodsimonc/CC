"use client";

import { useState } from "react";

// Fase 1: mock estático. Fase 2: embebido de Cal.com.
export function BookingCalendar({ lawyerSlug }: { lawyerSlug: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const slots = [
    "Mañana, 09:00",
    "Mañana, 11:30",
    "Miércoles, 15:00",
    "Miércoles, 17:30",
    "Jueves, 10:00",
    "Viernes, 12:00",
  ];
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-6">
      <p className="text-xs uppercase tracking-widest text-ink/50">Elegí un horario</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {slots.map((s) => (
          <button
            key={s}
            onClick={() => setSelected(s)}
            className={
              "rounded-lg border px-3 py-2 text-sm transition " +
              (selected === s
                ? "border-gold bg-gold/20 text-ink"
                : "border-ink/15 bg-white text-ink/80 hover:border-ink/30")
            }
          >
            {s}
          </button>
        ))}
      </div>
      <button
        disabled={!selected}
        className="mt-5 w-full rounded-lg bg-ink text-paper py-2.5 text-sm font-medium disabled:opacity-50 hover:bg-ink-soft transition"
      >
        {selected ? `Confirmar ${selected}` : "Elegí un horario primero"}
      </button>
      <p className="mt-3 text-[11px] text-ink/50">
        Al confirmar te contactamos por email o WhatsApp desde el Estudio Moix Abogados.
      </p>
      <input type="hidden" value={lawyerSlug} readOnly />
    </div>
  );
}
