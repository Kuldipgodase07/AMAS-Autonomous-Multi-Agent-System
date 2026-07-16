import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Download, Filter, Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/governance")({
  head: () => ({ meta: [{ title: "Governance & Audit · AMAS" }] }),
  component: GovernanceAudit,
});

const AUDIT_LOGS = [
  {
    id: "LOG-9921",
    timestamp: "2026-07-14T15:42:11Z",
    actor: "Human (S. Patel)",
    action: "Approved execution",
    target: "Workflow T-2841",
    risk: "High",
    details: "Approved net-30 to net-45 vendor term update.",
  },
  {
    id: "LOG-9920",
    timestamp: "2026-07-14T15:41:05Z",
    actor: "Agent (compliance-v1)",
    action: "Policy scan passed",
    target: "Payload P-812",
    risk: "Low",
    details: "Checked against SOX-2024 compliance ruleset.",
  },
  {
    id: "LOG-9919",
    timestamp: "2026-07-14T15:38:22Z",
    actor: "Agent (executor-v3)",
    action: "API Write",
    target: "Salesforce CRM",
    risk: "Medium",
    details: "Updated 7 account statuses to 'At Risk'.",
  },
  {
    id: "LOG-9918",
    timestamp: "2026-07-14T15:12:00Z",
    actor: "System",
    action: "Workflow triggered",
    target: "Churn Prevention",
    risk: "Medium",
    details: "Scheduled trigger evaluated true (Churn Risk > 80%).",
  },
  {
    id: "LOG-9917",
    timestamp: "2026-07-14T14:45:10Z",
    actor: "Human (J. Doe)",
    action: "Rejected execution",
    target: "Refund R-991",
    risk: "High",
    details: "Refund amount exceeded manual approval threshold. Needs VP sign-off.",
  },
];

function GovernanceAudit() {
  return (
    <div className="grid-bg min-h-full">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-6 p-4 lg:p-6">
        
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" /> Governance & Audit Log
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Immutable, searchable log of all autonomous actions, approvals, and system events.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-surface border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </header>

        <section className="panel flex flex-col flex-1 overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-border flex flex-wrap items-center gap-4 bg-surface/30">
            <div className="flex items-center gap-2 flex-1 min-w-[300px] bg-background border border-border rounded-md px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search logs by ID, Actor, or Target..." 
                className="bg-transparent border-none outline-none flex-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-surface text-sm transition-colors text-muted-foreground">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <select className="bg-background border border-border rounded-md px-3 py-2 text-sm text-muted-foreground outline-none">
                <option>All Risk Levels</option>
                <option>High Risk</option>
                <option>Medium Risk</option>
                <option>Low Risk</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-surface/80 border-b border-border text-xs uppercase text-muted-foreground sticky top-0 backdrop-blur z-10">
                <tr>
                  <th className="px-6 py-4 font-medium">Log ID</th>
                  <th className="px-6 py-4 font-medium">Timestamp (UTC)</th>
                  <th className="px-6 py-4 font-medium">Actor</th>
                  <th className="px-6 py-4 font-medium">Action & Target</th>
                  <th className="px-6 py-4 font-medium">Risk Level</th>
                  <th className="px-6 py-4 font-medium w-full">Details</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-surface/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log.id}</td>
                    <td className="px-6 py-4 font-mono text-xs">{log.timestamp.replace("T", " ").replace("Z", "")}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.actor.includes("Human") ? (
                          <div className="w-2 h-2 rounded-full bg-info" />
                        ) : log.actor.includes("Agent") ? (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        )}
                        <span>{log.actor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{log.action}</div>
                      <div className="text-xs text-muted-foreground">{log.target}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest",
                        log.risk === "High" ? "bg-critical/10 text-critical border border-critical/20" :
                        log.risk === "Medium" ? "bg-warning/10 text-warning border border-warning/20" :
                        "bg-success/10 text-success border border-success/20"
                      )}>
                        {log.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-normal min-w-[300px]">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100">
                        <FileText className="h-3.5 w-3.5" /> View JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border flex items-center justify-between bg-surface/30 text-xs text-muted-foreground">
            <span>Showing 5 of 12,492 logs</span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded border border-border bg-background hover:bg-surface disabled:opacity-50" disabled>Prev</button>
              <button className="px-2 py-1 rounded border border-border bg-background hover:bg-surface">Next</button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
