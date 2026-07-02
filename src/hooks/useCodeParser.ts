import { useEffect, useRef } from 'react';
import { useFlowStore } from '../store/useFlowStore';
import { parseAndBuildGraph } from '../utils/astToGraph';
import { parseJavaAndBuildGraph } from '../utils/javaParser';
import { parsePythonAndBuildGraph } from '../utils/pythonParser';

const DEBOUNCE_MS = 250;

/**
 * Custom hook that watches the code in the store,
 * debounces 250ms, then parses with the appropriate parser
 * based on the selected language and updates the graph.
 * On syntax errors, keeps the last valid graph and sets the error.
 */
export function useCodeParser() {
  const code = useFlowStore((s) => s.code);
  const language = useFlowStore((s) => s.language);
  const setGraph = useFlowStore((s) => s.setGraph);
  const setParseError = useFlowStore((s) => s.setParseError);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending parse
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      try {
        let result;
        if (language === 'java') {
          result = parseJavaAndBuildGraph(code);
        } else if (language === 'python') {
          result = parsePythonAndBuildGraph(code);
        } else {
          result = parseAndBuildGraph(code);
        }
        const { nodes, edges } = result;
        setGraph(nodes, edges);
      } catch (err) {
        // On parse error, keep the last valid graph
        const message = err instanceof Error ? err.message : 'Unknown parse error';
        setParseError(message);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [code, language, setGraph, setParseError]);
}
