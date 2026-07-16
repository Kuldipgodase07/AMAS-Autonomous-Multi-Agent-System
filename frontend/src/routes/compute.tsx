import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Cpu, Server, Activity, Database, Zap, Layers, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export const Route = createFileRoute("/compute")({
  head: () => ({ meta: [{ title: "Compute Telemetry · AMAS" }] }),
  component: ComputeDashboard,
});

const NIM_MODELS = [
  { name: "llama-3-70b-instruct", role: "Orchestrator", status: "ONLINE", tps: "390.4", ttft: "180ms", kv: "84%" },
  { name: "mistral-nemo-12b", role: "Tool Executor", status: "ONLINE", tps: "270.1", ttft: "85ms", kv: "41%" },
  { name: "nemo-embed-1.5", role: "Vector Encoder", status: "ONLINE", tps: "1240", ttft: "45ms", kv: "12%" },
  { name: "nemoguardrails", role: "Policy Engine", status: "ONLINE", tps: "N/A", ttft: "22ms", kv: "5%" },
];

// Custom Node for GPU
const GpuNode = ({ data, selected }: any) => {
  return (
    <div className={cn(
      "w-[220px] bg-[#0B0F0E] rounded-lg p-3 flex flex-col justify-between transition-all duration-300 border-2",
      selected ? "border-primary shadow-[0_0_30px_rgba(118,185,0,0.3)]" : "border-[#1F2925] shadow-xl hover:border-primary/50"
    )}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-primary border-none" />
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-foreground">
          <Server className="h-4 w-4" />
          <span className="font-mono text-xs font-bold tracking-widest">{data.label}</span>
        </div>
        <span className={cn("text-[9px] font-mono", data.util > 80 ? "text-success" : "text-info")}>{data.util}% UTIL</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>MEM</span>
          <span>{data.mem}GB / 80GB</span>
        </div>
        <div className="w-full h-1 bg-[#1F2925] rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${(data.mem / 80) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1">
          <span>TMP</span>
          <span>{data.tmp}°C</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-info border-none" />
    </div>
  );
};

// Custom Node for NVLink Switch
const SwitchNode = ({ selected }: any) => {
  return (
    <div className={cn(
      "w-[80px] h-[80px] rounded-full flex items-center justify-center transition-all duration-300 border-4",
      selected ? "border-primary shadow-[0_0_40px_rgba(118,185,0,0.4)]" : "border-[#1F2925] bg-[#070A09]"
    )}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="target" position={Position.Right} className="opacity-0" />
      <div className="w-[60px] h-[60px] rounded-full border border-primary/30 flex items-center justify-center relative bg-[#0B0F0E]">
        <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20"></div>
        <Zap className="h-5 w-5 text-primary" />
      </div>
    </div>
  );
};

const initialNodes: Node[] = [
  { id: 'gpu-0', type: 'gpuNode', position: { x: 50, y: 50 }, data: { label: 'GPU:0', util: 92, mem: 78, tmp: 72 } },
  { id: 'gpu-1', type: 'gpuNode', position: { x: 450, y: 50 }, data: { label: 'GPU:1', util: 41, mem: 41, tmp: 58 } },
  { id: 'switch', type: 'switchNode', position: { x: 310, y: 250 }, data: {} },
  { id: 'gpu-2', type: 'gpuNode', position: { x: 50, y: 400 }, data: { label: 'GPU:2', util: 88, mem: 75, tmp: 69 } },
  { id: 'gpu-3', type: 'gpuNode', position: { x: 450, y: 400 }, data: { label: 'GPU:3', util: 95, mem: 79, tmp: 74 } },
];

const initialEdges: Edge[] = [
  { id: 'e0-s', source: 'gpu-0', target: 'switch', animated: true, style: { stroke: '#76B900', strokeWidth: 3 }, type: 'smoothstep' },
  { id: 'e1-s', source: 'gpu-1', target: 'switch', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, type: 'smoothstep' },
  { id: 'e2-s', source: 'gpu-2', target: 'switch', animated: true, style: { stroke: '#76B900', strokeWidth: 3 }, type: 'smoothstep' },
  { id: 'e3-s', source: 'gpu-3', target: 'switch', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, type: 'smoothstep' },
  { id: 'e0-1', source: 'gpu-0', target: 'gpu-1', animated: true, style: { stroke: '#1F2925', strokeWidth: 2, strokeDasharray: '5 5' }, type: 'straight' },
  { id: 'e2-3', source: 'gpu-2', target: 'gpu-3', animated: true, style: { stroke: '#1F2925', strokeWidth: 2, strokeDasharray: '5 5' }, type: 'straight' },
];

function ComputeDashboard() {
  const [pulse, setPulse] = useState(0);
  
  const nodeTypes = useMemo(() => ({ gpuNode: GpuNode, switchNode: SwitchNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => p + 1), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid-bg min-h-full flex flex-col">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-6 p-4 lg:p-6 w-full">
        
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-2">
              <Cpu className="h-3 w-3" /> hgx-1 cluster · nvlink active
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">AI Infrastructure Telemetry</h1>
            <p className="text-sm text-muted-foreground">
              Production-ready, interactive monitoring of NVIDIA H100 tensors via React Flow.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 font-mono text-[10px] uppercase text-muted-foreground">
              <div className="flex flex-col">
                <span>Cluster</span>
                <span className="text-foreground">us-east-1-hgx</span>
              </div>
              <div className="flex flex-col">
                <span>Total FLOPs</span>
                <span className="text-primary">14.8 PFLOPS</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-md">
              <RefreshCw className={cn("h-3 w-3 text-primary", pulse % 2 === 0 ? "animate-spin" : "")} />
              <span className="text-xs font-mono text-muted-foreground">Syncing</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Main Visualization: NVLink Topology */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-[700px]">
            <div className="panel p-0 flex flex-col bg-[#070A09] relative overflow-hidden flex-1 border-[#1F2925] shadow-2xl">
              
              <div className="p-4 border-b border-[#1F2925] flex justify-between items-center bg-surface/50 absolute top-0 w-full z-10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold tracking-tight">NVLink Bandwidth Topology</h3>
                </div>
                <div className="flex gap-3 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                  Powered by @xyflow/react
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
                  maxZoom={2}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background color="#76B900" gap={20} size={1} className="opacity-10" />
                  <Controls className="bg-surface border-border !fill-foreground" />
                </ReactFlow>
              </div>
            </div>
          </div>

          {/* Right Column: NIM Microservices */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-[700px]">
            <div className="panel flex flex-col overflow-hidden bg-[#070A09] flex-1 border-[#1F2925] shadow-2xl">
              <div className="p-4 border-b border-[#1F2925] flex items-center gap-2 bg-surface/50 backdrop-blur-md">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">NIM Fleet Matrix</h2>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
                {NIM_MODELS.map((model, i) => (
                  <div key={model.name} className="p-4 border border-[#1F2925] bg-[#0B0F0E] rounded-md relative overflow-hidden group hover:border-primary/50 transition-colors">
                    {/* Background glow logic */}
                    <div className={cn("absolute top-0 right-0 w-16 h-16 rounded-bl-full -z-10 opacity-20", i === 0 ? "bg-primary" : "bg-[#1F2925]")} />
                    
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-mono text-xs font-bold text-foreground">{model.name}</h3>
                        <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{model.role}</p>
                      </div>
                      <div className="px-2 py-0.5 rounded-sm border border-success/30 bg-success/10 text-[9px] font-mono text-success">
                        {model.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#1F2925]">
                      <div>
                        <div className="text-[9px] font-mono text-muted-foreground mb-1">TPS</div>
                        <div className="font-mono text-sm text-foreground">{model.tps}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-muted-foreground mb-1">TTFT</div>
                        <div className="font-mono text-sm text-info">{model.ttft}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-muted-foreground mb-1">KV Cache</div>
                        <div className="font-mono text-sm text-warning">{model.kv}</div>
                      </div>
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
