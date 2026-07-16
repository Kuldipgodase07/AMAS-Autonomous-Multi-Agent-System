import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Brain, Sparkles, Search, Zap, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agent Network · AMAS" },
      {
        name: "description",
        content:
          "Force-directed view of the AMAS agent topology — orchestrator, specialists, live message-passing between agents.",
      },
      { property: "og:title", content: "Agent Network · AMAS" },
    ],
  }),
  component: AgentNetwork,
});

type NodeKey = "orchestrator" | "planner" | "retriever" | "executor" | "validator" | "compliance";
type Status = "idle" | "thinking" | "acting" | "blocked" | "error";

interface AgentNode {
  key: NodeKey;
  label: string;
  role: string;
  icon: typeof Brain;
  status: Status;
  currentTask: string;
  tools: string[];
  recent: { at: string; text: string }[];
  tokens: number;
  latencyMs: number;
  cx: number;
  cy: number;
}

const STATUS_STYLES: Record<Status, { ring: string; dot: string; label: string }> = {
  idle: { ring: "stroke-border", dot: "text-muted-foreground", label: "Idle" },
  thinking: { ring: "stroke-info", dot: "text-info", label: "Thinking" },
  acting: { ring: "stroke-primary", dot: "text-primary", label: "Acting" },
  blocked: { ring: "stroke-warning", dot: "text-warning", label: "Blocked" },
  error: { ring: "stroke-critical", dot: "text-critical", label: "Error" },
};

// Radial layout: orchestrator at center, 5 specialists around it
const NODES: AgentNode[] = [
  {
    key: "orchestrator",
    label: "Orchestrator",
    role: "Primary · routing & delegation",
    icon: Brain,
    status: "thinking",
    currentTask: "Routing task T-2841 → Planner",
    tools: ["registry.agents", "policy.eval", "context.store"],
    recent: [
      { at: "12:04:11", text: "Delegated T-2841 to Planner" },
      { at: "12:04:09", text: "Received goal: reconcile Q3 vendor invoices" },
      { at: "12:03:58", text: "Compliance clearance obtained for T-2839" },
      { at: "12:03:47", text: "Closed T-2836 (success)" },
      { at: "12:03:31", text: "Handoff Executor → Validator" },
    ],
    tokens: 148_320,
    latencyMs: 12,
    cx: 500,
    cy: 340,
  },
  {
    key: "planner",
    label: "Planner",
    role: "Task decomposition · DAG synthesis",
    icon: Sparkles,
    status: "acting",
    currentTask: "Decomposing T-2841 into 4 subtasks",
    tools: ["nim.reasoning-70b", "workflow.templates", "cost.estimator"],
    recent: [
      { at: "12:04:10", text: "Selected strategy: parallel-fetch + serial-write" },
      { at: "12:04:08", text: "Rejected fallback: cost cap exceeded" },
      { at: "12:04:02", text: "Loaded template: finance.reconciliation.v3" },
    ],
    tokens: 42_110,
    latencyMs: 118,
    cx: 500,
    cy: 110,
  },
  {
    key: "retriever",
    label: "Retriever",
    role: "RAG · knowledge acquisition",
    icon: Search,
    status: "acting",
    currentTask: "Vector search over erp.oracle + email.inbox",
    tools: ["nemo.embed-1.5", "vector.store", "sql.readonly", "gmail.api"],
    recent: [
      { at: "12:04:12", text: "Returned 12 docs · top score 0.92" },
      { at: "12:04:10", text: "Query: 'Q3 vendor invoices unmatched'" },
      { at: "12:04:06", text: "Cache miss · triggered live pull" },
    ],
    tokens: 88_540,
    latencyMs: 342,
    cx: 780,
    cy: 220,
  },
  {
    key: "executor",
    label: "Executor",
    role: "Action layer · tool invocation",
    icon: Zap,
    status: "acting",
    currentTask: "Writing 11 matches to erp.oracle.ledger",
    tools: ["erp.oracle", "mail.send", "slack.post", "webhook"],
    recent: [
      { at: "12:04:11", text: "Wrote 11/12 records · 1 pending human review" },
      { at: "12:04:07", text: "Requested approval for high-risk write" },
      { at: "12:03:59", text: "Batched 12 API calls into 3 transactions" },
    ],
    tokens: 21_780,
    latencyMs: 2140,
    cx: 720,
    cy: 500,
  },
  {
    key: "validator",
    label: "Validator",
    role: "Confidence · schema · output QA",
    icon: CheckCircle2,
    status: "thinking",
    currentTask: "Scoring executor output against gold-set",
    tools: ["schema.check", "gold.dataset", "confidence.scorer"],
    recent: [
      { at: "12:04:12", text: "Confidence 0.97 · pass" },
      { at: "12:04:04", text: "Detected 1 mismatch · flagged for HITL" },
    ],
    tokens: 12_040,
    latencyMs: 89,
    cx: 280,
    cy: 500,
  },
  {
    key: "compliance",
    label: "Compliance",
    role: "Policy · PII · audit gating",
    icon: ShieldCheck,
    status: "idle",
    currentTask: "Policy cache warm · awaiting requests",
    tools: ["policy.sox-2024", "pii.scanner", "audit.log"],
    recent: [
      { at: "12:03:58", text: "Cleared T-2839 (no violations)" },
      { at: "12:03:41", text: "Blocked T-2834 · PII exfil risk" },
    ],
    tokens: 6_210,
    latencyMs: 204,
    cx: 220,
    cy: 220,
  },
];

// Edges from/to nodeKey
const EDGES: Array<{ from: NodeKey; to: NodeKey; active?: boolean }> = [
  { from: "orchestrator", to: "planner", active: true },
  { from: "planner", to: "retriever", active: true },
  { from: "planner", to: "executor" },
  { from: "retriever", to: "executor", active: true },
  { from: "executor", to: "validator" },
  { from: "validator", to: "orchestrator" },
  { from: "compliance", to: "orchestrator" },
  { from: "orchestrator", to: "executor" },
];

function NodeCircle({
  node,
  selected,
  onClick,
}: {
  node: AgentNode;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = node.icon;
  const s = STATUS_STYLES[node.status];
  const isRoot = node.key === "orchestrator";
  const r = isRoot ? 54 : 44;

  return (
    <g
      transform={`translate(${node.cx}, ${node.cy})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      {node.status === "acting" && (
        <circle r={r} className="fill-primary/20 animate-pulse-ring" />
      )}
      <circle
        r={r + 8}
        className={cn(
          "fill-none transition-all",
          selected ? "stroke-primary" : "stroke-border",
        )}
        strokeWidth={selected ? 1.5 : 1}
        strokeDasharray="2 4"
      />
      <circle
        r={r}
        className={cn("fill-[oklch(0.22_0.008_165)] transition-all", s.ring)}
        strokeWidth={2}
      />
      <foreignObject x={-r} y={-r} width={r * 2} height={r * 2} className="pointer-events-none">
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-center">
          <Icon className={cn("h-5 w-5", s.dot)} />
          <div className="text-[10px] font-semibold leading-tight">{node.label}</div>
          <div className={cn("font-mono text-[8px] uppercase tracking-widest", s.dot)}>
            {s.label}
          </div>
        </div>
      </foreignObject>
    </g>
  );
}

function AgentNetwork() {
  const [selected, setSelected] = useState<NodeKey>("orchestrator");
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulseTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  const byKey = useMemo(() => Object.fromEntries(NODES.map((n) => [n.key, n])) as Record<NodeKey, AgentNode>, []);
  const active = byKey[selected];

  // Rotate which edges "pulse" so the graph feels live
  const liveEdges = useMemo(() => {
    return EDGES.map((e, i) => ({ ...e, active: e.active || (pulseTick + i) % 4 === 0 }));
  }, [pulseTick]);

  return (
    <div className="grid-bg h-full">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-4 p-4 lg:p-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
              topology · live
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Agent network</h1>
            <p className="text-sm text-muted-foreground">
              Primary orchestrator coordinating 5 specialists. Pulses show live message-passing.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {(["thinking", "acting", "idle", "blocked", "error"] as Status[]).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className={cn("status-dot", STATUS_STYLES[s].dot)} />
                <span className="capitalize">{s}</span>
              </div>
            ))}
          </div>
        </header>

        <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Graph */}
          <div className="panel relative overflow-hidden">
            <svg viewBox="0 0 1000 640" className="h-full w-full">
              <defs>
                <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.75 0.19 130 / 0.12)" />
                  <stop offset="70%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width="1000" height="640" fill="url(#bg-glow)" />

              {/* Edges */}
              {liveEdges.map((e, i) => {
                const a = byKey[e.from];
                const b = byKey[e.to];
                return (
                  <g key={i}>
                    <line
                      x1={a.cx}
                      y1={a.cy}
                      x2={b.cx}
                      y2={b.cy}
                      className={cn(
                        e.active ? "stroke-primary" : "stroke-border",
                      )}
                      strokeWidth={e.active ? 1.4 : 1}
                      strokeOpacity={e.active ? 0.9 : 0.5}
                    />
                    {e.active && (
                      <line
                        x1={a.cx}
                        y1={a.cy}
                        x2={b.cx}
                        y2={b.cy}
                        className="stroke-primary-glow animate-edge-flow"
                        strokeWidth={2}
                        strokeOpacity={0.8}
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {NODES.map((n) => (
                <NodeCircle
                  key={n.key}
                  node={n}
                  selected={selected === n.key}
                  onClick={() => setSelected(n.key)}
                />
              ))}
            </svg>
          </div>

          {/* Detail panel */}
          <aside className="panel flex flex-col">
            <div className="flex items-start gap-3 border-b border-border p-5">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background/60",
                  STATUS_STYLES[active.status].dot,
                )}
              >
                <active.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">{active.label}</h2>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                      STATUS_STYLES[active.status].dot,
                    )}
                  >
                    <span className={cn("status-dot", STATUS_STYLES[active.status].dot)} />
                    {STATUS_STYLES[active.status].label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{active.role}</p>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setSelected("orchestrator")}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-border px-5 py-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Current task
              </div>
              <p className="mt-1.5 text-sm">{active.currentTask}</p>
            </div>

            <div className="grid grid-cols-2 border-b border-border">
              <div className="border-r border-border px-5 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tokens / 24h
                </div>
                <div className="mt-1 font-mono text-lg font-semibold tabular-nums">
                  {active.tokens.toLocaleString()}
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Latency p50
                </div>
                <div className="mt-1 font-mono text-lg font-semibold tabular-nums">
                  {active.latencyMs}ms
                </div>
              </div>
            </div>

            <div className="border-b border-border px-5 py-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Tools
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-border bg-background/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Recent actions
              </div>
              <ol className="space-y-2">
                {active.recent.map((r, i) => (
                  <li key={i} className="flex gap-3 border-l-2 border-border pl-3 text-xs">
                    <span className="font-mono text-[10px] text-muted-foreground">{r.at}</span>
                    <span>{r.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
