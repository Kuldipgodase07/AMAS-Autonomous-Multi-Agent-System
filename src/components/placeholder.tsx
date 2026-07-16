import { Construction } from "lucide-react";

export function Placeholder({
  eyebrow,
  title,
  description,
  phase,
}: {
  eyebrow: string;
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="grid-bg flex h-full items-center justify-center p-8">
      <div className="panel max-w-lg p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background/60 text-primary">
          <Construction className="h-5 w-5" />
        </div>
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-primary">
          {eyebrow}
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
          <span className="status-dot text-warning" />
          Scheduled · {phase}
        </div>
      </div>
    </div>
  );
}
