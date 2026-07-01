import type { Node, Edge } from '@xyflow/react';

// ── Node Data ──────────────────────────────────────────────

export interface FunctionNodeData extends Record<string, unknown> {
  label: string;
  params: string[];
  kind: 'function';
}

export interface VariableNodeData extends Record<string, unknown> {
  label: string;
  varKind: 'const' | 'let' | 'var';
  initType: string;
  kind: 'variable';
}

export type FlowNodeData = FunctionNodeData | VariableNodeData;

// ── Typed React Flow Primitives ────────────────────────────

export type FlowNode = Node<FunctionNodeData, 'function'> | Node<VariableNodeData, 'variable'>;
export type FlowEdge = Edge & { data?: { relationship: 'calls' | 'reads' | 'writes' } };

// ── Graph Result ───────────────────────────────────────────

export interface GraphData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

// ── Language ───────────────────────────────────────────────

export type Language = 'javascript' | 'java';

// ── Example Snippet ────────────────────────────────────────

export interface ExampleSnippet {
  key: string;
  label: string;
  code: string;
  language: Language;
}
