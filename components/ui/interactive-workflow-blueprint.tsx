"use client";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ReactFlow, Handle, Position, getBezierPath, applyNodeChanges, applyEdgeChanges, useNodesInitialized, useReactFlow, type Node, type Edge, type NodeProps, type EdgeProps, type Connection, type NodeChange, type EdgeChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export type WorkflowKind = "trigger" | "agent" | "integration" | "review" | "delivery";
export interface WorkflowAction extends Record<string, unknown> { label: string; detail: string; kind: WorkflowKind; tool?: string; logo?: string }
export interface WorkflowApp { id: string; name: string; logo?: string; actions: WorkflowAction[] }
export type WorkflowNode = Node<WorkflowAction, "blueprint">;
export interface WorkflowGraph { nodes: WorkflowNode[]; edges: Edge[] }
export interface WorkflowBlueprintProps { initialGraph: WorkflowGraph; apps: WorkflowApp[]; title?: string; className?: string; style?: CSSProperties; animated?: boolean; agentTemplate?: WorkflowAction; onChange?: (graph: WorkflowGraph) => void }

const labels: Record<WorkflowKind, string> = { trigger: "Trigger", agent: "AI agent", integration: "Integration", review: "Review", delivery: "Delivery" };
const glyphs: Record<WorkflowKind, string> = { trigger: "M13 3 5 13h5l-1 8 9-12h-5z", agent: "M12 3l2.2 5.5L20 10l-5.8 1.5L12 17l-2.2-5.5L4 10l5.8-1.5z", integration: "M10.5 13.5a3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1 1 M13.5 10.5a3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1-1", review: "M12 3 4 7v5c0 5 3.4 8.2 8 9 4.6-.8 8-4 8-9V7z M9 12l2 2 4-5", delivery: "M5 12h12M13 6l6 6-6 6" };

function BlueprintNode({ data, selected }: NodeProps<WorkflowNode>) {
  return <div className="wb-node" data-kind={data.kind} data-selected={selected}>
    <Handle type="target" position={Position.Left} aria-label={"Input for " + data.label} />
    <div className="wb-node-head"><span className="wb-glyph">{data.logo ? <img src={data.logo} alt="" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={glyphs[data.kind]} /></svg>}</span><div><strong>{data.label}</strong><small>{labels[data.kind]}</small></div></div>
    <div className="wb-node-body"><p>{data.detail}</p>{data.tool && <span>{data.tool}</span>}</div>
    <Handle type="source" position={Position.Right} aria-label={"Output for " + data.label} />
  </div>;
}
function BlueprintEdge(props: EdgeProps) {
  const id = "wb-" + useId().replace(/:/g, "");
  const [path] = getBezierPath(props);
  return <><defs><linearGradient id={id}><stop stopColor="var(--wb-primary)" /><stop offset="1" stopColor="var(--wb-secondary)" /></linearGradient></defs><path d={path} className="wb-edge-halo" /><path d={path} className="wb-edge" style={{ stroke: "url(#" + id + ")" }} /><path d={path} className="wb-edge-pulse" /><circle cx={props.sourceX} cy={props.sourceY} r="4" className="wb-port" /><circle cx={props.targetX} cy={props.targetY} r="4" className="wb-port" /></>;
}
const nodeTypes = { blueprint: BlueprintNode };
const edgeTypes = { blueprint: BlueprintEdge };
function InitialViewport({ width }: { width: number }) {
  const ready = useNodesInitialized(); const flow = useReactFlow(); const last = useRef(0);
  useEffect(() => {
    if (!ready || !width || last.current === width) return;
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => { frame2 = requestAnimationFrame(() => { last.current = width; if (width < 600) void flow.setViewport({ x: 24, y: 20, zoom: .9 }); else void flow.fitView({ padding: .1, maxZoom: 1 }); }); });
    return () => { cancelAnimationFrame(frame1); cancelAnimationFrame(frame2); };
  }, [ready, width, flow]);
  return null;
}
function canConnect(c: Pick<Connection, "source" | "target">, graph: WorkflowGraph) {
  const { source, target } = c;
  if (!source || !target || source === target || !graph.nodes.some(n => n.id === source) || !graph.nodes.some(n => n.id === target) || graph.edges.some(e => e.source === source && e.target === target)) return false;
  const visited = new Set<string>();
  const reaches = (id: string): boolean => { if (id === source) return true; if (visited.has(id)) return false; visited.add(id); return graph.edges.filter(e => e.source === id).some(e => reaches(e.target)); };
  return !reaches(target);
}
function normalize(graph: WorkflowGraph): WorkflowGraph {
  const ids = new Set(graph.nodes.map(n => n.id));
  return { nodes: graph.nodes.map(n => ({ ...n, type: "blueprint", ariaLabel: n.data.label + ". " + labels[n.data.kind] + ". " + n.data.detail })), edges: graph.edges.filter(e => ids.has(e.source) && ids.has(e.target)).map(e => ({ ...e, type: "blueprint" })) };
}

export default function WorkflowBlueprint({ initialGraph, apps, title = "Workflow editor", className = "", style, animated = true, agentTemplate, onChange }: WorkflowBlueprintProps) {
  const [graph, setGraph] = useState(() => normalize(initialGraph));
  const [selected, setSelected] = useState(initialGraph.nodes[0]?.id ?? "");
  const [source, setSource] = useState(""); const [target, setTarget] = useState("");
  const [message, setMessage] = useState("Choose an action or drag a node to start.");
  const [history, setHistory] = useState<WorkflowGraph[]>([]);
  const [flow, setFlow] = useState<ReturnType<typeof useReactFlow<WorkflowNode>> | null>(null);
  const [width, setWidth] = useState(0); const [paused, setPaused] = useState(false);
  const [editing, setEditing] = useState<{ id: string; label: string; detail: string; tool: string } | null>(null);
  const canvas = useRef<HTMLDivElement>(null); const flowRef = useRef<any>(null);
  const editInput = useRef<HTMLInputElement>(null); const editButton = useRef<HTMLButtonElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null); const initial = useRef(normalize(initialGraph));
  const seq = useRef(0); const uid = useId().replace(/:/g, ""); const changed = useRef(false);
  const callback = useRef(onChange); callback.current = onChange;
  useEffect(() => { if (changed.current) callback.current?.(graph); }, [graph]);
  useEffect(() => { if (editing) editInput.current?.focus(); }, [editing?.id]);
  useEffect(() => { if (!canvas.current) return; const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width)); observer.observe(canvas.current); return () => observer.disconnect(); }, []);
  const commit = (next: WorkflowGraph, text: string) => { setHistory(h => [...h.slice(-19), graph]); changed.current = true; setGraph(normalize(next)); setMessage(text); };
  const connect = (c: Pick<Connection, "source" | "target">) => {
    if (!canConnect(c, graph)) { setMessage("Choose two different nodes without an existing link or a cycle."); return; }
    commit({ ...graph, edges: [...graph.edges, { id: uid + "-edge-" + (++seq.current), ...c, type: "blueprint" }] }, "Connection added.");
  };
  const add = (action: WorkflowAction, editNow = false) => {
    if (graph.nodes.length >= 20) { setMessage("This canvas supports up to 20 nodes. Remove a node before adding another."); return; }
    const after = graph.nodes.find(n => n.id === selected); const id = uid + "-node-" + (++seq.current);
    const position = { x: after ? after.position.x + 260 : 30, y: after ? after.position.y : 80 };
    while (graph.nodes.some(n => Math.abs(n.position.x - position.x) < 212 && Math.abs(n.position.y - position.y) < 184)) position.y += 194;
    const outgoing = graph.edges.filter(e => e.source === after?.id); let edges = graph.edges;
    if (after) { if (outgoing.length === 1) edges = edges.map(e => e.id === outgoing[0].id ? { ...e, source: id } : e); edges = [...edges, { id: uid + "-edge-" + (++seq.current), source: after.id, target: id, type: "blueprint" }]; }
    const node: WorkflowNode = { id, type: "blueprint", position, data: { ...action }, selected: true };
    commit({ nodes: [...graph.nodes.map(n => ({ ...n, selected: false })), node], edges }, action.label + " added.");
    setSelected(id); setEditing(editNow ? { id, label: action.label, detail: action.detail, tool: action.tool ?? "" } : null);
    void flow?.setCenter(position.x + 98, position.y + 84, { zoom: width < 600 ? .9 : 1 });
  };
  const remove = () => {
    const node = graph.nodes.find(n => n.id === selected); if (!node) return;
    const incoming = graph.edges.filter(e => e.target === selected); const outgoing = graph.edges.filter(e => e.source === selected);
    const remaining = { nodes: graph.nodes.filter(n => n.id !== selected), edges: graph.edges.filter(e => e.source !== selected && e.target !== selected) };
    const bridge = incoming.length === 1 && outgoing.length === 1 ? { source: incoming[0].source, target: outgoing[0].target } : null;
    const reconnect = bridge && canConnect(bridge, remaining);
    if (reconnect) remaining.edges.push({ id: uid + "-edge-" + (++seq.current), ...bridge, type: "blueprint" });
    commit(remaining, node.data.label + " removed."); setSelected(""); setEditing(null); selectRef.current?.focus();
  };
  const onNodesChange = useCallback((changes: NodeChange<WorkflowNode>[]) => {
    changed.current = true;
    setGraph(g => {
      const viewport = flowRef.current?.getViewport(); const rect = canvas.current?.getBoundingClientRect();
      const bounded = changes.map(change => {
        if (change.type !== "position" || !change.position || !viewport || !rect) return change;
        const node = g.nodes.find(n => n.id === change.id); if (!node) return change;
        const minX = (4 - viewport.x) / viewport.zoom; const minY = (4 - viewport.y) / viewport.zoom;
        const maxX = (rect.width - 4 - viewport.x) / viewport.zoom - (node.measured?.width ?? 196);
        const maxY = (rect.height - 4 - viewport.y) / viewport.zoom - (node.measured?.height ?? 166);
        return { ...change, position: { x: Math.max(minX, Math.min(change.position.x, Math.max(minX, maxX))), y: Math.max(minY, Math.min(change.position.y, Math.max(minY, maxY))) } };
      });
      return { ...g, nodes: applyNodeChanges(bounded, g.nodes) };
    });
    const picked = changes.find(c => c.type === "select" && c.selected); if (picked && "id" in picked) setSelected(picked.id);
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => { changed.current = true; setGraph(g => ({ ...g, edges: applyEdgeChanges(changes, g.edges) })); }, []);
  const focusNode = (id: string) => { setSelected(id); setEditing(null); setGraph(g => ({ ...g, nodes: g.nodes.map(n => ({ ...n, selected: n.id === id })) })); const node = graph.nodes.find(n => n.id === id); if (node) void flow?.setCenter(node.position.x + 98, node.position.y + 84, { zoom: 1 }); };
  const editSelected = () => { const n = graph.nodes.find(n => n.id === selected); if (n) setEditing({ id: n.id, label: n.data.label, detail: n.data.detail, tool: n.data.tool ?? "" }); };
  const save = () => { if (!editing || !editing.label.trim()) return; const label = editing.label.trim(); commit({ ...graph, nodes: graph.nodes.map(n => n.id === editing.id ? { ...n, data: { ...n.data, label, detail: editing.detail.trim(), tool: editing.tool.trim() || undefined } } : n) }, label + " updated."); setEditing(null); editButton.current?.focus(); };
  const download = () => {
    const data = { nodes: graph.nodes.map(({ id, position, data }) => ({ id, type: "blueprint", position, data })), edges: graph.edges.map(({ id, source, target }) => ({ id, source, target, type: "blueprint" })) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "workflow.json"; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Workflow downloaded as JSON. No live integrations are connected.");
  };
  return <section className={"wb-root " + className} style={style} aria-label={title} data-animated={animated && !paused}>
    <style>{styles}</style>
    <header className="wb-header"><span className="wb-mark" aria-hidden="true">+</span><div className="wb-heading"><h2>{title}</h2><span>Build canvas</span></div>
      <div className="wb-header-actions">
        <button type="button" onClick={() => add({ ...agentTemplate, label: agentTemplate?.label ?? "New AI agent", detail: agentTemplate?.detail ?? "Describe what this agent does.", kind: "agent" }, true)} disabled={graph.nodes.length >= 20}>+ Add agent</button>
        <button type="button" onClick={() => { const previous = history.at(-1); if (previous) { changed.current = true; setGraph(previous); setHistory(h => h.slice(0, -1)); setSelected(""); setEditing(null); setMessage("Last edit undone."); } }} disabled={!history.length}>Undo edit</button>
        <button type="button" className="wb-primary" onClick={download}>Export JSON ↗</button>
      </div>
    </header>
    <div className="wb-workspace"><div className="wb-canvas-column">
      <div className="wb-canvas" ref={canvas}>
        <ReactFlow<WorkflowNode> nodes={graph.nodes} edges={graph.edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
          onInit={instance => { flowRef.current = instance; setFlow(instance); }} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={connect} isValidConnection={c => canConnect(c, graph)} onNodeClick={(_, n) => { setSelected(n.id); setEditing(null); }}
          nodesFocusable edgesFocusable minZoom={.3} maxZoom={1.5} zoomOnScroll={false} zoomOnDoubleClick={false}
          autoPanOnNodeDrag={false} preventScrolling={false} deleteKeyCode={null} snapToGrid snapGrid={[10,10]} aria-label={title + " diagram"}>
          <InitialViewport width={width} />
        </ReactFlow>
        {!graph.nodes.length && <p className="wb-empty">Add an action from the connection stack to begin.</p>}
        <div className="wb-tools" role="group" aria-label="Canvas controls">
          <button type="button" aria-label="Zoom out" onClick={() => void flow?.zoomOut()}>−</button>
          <button type="button" onClick={() => void flow?.fitView({ padding: .15, maxZoom: 1 })}>Fit all</button>
          <button type="button" aria-label="Zoom in" onClick={() => void flow?.zoomIn()}>+</button>
          {animated && <button type="button" onClick={() => setPaused(p => !p)} aria-pressed={paused}>{paused ? "Resume motion" : "Pause motion"}</button>}
        </div>
      </div>
      <div className="wb-status"><span><i /> {graph.nodes.length} nodes · {graph.edges.length} connections</span><span>Local canvas · no live services</span></div>
      <div className="wb-editor">
        <div className="wb-edit-row"><label htmlFor={uid + "-selected"}>Insert after / selected node</label>
          <select ref={selectRef} id={uid + "-selected"} value={graph.nodes.some(n => n.id === selected) ? selected : ""} onChange={e => focusNode(e.target.value)}>
            <option value="">Unconnected new node</option>{graph.nodes.map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}
          </select>
          <button ref={editButton} type="button" onClick={editSelected} disabled={!graph.nodes.some(n => n.id === selected)}>Edit step</button>
          <button type="button" onClick={remove} disabled={!graph.nodes.some(n => n.id === selected)}>Remove selected</button>
        </div>
        {editing && <form className="wb-step-form" onSubmit={e => { e.preventDefault(); save(); }}>
          <label>Step name<input ref={editInput} required maxLength={60} value={editing.label} onChange={e => setEditing({ ...editing, label: e.target.value })} /></label>
          <label>What it does<textarea rows={2} maxLength={160} value={editing.detail} onChange={e => setEditing({ ...editing, detail: e.target.value })} /></label>
          <label>Tool (optional)<input maxLength={40} value={editing.tool} onChange={e => setEditing({ ...editing, tool: e.target.value })} /></label>
          <div><button type="submit" className="wb-primary">Save step</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
        </form>}
        <form className="wb-connect" onSubmit={e => { e.preventDefault(); connect({ source, target }); }}>
          <label>From<select value={source} onChange={e => setSource(e.target.value)}><option value="">Choose source</option>{graph.nodes.map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}</select></label><span>→</span>
          <label>To<select value={target} onChange={e => setTarget(e.target.value)}><option value="">Choose destination</option>{graph.nodes.map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}</select></label>
          <button type="submit" disabled={!source || !target}>Connect nodes</button>
        </form>
        <details className="wb-details"><summary>Connections ({graph.edges.length}) and keyboard help</summary>
          <p>Tab to a node, press Enter to select it, then use the arrow keys to move it. Drag between ports or use the connection form. Removing a step reconnects its neighbors when there is one incoming and one outgoing connection; branches must be connected manually.</p>
          {graph.edges.length ? <ul>{graph.edges.map(e => <li key={e.id}><span>{graph.nodes.find(n => n.id === e.source)?.data.label} → {graph.nodes.find(n => n.id === e.target)?.data.label}</span><button type="button" onClick={() => commit({ ...graph, edges: graph.edges.filter(x => x.id !== e.id) }, "Connection removed.")}>Remove</button></li>)}</ul> : <p>No connections yet.</p>}
        </details>
        <p className="wb-message" role="status" aria-live="polite">{message}</p>
        <button type="button" className="wb-reset" onClick={() => { commit(normalize(initial.current), "Initial workflow restored. Undo edit can recover your changes."); setSelected(initial.current.nodes[0]?.id ?? ""); setEditing(null); }}>Restore initial workflow</button>
      </div>
    </div>
    <aside className="wb-stack" aria-label="Connection stack"><div className="wb-stack-heading"><h3>Connection stack</h3><span>▱</span></div><p>Pick an action to add it after the selected node.</p>
      {apps.map((app, index) => <details key={app.id} open={index === 0} className="wb-app">
        <summary><span className="wb-app-mark">{app.logo ? <img src={app.logo} alt="" /> : app.name.slice(0,1)}</span><strong>{app.name}</strong><small>{app.actions.length}</small></summary>
        <div className="wb-actions">{app.actions.map((action, i) => <button key={app.id + "-" + i} type="button" onClick={() => add({ ...action, logo: action.logo ?? app.logo })} disabled={graph.nodes.length >= 20}>
          <span>{action.label}<small>{labels[action.kind]}</small></span><b>+</b>
        </button>)}</div>
      </details>)}
    </aside></div>
  </section>;
}

const styles = `
.wb-root{--wb-bg:var(--color-background,Canvas);--wb-fg:var(--color-foreground,CanvasText);--wb-card:var(--color-card,Canvas);--wb-muted:var(--color-muted-foreground,GrayText);--wb-border:var(--color-border,GrayText);--wb-primary:var(--color-primary,Highlight);--wb-on-primary:var(--color-primary-foreground,HighlightText);--wb-secondary:var(--color-chart-2,var(--wb-primary));width:100%;min-width:0;border:1px solid var(--wb-border);border-radius:16px;overflow:hidden;background:var(--wb-bg);color:var(--wb-fg);font-family:inherit;font-size:14px;line-height:1.5;container-type:inline-size;box-sizing:border-box;isolation:isolate}.wb-root *{box-sizing:border-box}.wb-root button,.wb-root select{font:inherit;color:inherit;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-card);min-height:40px;padding:8px 12px}.wb-root button{cursor:pointer}.wb-root button:disabled{opacity:.45;cursor:not-allowed}.wb-root button:hover:enabled{background:color-mix(in srgb,var(--wb-primary) 12%,var(--wb-card))}.wb-root :is(button,select,summary):focus-visible{outline:3px solid var(--wb-primary);outline-offset:3px}.wb-root .wb-primary{background:var(--wb-primary);color:var(--wb-on-primary)}.wb-header{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--wb-border);background:var(--wb-card)}.wb-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:var(--wb-primary);color:var(--wb-on-primary);font:26px/1 system-ui}.wb-heading{flex:1;min-width:0}.wb-heading h2{font-size:16px;margin:0}.wb-heading>span,.wb-node-head small{font:10px ui-monospace,monospace;letter-spacing:.13em;text-transform:uppercase;color:var(--wb-muted)}.wb-header-actions{display:flex;gap:8px;flex-wrap:wrap;font-size:12px}.wb-workspace{display:grid;grid-template-columns:minmax(0,1fr) 254px}.wb-canvas-column{min-width:0}.wb-canvas{position:relative;height:460px;background-image:radial-gradient(color-mix(in srgb,var(--wb-muted) 36%,transparent) 1px,transparent 1px);background-size:18px 18px}.wb-root .react-flow{background:transparent;--xy-attribution-background-color:var(--wb-card)}.wb-root .react-flow__node{background:none;border:0;padding:0}.wb-node{width:196px;min-height:166px;border:1px solid var(--wb-border);border-radius:18px;background:var(--wb-card);box-shadow:0 14px 32px -20px var(--wb-fg);color:var(--wb-fg)}.wb-node[data-selected=true]{outline:2px solid var(--wb-primary);outline-offset:4px}.wb-node-head{padding:15px 13px 12px;display:flex;gap:10px;align-items:center}.wb-node-head strong{font-size:14px;display:block;overflow-wrap:anywhere}.wb-glyph{display:grid;place-items:center;flex:0 0 36px;height:36px;border:1px solid var(--wb-border);border-radius:10px;color:var(--wb-primary)}.wb-glyph svg,.wb-glyph img{width:22px;height:22px;object-fit:contain}.wb-node-body{padding:10px 13px;border-top:1px solid var(--wb-border)}.wb-node-body p{font-size:12px;color:var(--wb-muted);margin:0 0 8px}.wb-node-body>span{font:9px ui-monospace,monospace;border:1px solid var(--wb-border);padding:2px 6px}.wb-root .react-flow__handle{width:12px;height:12px;min-width:12px;min-height:12px;border:2px solid var(--wb-card);background:var(--wb-primary)}.wb-edge-halo{fill:none;stroke:color-mix(in srgb,var(--wb-primary) 13%,transparent);stroke-width:9}.wb-edge{fill:none;stroke-width:2.5}.wb-edge-pulse{fill:none;stroke:var(--wb-fg);stroke-opacity:.45;stroke-width:2;stroke-dasharray:3 45;animation:wb-travel 6s linear infinite}.wb-port{fill:var(--wb-primary)}@keyframes wb-travel{to{stroke-dashoffset:-192}}.wb-root[data-animated=false] .wb-edge-pulse{animation:none}.wb-empty{position:absolute;inset:40% 20px auto;text-align:center;color:var(--wb-muted);pointer-events:none}.wb-tools{position:absolute;left:16px;bottom:16px;display:flex;gap:3px;padding:4px;border:1px solid var(--wb-border);border-radius:10px;background:var(--wb-card)}.wb-tools button{border:0;min-width:36px;font-size:12px}.wb-status{display:flex;justify-content:space-between;gap:12px;border-top:1px solid var(--wb-border);padding:11px 18px;color:var(--wb-muted);font:10px ui-monospace,monospace}.wb-editor{padding:18px;border-top:1px solid var(--wb-border);background:var(--wb-card);font-size:12px}.wb-edit-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.wb-edit-row select{flex:1;min-width:120px}.wb-connect{display:flex;gap:10px;align-items:end;margin-top:14px}.wb-connect label{flex:1;min-width:0;display:grid;gap:5px;color:var(--wb-muted)}.wb-connect select{width:100%;min-width:0}.wb-connect button{white-space:nowrap}.wb-details{margin-top:16px}.wb-details summary{cursor:pointer;color:var(--wb-muted);padding:6px 0}.wb-details p{line-height:1.7;color:var(--wb-muted)}.wb-details ul{list-style:none;padding:0}.wb-details li{display:flex;justify-content:space-between;gap:12px;border-top:1px solid var(--wb-border);padding:7px 0}.wb-message{margin:14px 0;min-height:1.5em}.wb-root .wb-reset{border:0;background:none;text-decoration:underline;color:var(--wb-muted)}.wb-stack{border-left:1px solid var(--wb-border);background:var(--wb-card);padding:20px 15px;min-width:0}.wb-stack-heading{display:flex;justify-content:space-between}.wb-stack h3{font-size:14px;margin:0}.wb-stack>p{font-size:11px;color:var(--wb-muted)}.wb-app{border:1px solid var(--wb-border);border-radius:11px;margin-top:9px;overflow:hidden}.wb-app summary{list-style:none;display:flex;gap:9px;align-items:center;padding:12px;cursor:pointer}.wb-app summary:after{content:'+';margin-left:auto}.wb-app[open] summary:after{content:'−'}.wb-app summary strong{font-size:12px}.wb-app summary small{font:10px ui-monospace,monospace;color:var(--wb-muted)}.wb-app-mark{display:grid;place-items:center;width:27px;height:27px;border:1px solid var(--wb-border);border-radius:7px}.wb-app-mark img{width:18px;height:18px;object-fit:contain}.wb-actions{border-top:1px solid var(--wb-border);padding:6px}.wb-actions button{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font-size:11px;border:0;background:none}.wb-actions button>span{flex:1}.wb-actions small{display:block;font:8px ui-monospace,monospace;color:var(--wb-muted);margin-top:3px}.wb-step-form{display:grid;gap:12px;margin-top:14px;padding:14px;border:1px solid var(--wb-border);border-radius:10px}.wb-step-form label{display:grid;gap:5px;color:var(--wb-muted)}.wb-step-form input,.wb-step-form textarea{width:100%;min-height:40px;padding:9px;border:1px solid var(--wb-border);border-radius:8px;background:var(--wb-card);color:var(--wb-fg);font:inherit}.wb-step-form>div{display:flex;gap:8px}@container(max-width:1050px){.wb-workspace{grid-template-columns:1fr}.wb-stack{border-left:0;border-top:1px solid var(--wb-border);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.wb-stack-heading,.wb-stack>p{grid-column:1/-1}.wb-canvas{height:410px}}@container(max-width:480px){.wb-header{padding:14px;flex-wrap:wrap}.wb-header-actions{width:100%}.wb-canvas{height:360px}.wb-status{flex-wrap:wrap}.wb-editor{padding:14px}.wb-edit-row{display:grid}.wb-connect{flex-wrap:wrap}.wb-connect button{width:100%}.wb-stack{grid-template-columns:1fr}.wb-stack-heading,.wb-stack>p{grid-column:auto}}@media(prefers-reduced-motion:reduce){.wb-root .wb-edge-pulse{animation:none}}
`;
