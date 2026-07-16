import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, Clock, DollarSign, Target, Activity, Bot, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · AMAS" }] }),
  component: AnalyticsDashboard,
});

const PERFORMANCE_DATA = [
  { name: "00:00", automated: 120, escalated: 4 },
  { name: "04:00", automated: 300, escalated: 12 },
  { name: "08:00", automated: 850, escalated: 45 },
  { name: "12:00", automated: 1200, escalated: 55 },
  { name: "16:00", automated: 980, escalated: 32 },
  { name: "20:00", automated: 400, escalated: 15 },
];

const ACCURACY_DATA = [
  { name: "W1", accuracy: 92.5, latency: 1.2 },
  { name: "W2", accuracy: 94.1, latency: 1.1 },
  { name: "W3", accuracy: 95.8, latency: 0.9 },
  { name: "W4", accuracy: 98.2, latency: 0.8 },
];

const AGENT_STATS = [
  { name: "Planner v2", calls: "14.2k", success: "99.8%", avgTime: "120ms" },
  { name: "Retriever v1", calls: "45.1k", success: "99.1%", avgTime: "340ms" },
  { name: "Executor v3", calls: "12.8k", success: "98.5%", avgTime: "2.1s" },
  { name: "Validator v1", calls: "12.8k", success: "99.9%", avgTime: "85ms" },
];

function AnalyticsDashboard() {
  // Live ROI counter simulation
  const [roi, setRoi] = useState(41700.50);
  
  useEffect(() => {
    const id = setInterval(() => {
      setRoi(prev => prev + (Math.random() * 2.5));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid-bg min-h-full flex flex-col">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-6 p-4 lg:p-6 w-full">
        
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
              metrics · executive
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Impact & ROI Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time telemetry on agent performance, execution costs, and aggregate time saved.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">Live Telemetry</span>
            </div>
            <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm font-medium outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>This Quarter</option>
            </select>
          </div>
        </header>

        {/* Top KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="panel p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
              <Target className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tasks Automated</span>
              </div>
              <div className="text-4xl font-semibold tabular-nums tracking-tight">12,482</div>
              <div className="mt-2 text-xs text-success flex items-center gap-1 font-medium bg-success/10 w-fit px-2 py-0.5 rounded border border-success/20">
                <TrendingUp className="h-3 w-3" /> +14.2% vs last week
              </div>
            </div>
          </div>
          
          <div className="panel p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
              <Clock className="w-24 h-24 text-info" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Clock className="h-4 w-4 text-info" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Hours Saved</span>
              </div>
              <div className="text-4xl font-semibold tabular-nums tracking-tight">3,492</div>
              <div className="mt-2 text-xs text-success flex items-center gap-1 font-medium bg-success/10 w-fit px-2 py-0.5 rounded border border-success/20">
                <TrendingUp className="h-3 w-3" /> +8.1% vs last week
              </div>
            </div>
          </div>

          <div className="panel p-5 relative overflow-hidden group border-primary/30">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
              <DollarSign className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Cost Avoided (Live)</span>
              </div>
              <div className="text-4xl font-semibold tabular-nums tracking-tight text-primary drop-shadow-[0_0_15px_rgba(118,185,0,0.5)]">
                ${roi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="mt-2 text-xs text-primary flex items-center gap-1 font-mono uppercase tracking-widest">
                <Activity className="h-3 w-3 animate-pulse" /> Accumulating
              </div>
            </div>
          </div>

          <div className="panel p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Bot className="h-4 w-4" /> Agent Health
                </span>
              </div>
              <div className="space-y-3 mt-4">
                {AGENT_STATS.map(stat => (
                  <div key={stat.name} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{stat.name}</span>
                    <div className="flex items-center gap-3 font-mono text-muted-foreground">
                      <span>{stat.calls}</span>
                      <span className="text-success">{stat.success}</span>
                      <span>{stat.avgTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[400px]">
          <div className="panel p-5 flex flex-col bg-surface/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  Automation Volume & Escalations
                </h3>
                <p className="text-xs text-muted-foreground mt-1">24-hour distribution</p>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-primary"></span> Automated</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-critical"></span> HITL Escalation</div>
              </div>
            </div>
            <div className="flex-1 min-h-[250px] -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#232B28" vertical={false} />
                  <XAxis dataKey="name" stroke="#68736E" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#68736E" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F0E', borderColor: '#232B28', borderRadius: '6px', fontSize: '12px' }}
                    itemStyle={{ color: '#F5F7F6' }}
                    cursor={{ fill: '#232B28', opacity: 0.4 }}
                  />
                  <Bar dataKey="automated" name="Automated" fill="#76B900" radius={[2, 2, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="escalated" name="Escalated" fill="#E5484D" radius={[2, 2, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel p-5 flex flex-col bg-surface/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-info/50 to-transparent opacity-50" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  System Accuracy Validation
                </h3>
                <p className="text-xs text-muted-foreground mt-1">4-week trailing average of Validator Agent scores</p>
              </div>
              <div className="text-2xl font-semibold tabular-nums text-foreground flex items-center gap-2">
                98.2% <ChevronUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="flex-1 min-h-[250px] -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACCURACY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#76B900" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#76B900" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#232B28" vertical={false} />
                  <XAxis dataKey="name" stroke="#68736E" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis domain={[90, 100]} stroke="#68736E" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F0E', borderColor: '#232B28', borderRadius: '6px', fontSize: '12px' }}
                    itemStyle={{ color: '#F5F7F6' }}
                  />
                  <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#76B900" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
