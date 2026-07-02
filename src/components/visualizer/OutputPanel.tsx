import { useState, useEffect, useRef, useCallback } from 'react';
import { useFlowStore } from '../../store/useFlowStore';
import { Play, Trash2 } from 'lucide-react';

/**
 * OutputPanel — Executes user code and displays console output.
 * JS: Uses Function() in a sandboxed scope
 * Python: Uses Pyodide (lazy-loaded)
 * Java: Shows a "not executable" message (Java can't run client-side)
 */
export function OutputPanel() {
  const code = useFlowStore((s) => s.code);
  const language = useFlowStore((s) => s.language);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyLoading, setPyLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);

    if (language === 'javascript') {
      // Execute JS in a sandboxed Function scope
      try {
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
          error: (...args: any[]) => logs.push(`[error] ${args.map(String).join(' ')}`),
          warn: (...args: any[]) => logs.push(`[warn] ${args.map(String).join(' ')}`),
          info: (...args: any[]) => logs.push(args.map(String).join(' ')),
        };

        const fn = new Function('console', code);
        fn(mockConsole);
        setOutput(logs.length > 0 ? logs : ['(no output)']);
      } catch (err: any) {
        setOutput([`Error: ${err.message}`]);
      }
    } else if (language === 'python') {
      try {
        // Lazy-load Pyodide
        let py = pyodide;
        if (!py) {
          setPyLoading(true);
          setOutput(['Loading Python runtime...']);
          // @ts-ignore
          const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs');
          py = await loadPyodide();
          setPyodide(py);
          setPyLoading(false);
        }
        
        // Capture stdout
        py.runPython(`
import sys
from io import StringIO
_stdout = sys.stdout
sys.stdout = StringIO()
`);
        py.runPython(code);
        const stdout = py.runPython(`
result = sys.stdout.getvalue()
sys.stdout = _stdout
result
`);
        const lines = stdout ? stdout.split('\n').filter((l: string) => l !== '') : [];
        setOutput(lines.length > 0 ? lines : ['(no output)']);
      } catch (err: any) {
        setOutput([`Error: ${err.message}`]);
        setPyLoading(false);
      }
    } else if (language === 'java') {
      setOutput([
        'Java execution is not available in the browser.',
        'The graph visualization still works as you type.',
        'To run Java code, use an IDE like IntelliJ or VS Code.',
      ]);
    }

    setIsRunning(false);
  }, [code, language, pyodide]);

  return (
    <div className="output-panel">
      <div className="panel-header">
        <span className="panel-label">output</span>
        <div className="output-actions">
          <button
            className="output-btn run-btn"
            onClick={runCode}
            disabled={isRunning || pyLoading}
            title="Run code"
          >
            <Play size={12} />
            {isRunning ? 'Running…' : pyLoading ? 'Loading…' : 'Run'}
          </button>
          <button
            className="output-btn"
            onClick={clearOutput}
            title="Clear output"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="output-container" ref={outputRef}>
        {output.length === 0 ? (
          <div className="output-placeholder">
            Click "Run" to execute your code and see output here
          </div>
        ) : (
          output.map((line, i) => (
            <div
              key={i}
              className={`output-line ${line.startsWith('Error:') || line.startsWith('[error]') ? 'output-error' : ''}`}
            >
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
