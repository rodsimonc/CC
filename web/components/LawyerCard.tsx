import Link from "next/link";
import type { Lawyer } from "@/lib/api";

export function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <Link
      href={`/abogados/${lawyer.slug}`}
      className="group block rounded-2xl border border-ink/10 bg-paper p-5 hover:shadow-soft transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-ink group-hover:text-ink-soft">{lawyer.full_name}</h3>
          {lawyer.headline && <p className="text-sm text-ink/70 mt-1">{lawyer.headline}</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {lawyer.practice_areas.map((a) => (
          <span key={a} className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-ink/70">
            {a}
          </span>
        ))}
      </div>
    </Link>
  );
}
