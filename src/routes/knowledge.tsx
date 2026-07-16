import { createFileRoute } from "@tanstack/react-router";
import { Search, Database, HardDrive, RefreshCw, Layers, Terminal, ChevronRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Explorer · AMAS" }] }),
  component: KnowledgeExplorer,
});

const DATA_SOURCES = [
  { name: "Oracle ERP", status: "syncing", lastSync: "Now", docs: "4.2M", icon: Database, color: "text-blue-500", ring: "stroke-blue-500" },
  { name: "Salesforce", status: "healthy", lastSync: "2m ago", docs: "8.1M", icon: Layers, color: "text-sky-500", ring: "stroke-sky-500" },
  { name: "Confluence", status: "healthy", lastSync: "15m ago", docs: "2.4K", icon: HardDrive, color: "text-purple-500", ring: "stroke-purple-500" },
];

const RAG_TRACE = [
  { step: "Query Formulation", agent: "Retriever", latency: "42ms", details: "Rewrote query: 'unmatched Q3 invoices PO > 50k'", model: "llama-3-70b-instruct" },
  { step: "Vector Search", agent: "Vector DB", latency: "115ms", details: "Scanned 14.5M embeddings. ANN top_k=20", model: "nemo-embed-1.5" },
  { step: "Re-ranking", agent: "Retriever", latency: "89ms", details: "Applied cross-encoder scoring. Kept top 5.", model: "nv-rerank-qa-mistral-4b" },
  { step: "Context Injection", agent: "Planner", latency: "12ms", details: "Assembled 4,092 tokens of context payload.", model: "system" },
];

function KnowledgeExplorer() {
  return (
    <div className="grid-bg h-full flex flex-col">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-6 p-4 lg:p-6 w-full">
        
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
              rag subsystem · live
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Knowledge Explorer</h1>
            <p className="text-sm text-muted-foreground">
              Live vector space visualization, connected data sources, and retrieval query traces.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-surface border border-border rounded-md px-3 py-1.5 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Test RAG query..." className="bg-transparent border-none outline-none text-sm w-64 text-foreground" />
            </div>
            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow transition-colors">
              Execute
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 min-h-0">
          
          {/* Left Column: Data Sources */}
          <div className="flex flex-col gap-4">
            <div className="panel p-4 flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">Vector Store</h2>
              </div>
              <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">ONLINE</div>
            </div>
            
            {DATA_SOURCES.map(ds => (
              <div key={ds.name} className="panel p-5 relative overflow-hidden group">
                {ds.status === "syncing" && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                    <div className="h-full bg-primary animate-pulse w-1/3"></div>
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-background border border-border">
                      <ds.icon className={cn("h-5 w-5", ds.color)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{ds.name}</h3>
                      <p className="text-xs text-muted-foreground">Updated {ds.lastSync}</p>
                    </div>
                  </div>
                  {ds.status === "syncing" ? (
                    <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                  )}
                </div>
                
                <div className="flex items-end justify-between border-t border-border pt-4 mt-2">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Indexed Docs</div>
                    <div className="text-lg font-semibold tabular-nums leading-none">{ds.docs}</div>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Settings</button>
                </div>
              </div>
            ))}
          </div>

          {/* Middle: Vector Space Visualization */}
          <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4">
            <div className="panel flex-1 relative overflow-hidden flex flex-col bg-[#070A09] shadow-2xl border-[#1F2925] group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <div className="p-2 bg-[#0B0F0E] rounded-md border border-[#1F2925] shadow-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">Vector Embedding Space</h3>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">2D PCA · 1,536 Dimensions</p>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <span className="text-[9px] font-mono border border-info/30 bg-info/10 text-info px-2 py-1 rounded shadow-[0_0_10px_rgba(59,130,246,0.1)]">NEMO-EMBED-1.5</span>
                <span className="text-[9px] font-mono border border-primary/30 bg-primary/10 text-primary px-2 py-1 rounded shadow-[0_0_10px_rgba(118,185,0,0.1)]">MILVUS DB</span>
              </div>

              {/* Interactive Vector Canvas */}
              <VectorCanvas />
            </div>

            {/* Trace Inspector */}
            <div className="panel h-64 flex flex-col overflow-hidden bg-[#0B0F0E]">
              <div className="border-b border-border p-3 flex items-center justify-between bg-surface">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Live Trace Inspector</h3>
                </div>
                <div className="text-xs font-mono text-muted-foreground">ID: TRC-9421-B</div>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-1 custom-scrollbar">
                {RAG_TRACE.map((trace, i) => (
                  <div key={i} className="flex flex-col gap-1 py-2 border-b border-[#1F2925] last:border-0 hover:bg-[#1F2925]/30 p-2 rounded transition-colors group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs font-mono font-semibold text-primary">{String(i+1).padStart(2, '0')}</span>
                        <span className="text-sm font-medium">{trace.step}</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-[#1F2925] ml-2">
                          {trace.agent}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-info">{trace.latency}</span>
                    </div>
                    <div className="flex items-center justify-between pl-8">
                      <p className="text-xs text-muted-foreground font-mono">{trace.details}</p>
                      <span className="text-[10px] text-muted-foreground border border-[#1F2925] bg-background/50 px-1 rounded">{trace.model}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function VectorCanvas() {
  const [hoveredNode, setHoveredNode] = useState<{ x: number, y: number, id: string, meta: string, sim: string } | null>(null);

  // Generate deterministic clusters
  const nodes = useMemo(() => {
    type VectorNode = { id: string; x: number; y: number; r: number; color: string; meta: string; sim: string };
    const arr: VectorNode[] = [];
    const clusters = [
      { id: 'c1', cx: 300, cy: 200, count: 250, radius: 120, color: 'fill-primary/70' },
      { id: 'c2', cx: 650, cy: 150, count: 200, radius: 140, color: 'fill-info/60' },
      { id: 'c3', cx: 800, cy: 300, count: 150, radius: 100, color: 'fill-warning/50' }
    ];

    clusters.forEach(c => {
      for (let i = 0; i < c.count; i++) {
        const r = c.radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        arr.push({
          id: `${c.id}-${i}`,
          x: c.cx + r * Math.cos(theta),
          y: c.cy + r * Math.sin(theta),
          r: Math.random() > 0.9 ? 3 : 1.5,
          color: c.color,
          meta: `[${(Math.random()*2 - 1).toFixed(4)}, ${(Math.random()*2 - 1).toFixed(4)}]`,
          sim: (0.7 + Math.random()*0.29).toFixed(3)
        });
      }
    });
    return arr;
  }, []);

  const activeQuery = { x: 320, y: 180 };

  return (
    <div className="flex-1 w-full h-full relative cursor-crosshair">
      <svg viewBox="0 0 1000 400" className="w-full h-full">
        {/* Grid Overlay */}
        <g className="stroke-[#1F2925]" strokeWidth="1" strokeDasharray="4 4">
          <line x1="0" y1="100" x2="1000" y2="100" />
          <line x1="0" y1="200" x2="1000" y2="200" />
          <line x1="0" y1="300" x2="1000" y2="300" />
          <line x1="250" y1="0" x2="250" y2="400" />
          <line x1="500" y1="0" x2="500" y2="400" />
          <line x1="750" y1="0" x2="750" y2="400" />
        </g>

        {/* Dense Vector Nodes */}
        {nodes.map(n => (
          <circle 
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.r}
            className={cn(n.color, "transition-all duration-300 hover:fill-foreground")}
            onMouseEnter={() => setHoveredNode(n)}
            onMouseLeave={() => setHoveredNode(null)}
          />
        ))}

        {/* K-Nearest Neighbor Traces */}
        {nodes.slice(0, 5).map((n, i) => (
          <line key={`line-${i}`} x1={activeQuery.x} y1={activeQuery.y} x2={n.x} y2={n.y} className="stroke-primary/40 animate-pulse" strokeWidth="1" strokeDasharray="2 2" />
        ))}

        {/* Active Semantic Query */}
        <circle cx={activeQuery.x} cy={activeQuery.y} r="6" className="fill-foreground animate-pulse" />
        <circle cx={activeQuery.x} cy={activeQuery.y} r="18" className="stroke-foreground fill-none animate-ping" strokeWidth={1} />
        <text x={activeQuery.x + 12} y={activeQuery.y - 12} fill="currentColor" fontSize="10" fontFamily="monospace" className="text-foreground">Incoming Query</text>
      </svg>

      {/* Vector Hover Tooltip */}
      {hoveredNode && (
        <div 
          className="absolute z-50 pointer-events-none bg-[#0B0F0E]/90 backdrop-blur border border-[#1F2925] p-3 rounded-lg shadow-2xl flex flex-col gap-1.5 min-w-[140px]"
          style={{ 
            left: `${(hoveredNode.x / 1000) * 100}%`, 
            top: `${(hoveredNode.y / 400) * 100}%`,
            transform: 'translate(-50%, -120%)'
          }}
        >
          <div className="font-mono text-[10px] text-primary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            NODE: {hoveredNode.id.toUpperCase()}
          </div>
          <div className="font-mono text-[9px] text-muted-foreground mt-1">EMBED: {hoveredNode.meta}...</div>
          <div className="font-mono text-[9px] text-info">COS_SIM: {hoveredNode.sim}</div>
        </div>
      )}
    </div>
  );
}
