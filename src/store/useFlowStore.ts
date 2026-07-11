import { create } from 'zustand';
import type { FlowNode, FlowEdge, Language, ExecutionStatus, ConsoleEntry } from '../types';
import { examples, getExamplesByLanguage } from '../utils/examples';

// ── Store Interface ────────────────────────────────────────

interface FlowState {
  code: string;
  language: Language;
  nodes: FlowNode[];
  edges: FlowEdge[];
  parseError: string | null;
  selectedExample: string;

  // Execution state (Change 2)
  executionStatus: ExecutionStatus;
  consoleOutput: ConsoleEntry[];
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;

  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  setGraph: (nodes: FlowNode[], edges: FlowEdge[]) => void;
  setParseError: (error: string | null) => void;
  loadExample: (key: string) => void;

  // Execution actions
  setExecutionStatus: (status: ExecutionStatus) => void;
  setConsoleOutput: (output: ConsoleEntry[]) => void;
  addConsoleEntry: (entry: ConsoleEntry) => void;
  clearConsole: () => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  resetExecution: () => void;
}

// ── Store ──────────────────────────────────────────────────

export const useFlowStore = create<FlowState>((set, get) => ({
  code: examples[0].code,
  language: examples[0].language,
  nodes: [],
  edges: [],
  parseError: null,
  selectedExample: examples[0].key,

  // Execution defaults
  executionStatus: 'idle',
  consoleOutput: [],
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,

  setCode: (code) => {
    set({ code });
    // Reset execution when code changes
    const current = get();
    if (current.executionStatus !== 'idle') {
      set({
        executionStatus: 'idle',
        consoleOutput: [],
        isPlaying: false,
        currentStep: 0,
        totalSteps: 0,
      });
    }
  },

  setLanguage: (language) => {
    const current = get();
    if (current.language === language) return;

    // When switching languages, load the first example for that language
    const langExamples = getExamplesByLanguage(language);
    const firstExample = langExamples[0];
    if (firstExample) {
      set({
        language,
        code: firstExample.code,
        selectedExample: firstExample.key,
        nodes: [],
        edges: [],
        parseError: null,
        executionStatus: 'idle',
        consoleOutput: [],
        isPlaying: false,
        currentStep: 0,
        totalSteps: 0,
      });
    } else {
      set({
        language,
        code: '',
        nodes: [],
        edges: [],
        parseError: null,
        executionStatus: 'idle',
        consoleOutput: [],
        isPlaying: false,
        currentStep: 0,
        totalSteps: 0,
      });
    }
  },

  setGraph: (incomingNodes, incomingEdges) => {
    const current = get();
    // Merge positions: if a node already exists, keep its user-dragged position
    const existingPositions = new Map(current.nodes.map((n) => [n.id, n.position]));

    const mergedNodes = incomingNodes.map((node) => {
      const existing = existingPositions.get(node.id);
      if (existing) {
        return { ...node, position: existing };
      }
      return node;
    });

    set({ nodes: mergedNodes, edges: incomingEdges, parseError: null });
  },

  setParseError: (error) => set({ parseError: error }),

  loadExample: (key) => {
    const example = examples.find((e) => e.key === key);
    if (example) {
      // Clear existing positions so example gets a fresh layout
      set({
        code: example.code,
        selectedExample: key,
        language: example.language,
        nodes: [],
        edges: [],
        executionStatus: 'idle',
        consoleOutput: [],
        isPlaying: false,
        currentStep: 0,
        totalSteps: 0,
      });
    }
  },

  // Execution actions
  setExecutionStatus: (status) => set({ executionStatus: status }),
  setConsoleOutput: (output) => set({ consoleOutput: output }),
  addConsoleEntry: (entry) => set((s) => ({ consoleOutput: [...s.consoleOutput, entry] })),
  clearConsole: () => set({ consoleOutput: [] }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setTotalSteps: (total) => set({ totalSteps: total }),
  resetExecution: () =>
    set({
      executionStatus: 'idle',
      consoleOutput: [],
      isPlaying: false,
      currentStep: 0,
      totalSteps: 0,
    }),
}));
