import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, Fingerprint, Terminal as TerminalIcon, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Access Terminal · AMAS" }] }),
  component: LoginPage,
});

const BOOT_LOGS = [
  "INITIALIZING AMAS KERNEL v1.4.2...",
  "ESTABLISHING SECURE CONNECTION TO HGX CLUSTER...",
  "VERIFYING COLANG POLICY ENFORCEMENT...",
  "MOUNTING AGENTIC MESH...",
  "ALL SYSTEMS OPERATIONAL.",
  "AWAITING BIOMETRIC AUTHENTICATION."
];

function LoginPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const navigate = useNavigate();

  // Boot sequence effect
  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLog]]);
        currentLog++;
      } else {
        setBooted(true);
        clearInterval(interval);
      }
    }, 400); // 400ms per line
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booted) return;
    setAuthenticating(true);
    setTimeout(() => {
      sessionStorage.setItem('auth', 'true');
      navigate({ to: '/' });
    }, 1500); // Mock network request
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background styling */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      </div>

      <Link to="/welcome" className="absolute top-6 left-6 z-20 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-glow shadow-[0_0_15px_rgba(118,185,0,0.3)]">
          <span className="font-mono text-[11px] font-bold text-primary-foreground">Λ</span>
        </div>
        <div className="text-sm font-bold tracking-tight text-foreground">AMAS</div>
      </Link>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Terminal Section */}
        <div className="panel bg-surface border-border shadow-2xl flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-border flex items-center gap-2 bg-surface/50">
            <TerminalIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">syslog</span>
          </div>
          <div className="p-6 font-mono text-xs flex-1 flex flex-col justify-end space-y-2 custom-scrollbar overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-2 text-primary/80">
                <span className="text-muted-foreground mr-3">{'>'}</span>{log}
              </div>
            ))}
            {!booted && (
              <div className="animate-pulse text-muted-foreground">
                <span className="mr-3">{'>'}</span>_
              </div>
            )}
            {booted && (
              <div className="mt-4 pt-4 border-t border-border text-success flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> SECURE HANDSHAKE ESTABLISHED
              </div>
            )}
          </div>
        </div>

        {/* Auth Section */}
        <div className="panel bg-surface border-border shadow-2xl p-8 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full border border-border bg-surface-elevated flex items-center justify-center mb-6">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Access Terminal</h1>
            <p className="text-sm text-muted-foreground">Enter your enterprise credentials to access the AMAS command center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ops ID</label>
              <input 
                type="text" 
                defaultValue="ops.supervisor"
                disabled={!booted || authenticating}
                className="w-full bg-surface-elevated border border-border rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Passkey</label>
              <input 
                type="password" 
                defaultValue="********"
                disabled={!booted || authenticating}
                className="w-full bg-surface-elevated border border-border rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors tracking-[0.3em] disabled:opacity-50"
              />
            </div>

            <button 
              type="submit"
              disabled={!booted || authenticating}
              className="w-full mt-6 group relative flex items-center justify-center gap-3 rounded-md bg-primary px-4 py-3 font-bold text-primary-foreground transition-all hover:bg-primary-glow shadow-[0_0_15px_rgba(118,185,0,0.3)] disabled:opacity-50 disabled:shadow-none disabled:hover:bg-primary"
            >
              {authenticating ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Fingerprint className="h-5 w-5" />
                  AUTHENTICATE
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
