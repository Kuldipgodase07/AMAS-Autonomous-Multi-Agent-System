import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  Connection,
  Edge,
  Node,
  BaseEdge,
  getBezierPath,
  EdgeProps
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Bot, Play, Settings2, ShieldAlert, Sparkles, Database, Mail, Zap, CheckCircle2, GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workflows")({
  head: () => ({ meta: [{ title: "Workflow Builder · AMAS" }] }),
  component: WorkflowBuilder,
});

// ————————————————————————————————————————————————
// Custom Edges
// ————————————————————————————————————————————————

function AnimatedFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.active;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{
        ...style,
        strokeWidth: isActive ? 2 : 1,
        stroke: isActive ? '#76B900' : '#232B28',
        strokeDasharray: isActive ? 'none' : '4 4'
      }} />
      {isActive && (
        <BaseEdge 
          path={edgePath} 
          style={{
            ...style,
            strokeWidth: 4,
            stroke: '#76B900',
            opacity: 0.3,
            filter: 'drop-shadow(0 0 6px #76B900)'
          }} 
          className="animate-edge-flow"
        />
      )}
    </>
  );
}

// ————————————————————————————————————————————————
// Custom Nodes
// ————————————————————————————————————————————————

function AgentNode({ data, selected }: { data: { label: string; agent: string; status: string; tokens: string }; selected: boolean }) {
  const isRunning = data.status === "running";
  return (
    <div className={cn(
      "w-[240px] rounded-xl border bg-[#0B0F0E]/90 backdrop-blur-md shadow-2xl transition-all duration-300 relative group overflow-hidden",
      selected ? "border-primary shadow-[0_0_20px_rgba(118,185,0,0.15)]" : "border-[#232B28]"
    )}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-background !border-2 !border-primary" />
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#232B28] flex items-start justify-between bg-surface/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isRunning && <span className="absolute inset-0 rounded-full bg-info/40 animate-pulse-ring" />}
            <div className={cn(
              "w-8 h-8 rounded-full border border-[#232B28] flex items-center justify-center bg-background relative z-10",
              isRunning ? "text-info border-info/50" : "text-primary border-primary/30"
            )}>
              {data.label.includes('Planner') ? <Sparkles className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">{data.label}</h3>
            <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">{data.agent}</div>
          </div>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Status</span>
          <div className="flex items-center gap-1.5 font-mono uppercase tracking-widest text-[9px]">
            <span className={cn("w-1.5 h-1.5 rounded-full", isRunning ? "bg-info animate-pulse" : "bg-success")} />
            <span className={isRunning ? "text-info" : "text-success"}>{data.status}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Compute</span>
          <span className="font-mono font-medium">{data.tokens} t/s</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-background !border-2 !border-primary" />
    </div>
  );
}

function ApprovalNode({ data, selected }: { data: { label: string; risk: string }; selected: boolean }) {
  return (
    <div className={cn(
      "w-[200px] rounded-xl border bg-warning/5 backdrop-blur-md shadow-2xl transition-all duration-300 relative",
      selected ? "border-warning shadow-[0_0_20px_rgba(255,160,0,0.15)]" : "border-warning/30"
    )}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-background !border-2 !border-warning" />
      
      <div className="px-4 py-4 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-warning/20 border border-warning/50 flex items-center justify-center mb-3">
          <ShieldAlert className="h-5 w-5 text-warning" />
        </div>
        <h3 className="text-sm font-semibold text-warning mb-1">{data.label}</h3>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warning/70 border border-warning/20 px-2 py-0.5 rounded-full">
          {data.risk} Risk
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-background !border-2 !border-warning" />
    </div>
  );
}

function ToolNode({ data, selected }: { data: { label: string; type: string }; selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2.5 rounded-full border bg-surface/80 backdrop-blur-md shadow-xl transition-all duration-300 flex items-center gap-3",
      selected ? "border-muted-foreground shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "border-[#232B28]"
    )}>
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-background !border-2 !border-muted-foreground" />
      
      {data.type === 'database' && <Database className="h-3.5 w-3.5 text-info" />}
      {data.type === 'mail' && <Mail className="h-3.5 w-3.5 text-success" />}
      {data.type === 'action' && <Zap className="h-3.5 w-3.5 text-warning" />}
      
      <span className="text-xs font-semibold tracking-tight">{data.label}</span>
      
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-background !border-2 !border-muted-foreground" />
    </div>
  );
}

const nodeTypes = {
  agentNode: AgentNode,
  approvalNode: ApprovalNode,
  toolNode: ToolNode,
};
const edgeTypes = {
  animatedFlow: AnimatedFlowEdge,
};

// ————————————————————————————————————————————————
// Mock Data Initial State
// ————————————————————————————————————————————————

const initialNodes: Node[] = [
  { id: "1", type: "agentNode", position: { x: 350, y: 50 }, data: { label: "Reconciliation Planner", agent: "planner-agent-v2", status: "success", tokens: "4.2k" } },
  { id: "2", type: "toolNode", position: { x: 50, y: 250 }, data: { label: "Oracle ERP Sync", type: "database" } },
  { id: "3", type: "agentNode", position: { x: 350, y: 250 }, data: { label: "NIM OCR Extractor", agent: "retriever-agent-v1", status: "running", tokens: "18.5k" } },
  { id: "5", type: "toolNode", position: { x: 700, y: 250 }, data: { label: "Salesforce Match", type: "database" } },
  { id: "4", type: "approvalNode", position: { x: 370, y: 480 }, data: { label: "Execution Gate", risk: "High" } },
  { id: "6", type: "toolNode", position: { x: 375, y: 650 }, data: { label: "Process Payments", type: "action" } },
];

const initialEdges: Edge[] = [
  { id: "e1-3", source: "1", target: "3", type: "animatedFlow", data: { active: true } },
  { id: "e1-2", source: "1", target: "2", type: "animatedFlow", targetHandle: "left" },
  { id: "e1-5", source: "1", target: "5", type: "animatedFlow", targetHandle: "left" },
  { id: "e2-3", source: "2", target: "3", sourceHandle: "right", targetHandle: "left", type: "animatedFlow", data: { active: true } },
  { id: "e5-3", source: "5", target: "3", sourceHandle: "left", targetHandle: "right", type: "animatedFlow" },
  { id: "e3-4", source: "3", target: "4", type: "animatedFlow" },
  { id: "e4-6", source: "4", target: "6", type: "animatedFlow" },
];

// ————————————————————————————————————————————————
// Main Component
// ————————————————————————————————————————————————

function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, type: 'animatedFlow' }, eds)),
    [setEdges],
  );

  return (
    <div className="grid-bg h-full flex flex-col">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-4 p-4 lg:p-6 w-full">
        
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
              workflow builder · live
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Invoice Reconciliation (T-2841)</h1>
            <p className="text-sm text-muted-foreground">
              Interactive node topology. Drag to reposition, or click nodes to configure logic.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-mono text-muted-foreground">Topology Valid</span>
            </div>
            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow transition-colors shadow-[0_0_15px_rgba(118,185,0,0.3)]">
              <Play className="h-4 w-4" /> Deploy Workflow
            </button>
          </div>
        </header>

        <section className="flex flex-1 min-h-0 border border-border rounded-xl overflow-hidden bg-[#0B0F0E] shadow-2xl relative">
          
          {/* Main Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeClick={(_, node) => setSelectedNode(node)}
              onPaneClick={() => setSelectedNode(null)}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
              className="dark"
            >
              <Background color="#232B28" gap={24} size={2} />
              <Controls className="!bg-surface !border-[#232B28] !fill-foreground shadow-xl rounded-md overflow-hidden" />
              <MiniMap className="!bg-[#0B0F0E] !border-[#232B28] rounded-md shadow-xl !m-4" maskColor="rgba(11, 15, 14, 0.8)" />
            </ReactFlow>

            {/* Floating Palette */}
            <div className="absolute top-6 left-6 z-10 bg-surface/80 backdrop-blur-md border border-[#232B28] p-2 rounded-xl shadow-2xl flex flex-col gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-primary tooltip" title="Add Agent">
                <Bot className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-info" title="Add Tool">
                <Database className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-warning" title="Add HITL Gate">
                <ShieldAlert className="h-5 w-5" />
              </button>
              <div className="h-px w-full bg-[#232B28] my-1" />
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Properties Panel Overlay */}
          <aside className={cn(
            "w-[340px] border-l border-[#232B28] bg-[#0B0F0E]/95 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] absolute right-0 h-full z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]",
            selectedNode ? "translate-x-0" : "translate-x-full"
          )}>
            {selectedNode && (
              <>
                <div className="p-5 border-b border-[#232B28]">
                  <div className="flex items-center gap-3 mb-1">
                    <Settings2 className="h-4 w-4 text-primary" />
                    <h2 className="font-semibold text-sm">Node Configuration</h2>
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">ID: {selectedNode.id}</p>
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Display Label</label>
                    <input 
                      type="text" 
                      defaultValue={selectedNode.data.label as string}
                      className="w-full rounded-md border border-[#232B28] bg-background px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  
                  {selectedNode.type === "agentNode" && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Agent Persona</label>
                        <select className="w-full rounded-md border border-[#232B28] bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors">
                          <option>planner-agent-v2</option>
                          <option>retriever-agent-v1</option>
                          <option>executor-agent-v3</option>
                          <option>validator-agent-v1</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Allowed Autonomy</label>
                        <div className="space-y-2">
                          {['Suggest Only', 'Ask Before Acting', 'Act & Notify', 'Full Autonomy'].map((level) => (
                            <label key={level} className="flex items-center gap-3 p-3 rounded-md border border-[#232B28] bg-background cursor-pointer hover:border-primary/50 transition-colors">
                              <input type="radio" name="autonomy" className="accent-primary" defaultChecked={level === 'Act & Notify'} />
                              <span className="text-sm">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.type === "approvalNode" && (
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Risk Tier</label>
                      <select className="w-full rounded-md border border-warning/50 bg-warning/5 px-3 py-2 text-sm text-warning focus:border-warning focus:outline-none transition-colors">
                        <option>Low Risk</option>
                        <option>Medium Risk</option>
                        <option>High Risk</option>
                      </select>
                      <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-md">
                        <p className="text-xs text-warning/80">High Risk workflows require direct approval from an Ops Supervisor via the Governance queue before proceeding.</p>
                      </div>
                    </div>
                  )}

                  {selectedNode.type === "toolNode" && (
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Bound Tool / API</label>
                      <select className="w-full rounded-md border border-[#232B28] bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors">
                        <option>Oracle ERP Sync</option>
                        <option>Salesforce Match</option>
                        <option>Process Payments (Stripe)</option>
                        <option>Send Email (SendGrid)</option>
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>

        </section>
      </div>
    </div>
  );
}
