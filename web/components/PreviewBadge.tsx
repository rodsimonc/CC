export function PreviewBadge({ label = "Vista previa · Fase 2" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink/70">
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      {label}
    </span>
  );
}

export function PreviewNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-ink/70">
      <span className="font-medium text-ink">Así se verá en Fase 2 · </span>
      {children}
    </div>
  );
}
