import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type DefaultEdgeOptions,
  type OnConnect,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '../../store/useFlowStore';
import { FunctionNode } from './nodes/FunctionNode';
import { VariableNode } from './nodes/VariableNode';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: Record<string, any> = {
  function: FunctionNode,
  variable: VariableNode,
};

// Edge colors by relationship type
const EDGE_COLORS: Record<string, string> = {
  calls: '#5B8DEF',   // blue for function calls
  reads: '#9DA5B8',   // muted for reads
  writes: '#F2A33C',  // amber for writes
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  style: { strokeWidth: 1.8 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16,
    color: '#5B8DEF',
  },
};

export function GraphPanel() {
  const storeNodes = useFlowStore((s) => s.nodes);
  const storeEdges = useFlowStore((s) => s.edges);
  const setGraph = useFlowStore((s) => s.setGraph);

  // Add arrow markers + colors based on relationship type
  const styledEdges = useMemo(() => {
    return storeEdges.map((edge) => {
      const relationship = edge.data?.relationship || 'calls';
      const color = EDGE_COLORS[relationship] || '#5B8DEF';

      return {
        ...edge,
        style: {
          ...edge.style,
          strokeWidth: 1.8,
          stroke: color,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color,
        },
        labelStyle: {
          fill: color,
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: '#13151A',
          fillOpacity: 0.85,
        },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 3,
      };
    });
  }, [storeEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(styledEdges);

  // Sync store → local state
  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setEdges(styledEdges);
  }, [styledEdges, setEdges]);

  // When user drags nodes, persist back to store
  const onNodeDragStop = useCallback(() => {
    // Update store with current positions so they survive re-parses
    setGraph(nodes, edges);
  }, [nodes, edges, setGraph]);

  const onConnect: OnConnect = useCallback(() => {
    // No user-created connections
  }, []);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className="graph-panel">
      <div className="panel-header">
        <span className="panel-label">graph</span>
        <span className="node-count">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="graph-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          proOptions={proOptions}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          className="flow-canvas"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#262932" />
          <Controls className="flow-controls" />
          <MiniMap
            className="flow-minimap"
            nodeColor={(node) => {
              if (node.type === 'function') return '#5B8DEF';
              if (node.type === 'variable') return '#F2A33C';
              return '#262932';
            }}
            maskColor="rgba(21, 23, 28, 0.8)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
