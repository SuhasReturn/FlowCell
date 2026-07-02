import type { GraphData, FlowNode, FlowEdge, FunctionNodeData, VariableNodeData } from '../types';

// ── Layout constants ───────────────────────────────────────

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;
const COL_GAP = 320;
const ROW_GAP = 120;
const PADDING_X = 60;
const PADDING_Y = 60;

// ── Types for internal tracking ────────────────────────────

interface FunctionInfo {
  name: string;
  params: string[];
  bodyLines: string[];
}

interface VariableInfo {
  name: string;
  initType: string;
}

// ── Main export ────────────────────────────────────────────

export function parsePythonAndBuildGraph(code: string): GraphData {
  const functions: FunctionInfo[] = [];
  const variables: VariableInfo[] = [];
  const declaredNames = new Set<string>();
  const callEdges: { from: string; to: string }[] = [];
  const readEdges: { from: string; to: string }[] = [];
  const writeEdges: { from: string; to: string }[] = [];

  const lines = code.split('\n');

  // Python keywords to ignore
  const pyKeywords = new Set([
    'if', 'else', 'elif', 'for', 'while', 'def', 'class', 'return', 'import',
    'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield',
    'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'is', 'in',
    'True', 'False', 'None', 'del', 'global', 'nonlocal', 'assert',
    'print', 'len', 'range', 'int', 'str', 'float', 'list', 'dict', 'set',
    'tuple', 'bool', 'type', 'input', 'open', 'map', 'filter', 'zip',
    'enumerate', 'sorted', 'reversed', 'min', 'max', 'sum', 'abs', 'round',
    'isinstance', 'hasattr', 'getattr', 'setattr', 'super', 'self',
    'append', 'extend', 'insert', 'remove', 'pop', 'keys', 'values', 'items',
  ]);

  // ── Pass 1: Collect declarations ─────────────────────────

  // Match function definitions: def name(params):
  const defRegex = /^(\s*)def\s+(\w+)\s*\(([^)]*)\)\s*(?:->.*)?:/;
  // Match top-level variable assignments: name = value
  const varRegex = /^(\w+)\s*=\s*(.+)/;

  let currentFunc: string | null = null;
  let currentFuncIndent = 0;
  let funcBodyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') continue;

    // Function definition
    const defMatch = line.match(defRegex);
    if (defMatch) {
      // If we were inside a function, finalize it
      if (currentFunc) {
        const fn = functions.find(f => f.name === currentFunc);
        if (fn) fn.bodyLines = [...funcBodyLines];
      }

      const indent = defMatch[1].length;
      const name = defMatch[2];
      const params = defMatch[3]
        .split(',')
        .map(p => p.trim().split(':')[0].split('=')[0].trim())
        .filter(p => p.length > 0 && p !== 'self');

      // Only track top-level functions (indent 0) or class methods (indent 4)
      if (indent <= 4) {
        functions.push({ name, params, bodyLines: [] });
        declaredNames.add(name);
        currentFunc = name;
        currentFuncIndent = indent;
        funcBodyLines = [];
      }
      continue;
    }

    // If we're inside a function, collect body lines
    if (currentFunc) {
      const lineIndent = line.search(/\S/);
      if (lineIndent > currentFuncIndent && trimmed !== '') {
        funcBodyLines.push(trimmed);
        continue;
      } else if (trimmed !== '') {
        // Function ended
        const fn = functions.find(f => f.name === currentFunc);
        if (fn) fn.bodyLines = [...funcBodyLines];
        currentFunc = null;
        funcBodyLines = [];
      }
    }

    // Top-level variable assignment (not inside a function)
    if (!currentFunc) {
      const varMatch = trimmed.match(varRegex);
      if (varMatch && !pyKeywords.has(varMatch[1]) && !varMatch[1].startsWith('_')) {
        const name = varMatch[1];
        const initExpr = varMatch[2].trim();
        if (!declaredNames.has(name)) {
          variables.push({
            name,
            initType: describePythonInit(initExpr),
          });
          declaredNames.add(name);
        }
      }
    }
  }

  // Finalize last function
  if (currentFunc) {
    const fn = functions.find(f => f.name === currentFunc);
    if (fn) fn.bodyLines = [...funcBodyLines];
  }

  // ── Pass 2: Collect edges from function bodies ────────────

  for (const fn of functions) {

    for (const bodyLine of fn.bodyLines) {
      let match: RegExpExecArray | null;
      const lineCallRegex = /(\w+)\s*\(/g;
      while ((match = lineCallRegex.exec(bodyLine)) !== null) {
        const calledName = match[1];
        if (calledName !== fn.name && declaredNames.has(calledName) && !pyKeywords.has(calledName)) {
          callEdges.push({ from: fn.name, to: calledName });
        }
      }

      // Find variable reads/writes
      for (const v of variables) {
        if (bodyLine.includes(v.name)) {
          const assignPattern = new RegExp(`^${v.name}\\s*=`);
          const augAssignPattern = new RegExp(`^${v.name}\\s*[+\\-*/]?=`);
          if (assignPattern.test(bodyLine) || augAssignPattern.test(bodyLine)) {
            writeEdges.push({ from: fn.name, to: v.name });
          } else {
            readEdges.push({ from: fn.name, to: v.name });
          }
        }
      }
    }
  }

  // ── Build graph nodes ──────────────────────────────────────

  const nodes: FlowNode[] = [];

  functions.forEach((fn, i) => {
    nodes.push({
      id: `func-${fn.name}`,
      type: 'function',
      position: { x: PADDING_X, y: PADDING_Y + i * (NODE_HEIGHT + ROW_GAP) },
      data: {
        label: fn.name,
        params: fn.params,
        kind: 'function',
      } satisfies FunctionNodeData,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  variables.forEach((v, i) => {
    nodes.push({
      id: `var-${v.name}`,
      type: 'variable',
      position: {
        x: PADDING_X + COL_GAP + NODE_WIDTH,
        y: PADDING_Y + i * (NODE_HEIGHT + ROW_GAP),
      },
      data: {
        label: v.name,
        varKind: 'let' as const,
        initType: v.initType,
        kind: 'variable',
      } satisfies VariableNodeData,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  // ── Build edges ────────────────────────────────────────────

  const edges: FlowEdge[] = [];
  const edgeSet = new Set<string>();

  for (const call of callEdges) {
    const sourceId = `func-${call.from}`;
    const targetId = functions.some(f => f.name === call.to) ? `func-${call.to}` : `var-${call.to}`;
    const edgeKey = `${sourceId}->calls->${targetId}`;
    if (!edgeSet.has(edgeKey)) {
      edgeSet.add(edgeKey);
      edges.push({
        id: edgeKey,
        source: sourceId,
        target: targetId,
        label: 'calls',
        animated: true,
        data: { relationship: 'calls' },
      });
    }
  }

  for (const write of writeEdges) {
    const sourceId = `func-${write.from}`;
    const targetId = `var-${write.to}`;
    const edgeKey = `${sourceId}->writes->${targetId}`;
    if (!edgeSet.has(edgeKey)) {
      edgeSet.add(edgeKey);
      edges.push({
        id: edgeKey,
        source: sourceId,
        target: targetId,
        label: 'writes',
        data: { relationship: 'writes' },
      });
    }
  }

  for (const read of readEdges) {
    const sourceId = `func-${read.from}`;
    const targetId = `var-${read.to}`;
    const edgeKey = `${sourceId}->reads->${targetId}`;
    const writesKey = `${sourceId}->writes->${targetId}`;
    if (!edgeSet.has(edgeKey) && !edgeSet.has(writesKey)) {
      edgeSet.add(edgeKey);
      edges.push({
        id: edgeKey,
        source: sourceId,
        target: targetId,
        label: 'reads',
        style: { strokeDasharray: '6 3' },
        data: { relationship: 'reads' },
      });
    }
  }

  return { nodes, edges };
}

// ── Helpers ────────────────────────────────────────────────

function describePythonInit(expr: string): string {
  const trimmed = expr.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) return 'str';
  if (trimmed.startsWith('[')) return 'list';
  if (trimmed.startsWith('{')) return trimmed.includes(':') ? 'dict' : 'set';
  if (trimmed.startsWith('(')) return 'tuple';
  if (/^\d+$/.test(trimmed)) return 'int';
  if (/^\d+\.\d+/.test(trimmed)) return 'float';
  if (trimmed === 'True' || trimmed === 'False') return 'bool';
  if (trimmed === 'None') return 'None';
  if (trimmed.includes('(')) {
    const match = trimmed.match(/(\w+)\s*\(/);
    return match ? `${match[1]}()` : 'call';
  }
  return 'value';
}
