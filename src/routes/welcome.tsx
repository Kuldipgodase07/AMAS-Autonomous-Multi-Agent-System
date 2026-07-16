import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Network, ShieldCheck, Activity, BrainCircuit, Terminal, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome · AMAS Enterprise" }] }),
  component: WelcomePage,
});

function WelcomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Mesh Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      </div>

      {/* Top Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-[0_0_20px_rgba(118,185,0,0.4)]">
            <span className="font-mono text-lg font-bold text-primary-foreground">Λ</span>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">AMAS</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Enterprise Edition</div>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/welcome" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Platform</Link>
          <Link to="/welcome" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
          <Link to="/welcome" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
          <Link 
            to="/login"
            className="ml-4 flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-glow shadow-[0_0_15px_rgba(118,185,0,0.3)] hover:shadow-[0_0_25px_rgba(118,185,0,0.5)]"
          >
            Access Terminal <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className={cn("transition-all duration-1000 ease-out transform", mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0")}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">v1.4 Orchestrator Now Live</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 pb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/20">
            Autonomous<br/>Multi-Agent <span className="text-primary">System</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            The mission-control architecture for enterprise AI. Orchestrate specialized sub-agents, enforce strict Colang guardrails, and monitor highly-parallel GPU telemetry—all from a single surface.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary-glow shadow-[0_0_30px_rgba(118,185,0,0.4)]"
            >
              Launch Command Center <Terminal className="h-5 w-5" />
            </Link>
            <a 
              href="#features"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface/80 px-8 py-4 text-base font-medium text-foreground transition-all hover:bg-surface-elevated backdrop-blur"
            >
              Explore Architecture
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 transition-all duration-1000 delay-300 ease-out transform", mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0")}>
          <FeatureCard 
            icon={BrainCircuit}
            title="Agentic Mesh"
            description="Deploy specialized agents (Retrievers, Planners, Executors) communicating asynchronously."
          />
          <FeatureCard 
            icon={Activity}
            title="HGX Compute Telemetry"
            description="Live, hardware-level NVLink topology graphs powered by complex React Flow architectures."
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="NeMo Guardrails"
            description="Interactive Directed Acyclic Graphs enforcing strict topical, PII, and jailbreak security."
          />
        </div>
      </main>

      {/* Scale Section */}
      <section className="relative z-10 py-24 border-t border-border bg-gradient-to-b from-surface to-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Engineered for Exascale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built to monitor and orchestrate thousands of concurrent agentic workflows across highly-parallel compute clusters.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricCard value="14.8" unit="PFLOPS" label="Sustained Compute" />
            <MetricCard value="< 12" unit="ms" label="Guardrail Latency" />
            <MetricCard value="99.9" unit="%" label="Topology Uptime" />
            <MetricCard value="400+" unit="Nodes" label="Simulated DAGs" />
          </div>
        </div>
      </section>

      {/* Architecture Deep Dive */}
      <section className="relative z-10 py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-2">
              <Network className="h-3 w-3 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">React Flow Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Mission Control Visuals</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experience unparalleled observability. We utilize custom <span className="text-foreground font-mono bg-surface-elevated px-1.5 py-0.5 rounded">@xyflow/react</span> pipelines to visualize sub-agent handoffs, strict Colang enforcement tracks, and massive GPU cluster topologies in real-time.
            </p>
            <ul className="space-y-4 mt-6">
              <li className="flex items-center gap-3 text-muted-foreground"><ChevronRight className="h-4 w-4 text-primary" /> Live Animated Data Streams</li>
              <li className="flex items-center gap-3 text-muted-foreground"><ChevronRight className="h-4 w-4 text-primary" /> Multi-Layer DAG Threat Injection</li>
              <li className="flex items-center gap-3 text-muted-foreground"><ChevronRight className="h-4 w-4 text-primary" /> Dynamic Node Provisioning</li>
            </ul>
          </div>
          <div className="flex-1 w-full bg-surface-elevated border border-border rounded-xl shadow-2xl relative group overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* macOS Window Title Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
              <div className="flex-1 text-center font-mono text-[10px] text-muted-foreground opacity-50">
                amas-orchestrator.ts
              </div>
            </div>

            <div className="bg-surface-elevated p-6 font-mono text-xs md:text-sm text-primary/80 overflow-x-auto leading-relaxed">
              <span className="text-muted-foreground">{"// Initialize Policy Routing"}</span><br/>
              <span className="text-info">const</span> edges = useEdgesState([<br/>
              &nbsp;&nbsp;{'{'} <span className="text-foreground">id:</span> <span className="text-warning">'e-router-pii'</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">source:</span> <span className="text-warning">'router'</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">target:</span> <span className="text-warning">'rule-pii'</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">animated:</span> <span className="text-success">true</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">style:</span> {'{'} stroke: <span className="text-warning">'#76B900'</span> {'}'}<br/>
              &nbsp;&nbsp;{'}'}<br/>
              ]);<br/>
              <br/>
              <span className="text-muted-foreground">{"// Enforce Guardrail Simulation"}</span><br/>
              <span className="text-info">await</span> <span className="text-foreground">colang.enforce</span>(edges);
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-32 text-center border-t border-border bg-gradient-to-t from-surface-elevated to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to take control?</h2>
          <p className="text-xl text-muted-foreground mb-10">Access the terminal and initiate the AMAS Kernel.</p>
          <Link 
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-10 py-5 text-lg font-bold text-primary-foreground transition-all hover:bg-primary-glow shadow-[0_0_40px_rgba(118,185,0,0.5)]"
          >
            Authenticate Now <Lock className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
      
      {/* Full Enterprise Footer */}
      <footer className="relative z-10 border-t border-border bg-background pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 md:col-span-2 pr-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-[0_0_15px_rgba(118,185,0,0.3)]">
                  <span className="font-mono text-sm font-bold text-primary-foreground">Λ</span>
                </div>
                <div className="text-xl font-bold tracking-tight text-foreground">AMAS</div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                The enterprise-grade Autonomous Multi-Agent System. Mission-control orchestration, NeMo Guardrails, and deep HGX telemetry.
              </p>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Agentic Mesh</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Compute Telemetry</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">NeMo Guardrails</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">System Architecture</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              © 2026 AMAS Enterprise. Not an official NVIDIA product.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start text-left p-6 rounded-xl border border-border bg-surface/50 backdrop-blur hover:border-primary/50 transition-colors group">
      <div className="p-3 rounded-lg bg-surface-elevated border border-border mb-6 group-hover:border-primary/50 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function MetricCard({ value, unit, label }: { value: string, unit: string, label: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 border-l border-border first:border-l-0">
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground">{value}</span>
        <span className="text-xl font-bold text-primary">{unit}</span>
      </div>
      <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  )
}
