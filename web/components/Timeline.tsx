export type TimelineItem = { year: string; title: string; detail?: string };

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative border-l border-ink/15 pl-6 space-y-6">
      {items.map((item, i) => (
        <li key={i}>
          <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-gold border border-ink/20" />
          <p className="text-xs uppercase tracking-widest text-ink/50">{item.year}</p>
          <p className="font-serif text-lg text-ink mt-0.5">{item.title}</p>
          {item.detail && <p className="text-sm text-ink/70 mt-1">{item.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
