import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bot,
  Search,
  Zap,
  ShieldCheck,
  Brain,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center · AMAS" },
      {
        name: "description",
        content:
          "Live mission-control view of the Autonomous Multi-Agent System — agent activity, pending human approvals, KPIs.",
      },
      { property: "og:title", content: "Command Center · AMAS" },
    ],
  }),
  component: CommandCenter,
});

// ————————————————————————————————————————————————
// Mock data
// ————————————————————————————————————————————————

type AgentKey = "orchestrator" | "planner" | "retriever" | "executor" | "validator" | "compliance";

const AGENT_META: Record<AgentKey, { label: string; icon: typeof Bot; tone: string }> = {
  orchestrator: { label: "Orchestrator", icon: Brain, tone: "text-primary" },
  planner: { label: "Planner", icon: Sparkles, tone: "text-info" },
  retriever: { label: "Retriever", icon: Search, tone: "text-warning" },
  executor: { label: "Executor", icon: Zap, tone: "text-primary" },
  validator: { label: "Validator", icon: CheckCircle2, tone: "text-success" },
  compliance: { label: "Compliance", icon: ShieldCheck, tone: "text-critical" },
};

type FeedEvent = {
  id: string;
  agent: AgentKey;
  action: string;
  detail: string;
  latencyMs: number;
  ts: Date;
  status: "ok" | "warn" | "info";
};

const SEED_FEED: Omit<FeedEvent, "id" | "ts">[] = [
  { agent: "retriever", action: "Fetched 12 records", detail: "salesforce.crm.accounts · relevance 0.92", latencyMs: 342, status: "ok" },
  { agent: "planner", action: "Decomposed goal into 4 subtasks", detail: "task_id T-2841 · reconcile-vendor-invoices-q3", latencyMs: 118, status: "info" },
  { agent: "executor", action: "Matched 11 / 12 invoices", detail: "erp.oracle · 1 mismatch escalated", latencyMs: 2140, status: "warn" },
  { agent: "validator", action: "Confidence check passed", detail: "score 0.97 · policy-set finance-v3", latencyMs: 89, status: "ok" },
  { agent: "compliance", action: "No policy violation detected", detail: "sox-2024 · pii-scan clean", latencyMs: 204, status: "ok" },
  { agent: "orchestrator", action: "Handoff → Executor", detail: "context 3.1kB · tools [db.query, mail.send]", latencyMs: 12, status: "info" },
  { agent: "retriever", action: "Vector search top-k=8", detail: "nemo-embed-1.5 · nim/embeddings", latencyMs: 61, status: "ok" },
  { agent: "planner", action: "Rejected fallback strategy", detail: "cost estimate exceeded budget cap $0.12", latencyMs: 44, status: "warn" },
];

const PENDING: Array<{
  id: string;
  title: string;
  agent: AgentKey;
  risk: "low" | "med" | "high";
  confidence: number;
  eta: string;
  summary: string;
}> = [
  {
    id: "APR-4821",
    title: "Send AR reminder to 7 delinquent accounts",
    agent: "executor",
    risk: "med",
    confidence: 0.94,
    eta: "expires in 3m 12s",
    summary: "Executor drafted 7 personalized reminders. Total exposure $184,220. Preview available.",
  },
  {
    id: "APR-4820",
    title: "Update vendor payment terms in ERP",
    agent: "executor",
    risk: "high",
    confidence: 0.88,
    eta: "expires in 11m",
    summary: "Change NET-30 → NET-45 on 3 vendors. Diff: 6 fields. Auditable via record IDs V-118, V-231, V-390.",
  },
  {
    id: "APR-4819",
    title: "Auto-close 42 resolved support tickets",
    agent: "validator",
    risk: "low",
    confidence: 0.99,
    eta: "expires in 22m",
    summary: "All tickets show CSAT ≥ 4 and no reply for 72h. Recommend bulk approve.",
  },
  {
    id: "APR-4818",
    title: "Refund request outside policy window",
    agent: "compliance",
    risk: "high",
    confidence: 0.71,
    eta: "expires in 45m",
    summary: "Order O-77213, 47 days past 30-day window. Customer LTV $12,400. Escalation recommended.",
  },
];

const RISK_STYLES = {
  low: "text-success border-success/30 bg-success/10",
  med: "text-warning border-warning/30 bg-warning/10",
  high: "text-critical border-critical/30 bg-critical/10",
} as const;

// ————————————————————————————————————————————————
// Components
// ————————————————————————————————————————————————

function KpiCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  trend?: string;
  icon: typeof Activity;
  accent?: "primary" | "warning" | "success" | "critical";
}) {
  const accentClass = {
    primary: "text-primary",
    warning: "text-warning",
    success: "text-success",
    critical: "text-critical",
  }[accent ?? "primary"];

  return (
    <div className="panel p-4 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
        </div>
        <div className={cn("rounded-md border border-border bg-background/40 p-1.5", accentClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {trend && (
        <div className={cn("mt-3 flex items-center gap-1 text-[11px] font-medium", accentClass)}>
          <ArrowUpRight className="h-3 w-3" /> {trend}
        </div>
      )}
    </div>
  );
}

function ActivityFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(() =>
    SEED_FEED.slice(0, 6).map((e, i) => ({
      ...e,
      id: `evt-${Date.now()}-${i}`,
      ts: new Date(Date.now() - i * 4200),
    })),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setEvents((prev) => {
        const template = SEED_FEED[Math.floor(Math.random() * SEED_FEED.length)];
        const next: FeedEvent = {
          ...template,
          id: `evt-${Date.now()}-${Math.random()}`,
          ts: new Date(),
          latencyMs: Math.round(template.latencyMs * (0.6 + Math.random() * 0.9)),
        };
        return [next, ...prev].slice(0, 18);
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="status-dot text-primary animate-pulse" />
          <h2 className="text-sm font-semibold">Live agent activity</h2>
          <span className="font-mono text-[10px] text-muted-foreground">
            · ws://orchestrator/stream
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button className="rounded border border-border px-2 py-0.5 hover:text-foreground">All</button>
          <button className="rounded px-2 py-0.5 hover:text-foreground">Handoffs</button>
          <button className="rounded px-2 py-0.5 hover:text-foreground">Errors</button>
        </div>
      </div>

      <ol className="min-h-0 flex-1 overflow-auto">
        {events.map((e, idx) => {
          const meta = AGENT_META[e.agent];
          const Icon = meta.icon;
          return (
            <li
              key={e.id}
              className={cn(
                "flex items-start gap-3 border-b border-hairline px-5 py-3 transition-colors",
                idx === 0 && "animate-slide-in-top bg-primary/5",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/60",
                  meta.tone,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    [{meta.label}]
                  </span>
                  <span className="truncate text-sm text-foreground">{e.action}</span>
                </div>
                <div className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                  {e.detail}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    e.status === "warn" ? "text-warning" : e.status === "ok" ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {e.latencyMs}ms
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {e.ts.toISOString().slice(11, 19)}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PendingRail() {
  const [items, setItems] = useState(PENDING);

  const decide = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  return (
    <div className="panel flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h2 className="text-sm font-semibold">Pending decisions</h2>
        </div>
        <span className="rounded-md border border-warning/30 bg-warning/10 px-2 py-0.5 font-mono text-[10px] text-warning">
          {items.length} awaiting
        </span>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2.5">
        {items.map((item) => {
          const meta = AGENT_META[item.agent];
          return (
            <article
              key={item.id}
              className="rounded-md border border-border bg-background/40 p-3.5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">{item.id}</span>
                <span
                  className={cn(
                    "rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                    RISK_STYLES[item.risk],
                  )}
                >
                  risk · {item.risk}
                </span>
                <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {item.eta}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-medium leading-snug">{item.title}</h3>

              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <meta.icon className={cn("h-3 w-3", meta.tone)} />
                <span>{meta.label}</span>
                <span>·</span>
                <span className="font-mono">conf {(item.confidence * 100).toFixed(0)}%</span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => decide(item.id)}
                  className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
                >
                  Approve
                </button>
                <button
                  onClick={() => decide(item.id)}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-critical/40 hover:text-critical"
                >
                  Reject
                </button>
                <button className="rounded-md border border-border bg-surface px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          );
        })}
        {items.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-8 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
            <p className="mt-2 text-sm">Queue clear</p>
            <p className="mt-1 text-xs text-muted-foreground">
              All agent actions have been approved or auto-processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentStatusStrip() {
  const agents: { key: AgentKey; state: "thinking" | "acting" | "idle" | "blocked"; task: string }[] = [
    { key: "orchestrator", state: "thinking", task: "routing T-2841" },
    { key: "planner", state: "idle", task: "queue empty" },
    { key: "retriever", state: "acting", task: "vector search k=8" },
    { key: "executor", state: "acting", task: "erp.write ×3" },
    { key: "validator", state: "thinking", task: "scoring O-77213" },
    { key: "compliance", state: "idle", task: "policy cache warm" },
  ];
  const stateColor = {
    thinking: "text-info",
    acting: "text-primary",
    idle: "text-muted-foreground",
    blocked: "text-critical",
  };
  return (
    <div className="panel px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sub-agent fleet
        </h2>
        <a href="/agents" className="text-[11px] text-primary hover:underline">
          Open network view →
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {agents.map((a) => {
          const meta = AGENT_META[a.key];
          const Icon = meta.icon;
          return (
            <div
              key={a.key}
              className="flex items-center gap-2.5 rounded-md border border-border bg-background/40 px-3 py-2"
            >
              <div className={cn("rounded-md border border-border p-1.5", meta.tone)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {meta.label}
                  <span className={cn("status-dot", stateColor[a.state])} />
                </div>
                <div className="truncate font-mono text-[10px] text-muted-foreground">
                  {a.state} · {a.task}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";

function CommandCenter() {
  return (
    <div className="grid-bg min-h-full">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-4 p-4 lg:p-6">
        {/* KPI row */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
          <KpiCard
            label="Active agents"
            value="6 / 6"
            sub="orchestrator + 5 specialists"
            icon={Bot}
            accent="primary"
          />
          <KpiCard
            label="Tasks in flight"
            value="34"
            sub="12 parallel · 22 queued"
            trend="+18% vs 1h ago"
            icon={Activity}
            accent="primary"
          />
          <KpiCard
            label="Awaiting approval"
            value="4"
            sub="1 high-risk · SLA 45m"
            icon={AlertTriangle}
            accent="warning"
          />
          <KpiCard
            label="Success rate · 24h"
            value="98.7%"
            sub="2,143 completed · 27 escalated"
            trend="+0.4pt"
            icon={CheckCircle2}
            accent="success"
          />
          <KpiCard
            label="Avg resolution"
            value="4.2s"
            sub="p95 11.8s · nemo-nim 7b"
            trend="-12% latency"
            icon={Clock}
            accent="success"
          />
        </section>

        {/* Agent status strip */}
        <AgentStatusStrip />

        {/* Feed + pending */}
        <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
          <ActivityFeed />
          <PendingRail />
        </section>
      </div>
    </div>
  );
}
