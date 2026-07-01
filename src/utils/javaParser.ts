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
}

interface VariableInfo {
  name: string;
  kind: 'const' | 'let' | 'var' | 'field';
  initType: string;
}

// ── Main export ────────────────────────────────────────────

export function parseJavaAndBuildGraph(code: string): GraphData {
  const functions: FunctionInfo[] = [];
  const variables: VariableInfo[] = [];
  const declaredNames = new Set<string>();
  const callEdges: { from: string; to: string; label: string }[] = [];
  const readEdges: { from: string; to: string }[] = [];
  const writeEdges: { from: string; to: string }[] = [];

  const lines = code.split('\n');

  // ── Pass 1: collect declarations ─────────────────────────

  // Match class declarations
  const classRegex = /^\s*(?:public\s+|private\s+|protected\s+)?(?:static\s+)?class\s+(\w+)/;

  // Match method declarations (inside or outside classes)
  const methodRegex = /^\s*(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:\w+(?:<[^>]*>)?(?:\[\])*)\s+(\w+)\s*\(([^)]*)\)\s*\{?/;

  // Match constructors
  const constructorRegex = /^\s*(?:public\s+|private\s+|protected\s+)?(\w+)\s*\(([^)]*)\)\s*\{/;

  // Match variable/field declarations
  const varRegex = /^\s*(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:final\s+)?(\w+(?:<[^>]*>)?(?:\[\])*)\s+(\w+)\s*(?:=\s*(.+?))?;/;


  // Known Java types and keywords to exclude from variable detection
  const javaKeywords = new Set([
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
    'return', 'try', 'catch', 'finally', 'throw', 'throws', 'new', 'class',
    'interface', 'extends', 'implements', 'import', 'package', 'public',
    'private', 'protected', 'static', 'final', 'abstract', 'void', 'super',
    'this', 'instanceof', 'enum', 'assert', 'synchronized', 'volatile',
    'transient', 'native', 'strictfp', 'default', 'boolean', 'byte', 'char',
    'short', 'long', 'float', 'double', 'null', 'true', 'false',
    'System', 'String', 'Integer', 'Double', 'Float', 'Boolean', 'Long',
    'Object', 'List', 'Map', 'Set', 'Arrays', 'Collections', 'Math',
    'println', 'print', 'printf', 'format',
  ]);

  const javaTypes = new Set([
    'int', 'long', 'float', 'double', 'boolean', 'char', 'byte', 'short',
    'void', 'String', 'Integer', 'Double', 'Float', 'Boolean', 'Long',
    'Object', 'List', 'Map', 'Set', 'ArrayList', 'HashMap', 'HashSet',
  ]);

  let currentClass: string | null = null;
  let currentMethod: string | null = null;
  let braceDepth = 0;

  for (const line of lines) {
    // Track brace depth
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }

    // Skip comments and imports
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ') || trimmed.startsWith('package ')) {
      continue;
    }

    // Class declaration
    const classMatch = trimmed.match(classRegex);
    if (classMatch) {
      currentClass = classMatch[1];
      continue;
    }

    // Method declaration
    const methodMatch = trimmed.match(methodRegex);
    if (methodMatch && !javaTypes.has(methodMatch[1]) && methodMatch[1] !== currentClass) {
      const methodName = methodMatch[1];
      const params = methodMatch[2]
        .split(',')
        .map(p => p.trim().split(/\s+/).pop() || '')
        .filter(p => p.length > 0);

      if (!javaKeywords.has(methodName)) {
        functions.push({ name: methodName, params });
        declaredNames.add(methodName);
        currentMethod = methodName;
        continue;
      }
    }

    // Constructor
    const constructorMatch = trimmed.match(constructorRegex);
    if (constructorMatch && constructorMatch[1] === currentClass) {
      const params = constructorMatch[2]
        .split(',')
        .map(p => p.trim().split(/\s+/).pop() || '')
        .filter(p => p.length > 0);
      functions.push({ name: constructorMatch[1], params });
      declaredNames.add(constructorMatch[1]);
      currentMethod = constructorMatch[1];
      continue;
    }

    // Variable/field declaration
    const varMatch = trimmed.match(varRegex);
    if (varMatch && javaTypes.has(varMatch[1]) && !javaKeywords.has(varMatch[2])) {
      const varName = varMatch[2];
      const initExpr = varMatch[3] || varMatch[1];
      variables.push({
        name: varName,
        kind: 'field',
        initType: describeJavaInit(initExpr, varMatch[1]),
      });
      declaredNames.add(varName);
    }
  }

  // ── Pass 2: collect calls & relationships ─────────────────

  currentMethod = null;
  braceDepth = 0;
  let methodBraceStart = -1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ') || trimmed.startsWith('package ')) {
      continue;
    }

    // Detect method entry
    const methodMatch = trimmed.match(methodRegex);
    if (methodMatch && !javaTypes.has(methodMatch[1]) && !javaKeywords.has(methodMatch[1]) && methodMatch[1] !== currentClass) {
      currentMethod = methodMatch[1];
      methodBraceStart = braceDepth;
    }

    const constructorMatch = trimmed.match(constructorRegex);
    if (constructorMatch && constructorMatch[1] === currentClass) {
      currentMethod = constructorMatch[1];
      methodBraceStart = braceDepth;
    }

    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') {
        braceDepth--;
        if (currentMethod && braceDepth <= methodBraceStart) {
          currentMethod = null;
        }
      }
    }

    if (!currentMethod) continue;

    // Find method calls in this line
    let match: RegExpExecArray | null;
    const callRegexLocal = /(\w+)\s*\(/g;
    while ((match = callRegexLocal.exec(trimmed)) !== null) {
      const calledName = match[1];
      if (calledName !== currentMethod && declaredNames.has(calledName)) {
        callEdges.push({ from: currentMethod, to: calledName, label: 'calls' });
      }
    }

    // Find variable reads
    for (const v of variables) {
      if (trimmed.includes(v.name) && currentMethod) {
        // Check if it's an assignment (write) or read
        const assignPattern = new RegExp(`${v.name}\\s*=`);
        if (assignPattern.test(trimmed) && !trimmed.includes('==')) {
          writeEdges.push({ from: currentMethod, to: v.name });
        } else {
          readEdges.push({ from: currentMethod, to: v.name });
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
        varKind: v.kind as 'const' | 'let' | 'var',
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

function describeJavaInit(initExpr: string, type: string): string {
  const trimmed = initExpr.trim();
  if (trimmed.startsWith('new ')) {
    const match = trimmed.match(/new\s+(\w+)/);
    return match ? `new ${match[1]}()` : 'object';
  }
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) return 'String';
  if (/^\d+$/.test(trimmed)) return 'int';
  if (/^\d+\.\d+/.test(trimmed)) return 'double';
  if (trimmed === 'true' || trimmed === 'false') return 'boolean';
  if (trimmed.startsWith('{')) return 'array';
  if (trimmed.includes('(')) {
    const match = trimmed.match(/(\w+)\s*\(/);
    return match ? `${match[1]}()` : 'call';
  }
  return type;
}
