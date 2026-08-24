import type { Lawyer } from "../lib/api";

export function LawyerHero({ lawyer }: { lawyer: Lawyer }) {
  const initials = lawyer.full_name.split(" ").filter(Boolean).slice(-2).map((s) => s[0]).join("");
  return (
    <section className="container-narrow pt-16 pb-8">
      <div className="grid gap-8 md:grid-cols-[200px_1fr] items-center">
        <div className="mx-auto md:mx-0 h-40 w-40 rounded-full bg-ink/5 grid place-items-center text-4xl font-serif text-ink/60 border border-ink/10">
          {initials}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/50">Abogado matriculado · {lawyer.city}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mt-2">{lawyer.full_name}</h1>
          {lawyer.headline && <p className="text-lg text-ink/70 mt-3">{lawyer.headline}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {lawyer.practice_areas.map((a) => (
              <span key={a} className="rounded-full bg-ink/5 border border-ink/10 px-3 py-1 text-xs text-ink/80 capitalize">
                {a}
              </span>
            ))}
          </div>
          {lawyer.bar_number && (
            <p className="mt-3 text-xs text-ink/50">Matrícula: {lawyer.bar_number}</p>
          )}
        </div>
      </div>
    </section>
  );
}
