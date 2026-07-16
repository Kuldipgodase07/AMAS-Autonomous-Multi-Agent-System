import { createFileRoute } from "@tanstack/react-router";
import { Link2, ShieldCheck, Clock, Settings, Puzzle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/integrations")({
  head: () => ({ meta: [{ title: "Integrations Hub · AMAS" }] }),
  component: IntegrationsHub,
});

const INTEGRATIONS = [
  {
    id: "int-1",
    name: "Salesforce CRM",
    status: "connected",
    lastSync: "2m ago",
    scopes: ["Read Accounts", "Write Notes", "Read Contacts"],
    logo: "SF",
    color: "bg-blue-600",
  },
  {
    id: "int-2",
    name: "Oracle ERP",
    status: "connected",
    lastSync: "15m ago",
    scopes: ["Read Invoices", "Write Payments", "Read Vendors"],
    logo: "OR",
    color: "bg-red-600",
  },
  {
    id: "int-3",
    name: "Slack Enterprise",
    status: "connected",
    lastSync: "Real-time",
    scopes: ["Post Messages", "Read Channels", "Bot DM"],
    logo: "SL",
    color: "bg-purple-600",
  },
  {
    id: "int-4",
    name: "Microsoft 365",
    status: "warning",
    lastSync: "4h ago",
    scopes: ["Send Email", "Read Calendar"],
    logo: "M3",
    color: "bg-sky-600",
  },
  {
    id: "int-5",
    name: "NVIDIA NIM Services",
    status: "connected",
    lastSync: "Real-time",
    scopes: ["Inference", "Embeddings", "Guardrails"],
    logo: "NV",
    color: "bg-[#76B900]",
  },
  {
    id: "int-6",
    name: "Jira Data Center",
    status: "disconnected",
    lastSync: "Never",
    scopes: ["Read Tickets", "Update Status"],
    logo: "JR",
    color: "bg-blue-800",
  }
];

function IntegrationsHub() {
  return (
    <div className="grid-bg min-h-full">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-6 p-4 lg:p-6">
        
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Integrations Hub</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage connected external systems, APIs, and agent permission scopes.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow transition-colors">
            <Link2 className="h-4 w-4" /> Connect System
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {INTEGRATIONS.map((integration) => (
            <div key={integration.id} className="panel p-5 flex flex-col group hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-sm shadow-sm", integration.color)}>
                    {integration.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{integration.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={cn(
                        "status-dot",
                        integration.status === "connected" ? "text-success" :
                        integration.status === "warning" ? "text-warning" : "text-critical"
                      )} />
                      <span className="text-xs text-muted-foreground capitalize">{integration.status}</span>
                    </div>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <ShieldCheck className="h-3.5 w-3.5" /> Scopes Granted
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {integration.scopes.map(scope => (
                    <span key={scope} className="px-2 py-1 bg-surface border border-border rounded-md text-[10px] font-medium text-foreground">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-5 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Last sync: {integration.lastSync}
                </div>
                {integration.status === "connected" ? (
                  <button className="text-critical hover:underline">Revoke</button>
                ) : (
                  <button className="text-primary hover:underline">Reconnect</button>
                )}
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div className="panel p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer border-dashed border-2 bg-transparent">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-surface">
              <Puzzle className="h-5 w-5" />
            </div>
            <div className="text-sm font-semibold">Add Integration</div>
            <p className="text-xs text-center max-w-[200px]">Connect a new API, database, or SaaS tool to the agent network.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
