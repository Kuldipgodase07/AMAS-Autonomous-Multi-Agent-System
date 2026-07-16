import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Lock, AlertTriangle, Fingerprint, Terminal, Database, Send, AlertOctagon, Activity, ToggleLeft, ToggleRight, Layers, GitMerge, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export const Route = createFileRoute("/guardrails")({
  head: () => ({ meta: [{ title: "NeMo Guardrails Command · AMAS" }] }),
  component: GuardrailsDashboard,
});

const INITIAL_EVENTS = [
  { id: "EVT-8A2F", time: "11:42:01.004", rail: "Topical_Restriction", agent: "Executor_v3", severity: "WARN", action: "DROPPED" },
  { id: "EVT-9B1C", time: "11:15:33.892", rail: "Hallucination_Check", agent: "Retriever_v1", severity: "CRIT", action: "BLOCKED" },
];

// --- React Flow Custom Nodes ---

const BaseNode = ({ data }: any) => {
  const { icon: Icon, title, active, isThreat } = data;
  return (
    <div className={cn(
      "w-[160px] bg-[#0B0F0E] border rounded-lg p-3 flex flex-col items-center gap-2 shadow-lg transition-all duration-300 relative",
      active ? (isThreat ? "border-critical shadow-[0_0_20px_rgba(229,72,77,0.3)]" : "border-primary/50 shadow-[0_0_20px_rgba(118,185,0,0.1)]") : "border-[#1F2925] opacity-50 grayscale"
    )}>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Icon className={cn("h-5 w-5", active ? (isThreat ? "text-critical" : "text-primary") : "text-muted-foreground")} />
      <span className={cn("font-mono text-[10px] uppercase font-bold text-center", active ? "text-foreground" : "text-muted-foreground")}>{title}</span>
      {active && !isThreat && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
      )}
      {isThreat && (
        <div className="absolute inset-0 rounded-lg border-2 border-critical animate-ping opacity-20" />
      )}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

const EngineNode = ({ data }: any) => {
  const isThreat = data.state === 'threat';
  return (
    <div className={cn(
      "w-[140px] h-[180px] bg-[#070A09] rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative border-2",
      isThreat ? "border-critical shadow-[0_0_50px_rgba(229,72,77,0.4)]" : "border-primary/80 shadow-[0_0_40px_rgba(118,185,0,0.2)]"
    )}>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      {isThreat && (
        <div className="absolute -inset-4 rounded-2xl border border-critical/50 animate-ping opacity-20" />
      )}

      <Lock className={cn("h-8 w-8 mb-4 transition-colors z-10", isThreat ? 'text-critical' : 'text-primary')} />
      <span className="font-mono text-xs font-bold tracking-widest text-foreground text-center z-10">COLANG<br/>ENGINE</span>
      <div className="mt-4 w-full px-3 flex justify-between text-[9px] font-mono opacity-80 z-10">
        <span className={isThreat ? 'text-critical' : 'text-primary'}>v2.4</span>
        <span className={isThreat ? 'text-critical font-bold animate-pulse' : 'text-primary'}>
          {isThreat ? 'BLOCKING' : 'ACTIVE'}
        </span>
      </div>
      
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};


function GuardrailsDashboard() {
  const [simState, setSimState] = useState<'idle' | 'clean' | 'threat'>('idle');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [chartData, setChartData] = useState<any[]>(Array.from({length: 20}, (_, i) => ({ time: i, throughput: Math.random() * 50 + 200, latency: Math.random() * 5 + 10 })));
  
  // Rule Toggles
  const [rules, setRules] = useState({
    jailbreak: true,
    pii: true,
    topic: true,
    sanitizer: true
  });

  const toggleRule = (rule: keyof typeof rules) => {
    setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
  };

  // Telemetry loop
  useEffect(() => {
    const id = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        let spike = simState !== 'idle' ? 150 : 0;
        newData.push({
          time: prev[prev.length - 1].time + 1,
          throughput: Math.random() * 50 + 200 + (simState === 'clean' ? spike : 0),
          latency: Math.random() * 5 + 10 + (simState === 'threat' ? spike/10 : 0)
        });
        return newData;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [simState]);

  // React Flow Setup
  const nodeTypes = useMemo(() => ({ baseNode: BaseNode, engineNode: EngineNode }), []);
  
  const initialNodes: Node[] = [
    { id: 'input', type: 'baseNode', position: { x: 50, y: 300 }, data: { icon: Terminal, title: 'External Agent', active: true } },
    { id: 'router', type: 'baseNode', position: { x: 300, y: 300 }, data: { icon: GitMerge, title: 'Input Router', active: true } },
    { id: 'rule-jailbreak', type: 'baseNode', position: { x: 550, y: 150 }, data: { icon: AlertTriangle, title: 'Jailbreak Detect', active: rules.jailbreak } },
    { id: 'rule-pii', type: 'baseNode', position: { x: 550, y: 300 }, data: { icon: Fingerprint, title: 'PII Masking', active: rules.pii } },
    { id: 'rule-topic', type: 'baseNode', position: { x: 550, y: 450 }, data: { icon: ShieldCheck, title: 'Topic Restriction', active: rules.topic } },
    { id: 'engine', type: 'engineNode', position: { x: 850, y: 260 }, data: { state: simState } },
    { id: 'llm', type: 'baseNode', position: { x: 1150, y: 300 }, data: { icon: Database, title: 'LLM Backend', active: true } },
    { id: 'sanitizer', type: 'baseNode', position: { x: 1400, y: 300 }, data: { icon: FileText, title: 'Output Sanitizer', active: rules.sanitizer } },
  ];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Sync state to graph
  useEffect(() => {
    setNodes(nds => nds.map(n => {
      if (n.id === 'engine') return { ...n, data: { ...n.data, state: simState } };
      if (n.id === 'rule-jailbreak') return { ...n, data: { ...n.data, active: rules.jailbreak, isThreat: simState === 'threat' && rules.jailbreak } };
      if (n.id === 'rule-pii') return { ...n, data: { ...n.data, active: rules.pii } };
      if (n.id === 'rule-topic') return { ...n, data: { ...n.data, active: rules.topic } };
      if (n.id === 'sanitizer') return { ...n, data: { ...n.data, active: rules.sanitizer } };
      return n;
    }));
    
    // Dynamic Edges (Always live and animated for active rules)
    const getStroke = (isActive: boolean, isThreatPath: boolean) => {
      if (!isActive) return '#0B0F0E'; // Invisible/disabled
      if (simState === 'threat' && isThreatPath) return '#E5484D';
      if (simState === 'clean') return '#76B900';
      return 'rgba(118, 185, 0, 0.4)'; // Idle baseline flow
    };
    
    const getWidth = (isActive: boolean, isThreatPath: boolean) => {
      if (!isActive) return 2;
      return (simState !== 'idle' && (simState === 'clean' || isThreatPath)) ? 3 : 2;
    };

    const newEdges: Edge[] = [
      { id: 'e-in-router', source: 'input', target: 'router', type: 'smoothstep', style: { stroke: getStroke(true, false), strokeWidth: getWidth(true, false) }, animated: true },
      
      { id: 'e-router-jb', source: 'router', target: 'rule-jailbreak', type: 'smoothstep', style: { stroke: getStroke(rules.jailbreak, true), strokeWidth: getWidth(rules.jailbreak, true) }, animated: rules.jailbreak },
      { id: 'e-router-pii', source: 'router', target: 'rule-pii', type: 'smoothstep', style: { stroke: getStroke(rules.pii, false), strokeWidth: getWidth(rules.pii, false) }, animated: rules.pii },
      { id: 'e-router-topic', source: 'router', target: 'rule-topic', type: 'smoothstep', style: { stroke: getStroke(rules.topic, false), strokeWidth: getWidth(rules.topic, false) }, animated: rules.topic },
      
      { id: 'e-jb-eng', source: 'rule-jailbreak', target: 'engine', type: 'smoothstep', style: { stroke: getStroke(rules.jailbreak, true), strokeWidth: getWidth(rules.jailbreak, true) }, animated: rules.jailbreak },
      { id: 'e-pii-eng', source: 'rule-pii', target: 'engine', type: 'smoothstep', style: { stroke: getStroke(rules.pii, false), strokeWidth: getWidth(rules.pii, false) }, animated: rules.pii },
      { id: 'e-topic-eng', source: 'rule-topic', target: 'engine', type: 'smoothstep', style: { stroke: getStroke(rules.topic, false), strokeWidth: getWidth(rules.topic, false) }, animated: rules.topic },
      
      { id: 'e-eng-llm', source: 'engine', target: 'llm', type: 'smoothstep', style: { stroke: simState === 'threat' ? '#1F2925' : getStroke(true, false), strokeWidth: simState === 'threat' ? 2 : getWidth(true, false), strokeDasharray: simState === 'threat' ? '4 4' : 'none' }, animated: simState !== 'threat', label: simState === 'threat' ? 'BLOCKED' : '', labelStyle: { fill: '#E5484D', fontWeight: 700, fontFamily: 'monospace' }, labelBgStyle: { fill: 'transparent' } },
      
      { id: 'e-llm-sanitizer', source: 'llm', target: 'sanitizer', type: 'smoothstep', style: { stroke: getStroke(rules.sanitizer, false), strokeWidth: getWidth(rules.sanitizer, false) }, animated: rules.sanitizer },
    ];
    setEdges(newEdges);
  }, [simState, rules, setNodes, setEdges]);


  const injectThreat = () => {
    if (simState !== 'idle') return;
    setSimState('threat');
    setTimeout(() => {
      setEvents(prev => [{
        id: `EVT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        time: new Date().toISOString().substring(11, 23),
        rail: "Jailbreak_Detect",
        agent: "External_Input",
        severity: "FATAL",
        action: "BANNED"
      }, ...prev]);
    }, 1500);
    setTimeout(() => setSimState('idle'), 3000);
  };

  const sendClean = () => {
    if (simState !== 'idle') return;
    setSimState('clean');
    setTimeout(() => setSimState('idle'), 3000);
  };

  return (
    <div className="grid-bg min-h-full flex flex-col">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-6 p-4 lg:p-6 w-full">
        
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-critical flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" /> enterprise security command
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">NeMo Guardrails Command</h1>
            <p className="text-sm text-muted-foreground">
              Mission Control for active Colang policy enforcement, routing, and live threat telemetry.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={sendClean}
              disabled={simState !== 'idle'}
              className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success hover:bg-success/20 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> Send Clean Traffic
            </button>
            <button 
              onClick={injectThreat}
              disabled={simState !== 'idle' || !rules.jailbreak}
              className="flex items-center gap-2 rounded-md border border-critical/30 bg-critical/10 px-4 py-2 text-sm font-medium text-critical hover:bg-critical/20 transition-colors shadow-[0_0_15px_rgba(229,72,77,0.2)] disabled:opacity-50"
              title={!rules.jailbreak ? "Enable Jailbreak Detection to inject threat" : ""}
            >
              <AlertOctagon className="h-4 w-4" /> Inject Adversarial Threat
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
          
          {/* Main Visualization: The Prompt Pipeline */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            <div className="panel p-0 flex flex-col bg-[#070A09] relative overflow-hidden flex-1 border-[#1F2925] shadow-2xl h-[500px]">
              <div className="p-4 border-b border-[#1F2925] flex justify-between items-center bg-surface/50 absolute top-0 w-full z-10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold tracking-tight">Global Enforcement Pipeline DAG</h3>
                </div>
                <div className="flex gap-3 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  <span className="bg-background px-2 py-1 rounded border border-border">Status: {simState.toUpperCase()}</span>
                </div>
              </div>

              {/* React Flow Canvas */}
              <div className="flex-1 w-full h-full pt-16">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-[#0B0F0E]"
                  minZoom={0.5}
                  maxZoom={1.5}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background color="#1F2925" gap={20} size={1} />
                  <Controls className="bg-surface border-border !fill-foreground" />
                </ReactFlow>
              </div>
            </div>

            {/* Telemetry Charts Row */}
            <div className="grid grid-cols-2 gap-6 h-[250px]">
              
              {/* EKG Throughput */}
              <div className="panel flex flex-col overflow-hidden bg-[#070A09] border-[#1F2925] shadow-2xl">
                <div className="p-3 border-b border-[#1F2925] flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase text-muted-foreground">Live Throughput (Tokens/s)</h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-primary animate-pulse">
                    <Activity className="h-3 w-3" /> LIVE
                  </div>
                </div>
                <div className="flex-1 p-4 pb-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#76B900" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#76B900" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0B0F0E', borderColor: '#1F2925', fontSize: '12px', fontFamily: 'monospace' }}
                        itemStyle={{ color: '#76B900' }}
                      />
                      <Area type="monotone" dataKey="throughput" stroke="#76B900" fillOpacity={1} fill="url(#colorThroughput)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Threat Heatmap */}
              <div className="panel flex flex-col overflow-hidden bg-[#070A09] border-[#1F2925] shadow-2xl">
                <div className="p-3 border-b border-[#1F2925] flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase text-muted-foreground">Threat Vector Distribution</h3>
                </div>
                <div className="flex-1 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Jailbreak', count: 42, fill: '#76B900' },
                      { name: 'PII Leak', count: 27, fill: '#5A8D00' },
                      { name: 'Topic', count: 18, fill: '#3E6100' },
                      { name: 'Hallucination', count: 12, fill: '#223500' }
                    ]} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#878787', fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip 
                        cursor={{ fill: '#1F2925' }}
                        contentStyle={{ backgroundColor: '#0B0F0E', borderColor: '#1F2925', fontSize: '12px', fontFamily: 'monospace', borderRadius: '4px' }}
                        itemStyle={{ color: '#76B900' }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Controls & Log */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            
            {/* Interactive Policies */}
            <div className="panel flex flex-col overflow-hidden bg-[#070A09] border-[#1F2925] shadow-2xl">
              <div className="p-4 border-b border-[#1F2925] flex items-center justify-between bg-surface/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold text-sm">Policy Control Matrix</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { key: 'jailbreak', name: "Jailbreak Detection", latency: "12ms", active: rules.jailbreak, color: 'critical' },
                  { key: 'pii', name: "PII Masking", latency: "4ms", active: rules.pii, color: 'primary' },
                  { key: 'topic', name: "Topic Restriction", latency: "15ms", active: rules.topic, color: 'primary' },
                  { key: 'sanitizer', name: "Output Sanitizer", latency: "22ms", active: rules.sanitizer, color: 'info' },
                ].map(rail => (
                  <div key={rail.key} className={cn(
                    "flex items-center justify-between p-3 border rounded-md transition-all cursor-pointer select-none",
                    rail.active ? "border-[#1F2925] bg-[#0B0F0E] hover:border-primary/50" : "border-transparent bg-[#040605] opacity-60"
                  )}
                  onClick={() => toggleRule(rail.key as keyof typeof rules)}
                  >
                    <div className="flex items-center gap-3">
                      {rail.active ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      <span className={cn("font-mono text-xs", rail.active ? "text-foreground" : "text-muted-foreground")}>
                        {rail.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">+{rail.latency}</span>
                      <div className={cn("w-1.5 h-1.5 rounded-full", rail.active ? `bg-${rail.color} shadow-[0_0_5px_currentColor]` : "bg-muted-foreground")} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Log */}
            <div className="panel flex flex-col overflow-hidden bg-[#040605] flex-1 border-[#1F2925] shadow-2xl font-mono text-xs min-h-[300px]">
              <div className="p-3 border-b border-[#1F2925] flex items-center justify-between bg-[#0A0D0B]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold text-xs text-muted-foreground">security_events.log</h2>
                </div>
                <div className="text-[9px] text-muted-foreground">{events.length} EVENTS</div>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-2 custom-scrollbar">
                {events.map(event => (
                  <div key={event.id} className="flex flex-col gap-1 hover:bg-[#0A0D0B] p-2 -mx-2 rounded animate-in fade-in slide-in-from-top-2 border-l-2 border-transparent hover:border-primary transition-colors">
                    <div className="flex gap-2 items-center">
                      <span className="text-[#3B82F6]">{event.time}</span>
                      <span className={cn(
                        "font-bold",
                        event.severity === "FATAL" || event.severity === "CRIT" ? "text-critical" :
                        event.severity === "WARN" ? "text-warning" : "text-muted-foreground"
                      )}>
                        [{event.severity}]
                      </span>
                      <span className="text-foreground">{event.id}</span>
                      <span className="ml-auto border border-[#1F2925] bg-[#0B0F0E] px-1 rounded text-[9px]">
                        {event.action}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-muted-foreground pl-16">
                      <span>{event.agent}</span>
                      <span>→</span>
                      <span className="text-foreground truncate opacity-80">{event.rail}</span>
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
