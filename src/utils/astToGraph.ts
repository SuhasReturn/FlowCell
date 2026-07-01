import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
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
  bodyNode: acorn.Node;
}

interface VariableInfo {
  name: string;
  kind: 'const' | 'let' | 'var';
  initType: string;
}

// ── Main export ────────────────────────────────────────────

export function parseAndBuildGraph(code: string): GraphData {
  const ast = acorn.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    locations: true,
  });

  const functions: FunctionInfo[] = [];
  const variables: VariableInfo[] = [];
  const declaredNames = new Set<string>();

  // ── Pass 1: collect top-level declarations ─────────────

  for (const node of (ast as acorn.Program).body) {
    if (node.type === 'FunctionDeclaration' && node.id) {
      const name = node.id.name;
      functions.push({
        name,
        params: node.params.map(paramToName),
        bodyNode: node.body,
      });
      declaredNames.add(name);
    }

    if (node.type === 'VariableDeclaration') {
      for (const decl of node.declarations) {
        if (decl.id.type === 'Identifier') {
          const name = decl.id.name;

          // Check if the initialiser is a function expression / arrow
          if (
            decl.init &&
            (decl.init.type === 'FunctionExpression' ||
              decl.init.type === 'ArrowFunctionExpression')
          ) {
            functions.push({
              name,
              params: decl.init.params.map(paramToName),
              bodyNode: decl.init.body,
            });
          } else {
            variables.push({
              name,
              kind: node.kind as 'const' | 'let' | 'var',
              initType: decl.init ? describeInit(decl.init) : 'undefined',
            });
          }
          declaredNames.add(name);
        }
      }
    }
  }

  // ── Build nodes ────────────────────────────────────────

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
        varKind: v.kind,
        initType: v.initType,
        kind: 'variable',
      } satisfies VariableNodeData,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  // ── Pass 2: collect edges from function bodies ─────────

  const edges: FlowEdge[] = [];
  const edgeSet = new Set<string>();

  for (const fn of functions) {
    const sourceId = `func-${fn.name}`;

    walk.simple(fn.bodyNode, {
      // Call expressions: fn() calls
      CallExpression(callNode: acorn.CallExpression) {
        if (callNode.callee.type === 'Identifier' && declaredNames.has(callNode.callee.name)) {
          const calledName = callNode.callee.name;
          const targetId = functions.some((f) => f.name === calledName)
            ? `func-${calledName}`
            : `var-${calledName}`;

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
      },

      // Assignment to a known variable
      AssignmentExpression(assignNode: acorn.AssignmentExpression) {
        if (assignNode.left.type === 'Identifier') {
          const leftName = assignNode.left.name;
          if (!variables.some((v) => v.name === leftName)) return;
          const targetId = `var-${leftName}`;
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
      },

      // Identifier references to known variables (reads)
      Identifier(idNode: acorn.Identifier) {
        const name = idNode.name;
        if (
          variables.some((v) => v.name === name) &&
          // Exclude the function's own params
          !fn.params.includes(name)
        ) {
          const targetId = `var-${name}`;
          const edgeKey = `${sourceId}->reads->${targetId}`;
          // Don't add a "reads" edge if we already have a "writes" edge
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
      },
    });
  }

  // Also check top-level expression statements for calls
  for (const node of (ast as acorn.Program).body) {
    if (node.type === 'ExpressionStatement') {
      walk.simple(node, {
        CallExpression(callNode: acorn.CallExpression) {
          if (callNode.callee.type !== 'Identifier') return;
          const calleeName = callNode.callee.name;
          if (!declaredNames.has(calleeName)) return;
          // Top-level call — check if arguments reference other declared entities
          for (const arg of callNode.arguments) {
            if (arg.type === 'Identifier' && declaredNames.has(arg.name)) {
              const fromId = functions.some((f) => f.name === calleeName)
                ? `func-${calleeName}`
                : `var-${calleeName}`;
              const toId = functions.some((f) => f.name === arg.name)
                ? `func-${arg.name}`
                : `var-${arg.name}`;
              const edgeKey = `${fromId}->receives->${toId}`;
              if (!edgeSet.has(edgeKey) && fromId !== toId) {
                edgeSet.add(edgeKey);
                edges.push({
                  id: edgeKey,
                  source: fromId,
                  target: toId,
                  label: 'receives',
                  style: { strokeDasharray: '3 3' },
                  data: { relationship: 'reads' },
                });
              }
            }
          }
        },
      });
    }
  }

  return { nodes, edges };
}

// ── Helpers ────────────────────────────────────────────────

function paramToName(param: acorn.Pattern): string {
  if (param.type === 'Identifier') return param.name;
  if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier')
    return param.left.name;
  if (param.type === 'RestElement' && param.argument.type === 'Identifier')
    return `...${param.argument.name}`;
  return '?';
}

function describeInit(node: acorn.Expression): string {
  switch (node.type) {
    case 'Literal':
      return typeof node.value === 'string' ? 'string' : String(typeof node.value);
    case 'ArrayExpression':
      return `array[${node.elements.length}]`;
    case 'ObjectExpression':
      return `object{${node.properties.length}}`;
    case 'CallExpression':
      return node.callee.type === 'Identifier' ? `${node.callee.name}()` : 'call';
    case 'TemplateLiteral':
      return 'template';
    case 'BinaryExpression':
      return 'expression';
    case 'Identifier':
      return node.name;
    default:
      return 'expression';
  }
}
