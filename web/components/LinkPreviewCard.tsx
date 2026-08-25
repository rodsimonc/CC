type Item = {
  title: string;
  url: string;
  outlet?: string;
  snippet?: string;
  year?: string;
  image_url?: string | null;
};

const OUTLET_STYLE: Record<string, { bg: string; label: string }> = {
  lacapitalmdp: { bg: "#B4213C", label: "LC" },
  infobrisas: { bg: "#154B8F", label: "IB" },
  "0223": { bg: "#111111", label: "02" },
  pagina12: { bg: "#000000", label: "12" },
  clarin: { bg: "#D6001C", label: "CL" },
  lanacion: { bg: "#1E4B7A", label: "LN" },
  instagram: { bg: "#C13584", label: "IG" },
  linkedin: { bg: "#0A66C2", label: "in" },
  youtube: { bg: "#FF0000", label: "YT" },
  x: { bg: "#000000", label: "X" },
  twitter: { bg: "#1DA1F2", label: "X" },
  saij: { bg: "#3B5A80", label: "SJ" },
  csjn: { bg: "#1B3A57", label: "CS" },
};

function outletKey(hostname: string): string {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  const first = h.split(".")[0];
  return first;
}

function outletFromUrl(url: string): { key: string; hostname: string } {
  try {
    const u = new URL(url);
    return { key: outletKey(u.hostname), hostname: u.hostname.replace(/^www\./, "") };
  } catch {
    return { key: "generic", hostname: "enlace externo" };
  }
}

function initialsFor(outlet: string): string {
  const words = outlet.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function LinkPreviewCard({ item }: { item: Item }) {
  const { key, hostname } = outletFromUrl(item.url);
  const outletName = item.outlet ?? hostname;
  const style = OUTLET_STYLE[key];
  const bg = style?.bg ?? "#0F2A44";
  const label = style?.label ?? initialsFor(outletName);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex gap-4 rounded-2xl border border-ink/10 bg-paper p-4 hover:shadow-soft hover:border-ink/20 transition"
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt=""
          className="h-24 w-24 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div
          className="h-24 w-24 shrink-0 rounded-xl grid place-items-center text-paper font-serif text-2xl tracking-wider select-none"
          style={{ background: bg }}
          aria-hidden
        >
          {label}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs uppercase tracking-widest text-ink/50 truncate">
            {outletName}
          </p>
          {item.year && (
            <span className="text-xs text-ink/50 tabular-nums shrink-0">{item.year}</span>
          )}
        </div>
        <h3 className="mt-1 font-serif text-lg text-ink leading-snug group-hover:text-ink-soft">
          {item.title}
        </h3>
        {item.snippet && (
          <p className="mt-1.5 text-sm text-ink/70 leading-relaxed line-clamp-2">
            {item.snippet}
          </p>
        )}
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-ink/50 group-hover:text-ink/70">
          {hostname} ↗
        </span>
      </div>
    </a>
  );
}

// Placeholder para mostrar cómo se va a ver el bloque cuando el abogado agregue enlaces
export function LinkPreviewSkeleton({
  outlet,
  title,
  snippet,
}: {
  outlet: string;
  title: string;
  snippet?: string;
}) {
  const style = OUTLET_STYLE[outletKey(outlet)];
  const bg = style?.bg ?? "#0F2A44";
  const label = style?.label ?? initialsFor(outlet);

  return (
    <div className="flex gap-4 rounded-2xl border border-dashed border-ink/20 bg-paper/50 p-4">
      <div
        className="h-24 w-24 shrink-0 rounded-xl grid place-items-center text-paper/80 font-serif text-2xl tracking-wider opacity-70"
        style={{ background: bg }}
        aria-hidden
      >
        {label}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-widest text-ink/40">{outlet}</p>
        <h3 className="mt-1 font-serif text-lg text-ink/70 leading-snug">{title}</h3>
        {snippet && (
          <p className="mt-1.5 text-sm text-ink/50 leading-relaxed line-clamp-2">{snippet}</p>
        )}
        <span className="mt-2 inline-block text-[11px] text-ink/40">
          enlace del abogado ↗
        </span>
      </div>
    </div>
  );
}
