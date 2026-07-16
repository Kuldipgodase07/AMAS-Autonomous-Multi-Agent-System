import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  Activity,
  Network,
  Workflow,
  Database,
  BarChart3,
  Settings,
  ShieldCheck,
  Command,
  CircleUser,
  Cpu,
  ShieldAlert
} from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { cn } from "@/lib/utils";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Error 404</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Route not resolved</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The orchestrator has no agent registered for this path.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-glow"
        >
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-critical">System fault</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">This surface failed to render</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The reasoning trace has been logged. Retry the operation or return home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-glow"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Command Center
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AMAS — Autonomous Multi-Agent Command Center" },
      {
        name: "description",
        content:
          "Mission-control console for the Autonomous Multi-Agent System. Supervise orchestrator, sub-agents, approvals and reasoning traces in real time.",
      },
      { name: "author", content: "AMAS" },
      { name: "theme-color", content: "#0B0F0E" },
      { property: "og:title", content: "AMAS — Autonomous Multi-Agent Command Center" },
      {
        property: "og:description",
        content:
          "Enterprise-grade orchestration UI for autonomous agents. Live traces, human-in-the-loop approvals, governance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Command Center", icon: Activity },
  { to: "/agents", label: "Agent Network", icon: Network },
  { to: "/workflows", label: "Workflows", icon: Workflow },
  { to: "/knowledge", label: "Knowledge", icon: Database },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/integrations", label: "Integrations Hub", icon: Command },
  { to: "/compute", label: "Compute Telemetry", icon: Cpu },
  { to: "/guardrails", label: "NeMo Guardrails", icon: ShieldAlert },
] as const;

import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('auth');
    navigate({ to: '/welcome' });
  };

  return (
    <aside className={cn(
      "hidden md:flex shrink-0 flex-col border-r border-border bg-surface/40 backdrop-blur transition-all duration-300 relative",
      isCollapsed ? "w-16" : "w-60"
    )}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <div className={cn("flex items-center px-4 py-5 border-b border-border h-[72px]", isCollapsed ? "justify-center" : "gap-2.5")}>
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-glow)]">
          <span className="font-mono text-[11px] font-bold text-primary-foreground">Λ</span>
        </div>
        {!isCollapsed && (
          <div className="leading-tight overflow-hidden whitespace-nowrap">
            <div className="text-sm font-semibold tracking-tight">AMAS</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Orchestrator v1.4
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              title={isCollapsed ? label : undefined}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm transition-colors relative",
                isCollapsed ? "justify-center" : "gap-3",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className={cn("shrink-0 h-4 w-4", active && "text-primary")} />
              {!isCollapsed && <span className="truncate">{label}</span>}
              {active && !isCollapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px] shadow-primary" />}
              {active && isCollapsed && <span className="absolute right-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px] shadow-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-2 py-3 space-y-1">
        <Link
          to="/governance"
          title={isCollapsed ? "Governance" : undefined}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Governance</span>}
        </Link>
        <Link
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Log out" : undefined}
          className={cn(
            "w-full flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-critical/10 hover:text-critical transition-colors",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Disconnect Terminal</span>}
        </button>

        <div className={cn("mt-2 flex items-center rounded-md border border-border bg-background/60", isCollapsed ? "p-2 justify-center" : "px-3 py-2.5 gap-3")}>
          <CircleUser className="h-6 w-6 shrink-0 text-muted-foreground" />
          {!isCollapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-xs font-medium">Ops Supervisor</div>
              <div className="truncate font-mono text-[10px] text-muted-foreground">tier: approve-all</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center gap-2 text-sm">
        <span className="status-dot text-success animate-pulse" />
        <span className="text-muted-foreground">All systems operational</span>
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          · region us-east-1 · NIM cluster nemo-7b
        </span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="hidden lg:flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Command className="h-3.5 w-3.5" />
          <span>Jump to…</span>
          <kbd className="ml-4 rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <div className="font-mono text-[11px] text-muted-foreground">
          {new Date().toISOString().slice(0, 19).replace("T", " ")} UTC
        </div>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  const isAuthPage = pathname === '/welcome' || pathname === '/login';

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthPage && sessionStorage.getItem('auth') !== 'true') {
      navigate({ to: '/welcome', replace: true });
    }
  }, [pathname, isAuthPage, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-dvh w-full bg-background text-foreground">
        {!isAuthPage && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          {!isAuthPage && <TopBar />}
          <main className={cn("min-w-0 flex-1", isAuthPage && "flex flex-col")}>
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
