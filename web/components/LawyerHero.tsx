import type { Lawyer } from "../lib/api";

const AREA_LABEL: Record<string, string> = {
  penal: "Derecho penal",
  laboral: "Derecho laboral",
  familia: "Derecho de familia",
  civil: "Derecho civil",
  comercial: "Derecho comercial",
  sucesiones: "Sucesiones",
  consumidor: "Defensa del consumidor",
  administrativo: "Derecho administrativo",
  academico: "Actividad académica",
};

export function LawyerHero({ lawyer }: { lawyer: Lawyer }) {
  const initials = lawyer.full_name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((s) => s[0])
    .join("");

  return (
    <section className="border-b border-ink/10 bg-paper">
      <div className="container-narrow pt-14 pb-10">
        <div className="grid gap-8 md:grid-cols-[180px_1fr] items-start">
          <div className="mx-auto md:mx-0 h-40 w-40 rounded-full bg-ink/5 grid place-items-center text-4xl font-serif text-ink/50 border border-ink/10">
            {initials}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
              Abogado matriculado · {lawyer.city ?? "Mar del Plata"}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink mt-3 leading-tight">
              {lawyer.full_name}
            </h1>
            {lawyer.headline && (
              <p className="mt-3 text-lg text-ink/70 leading-snug">{lawyer.headline}</p>
            )}

            <dl className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Áreas</dt>
                <dd className="mt-1 text-ink/80">
                  {lawyer.practice_areas.map((a) => AREA_LABEL[a] ?? a).join(" · ")}
                </dd>
              </div>
              {lawyer.bar_number && (
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Matrícula</dt>
                  <dd className="mt-1 text-ink/80">{lawyer.bar_number}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
