import { useEffect, useRef, useCallback } from 'react';
import { useFlowStore } from '../../store/useFlowStore';
import { Trash2 } from 'lucide-react';
import type { ConsoleEntry } from '../../types';

/**
 * ConsolePanel — Displays output from code execution.
 * Renders below the editor. Shows console.log output, return values, and errors.
 */
export function OutputPanel() {
  const consoleOutput = useFlowStore((s) => s.consoleOutput);
  const clearConsole = useFlowStore((s) => s.clearConsole);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const handleClear = useCallback(() => {
    clearConsole();
  }, [clearConsole]);

  const getLineClass = (entry: ConsoleEntry) => {
    switch (entry.type) {
      case 'return':
        return 'console-line console-return';
      case 'error':
        return 'console-line console-error';
      case 'system':
        return 'console-line console-system';
      default:
        return 'console-line';
    }
  };

  return (
    <div className="console-panel">
      <div className="panel-header">
        <span className="panel-label">console</span>
        <div className="console-actions">
          <button
            className="console-clear-btn"
            onClick={handleClear}
            title="Clear console"
          >
            <Trash2 size={10} />
            Clear
          </button>
        </div>
      </div>
      <div className="console-container" ref={containerRef}>
        {consoleOutput.length === 0 ? (
          <div className="console-placeholder">
            Click "Compile & Run" to execute your code
          </div>
        ) : (
          consoleOutput.map((entry, i) => (
            <div key={i} className={getLineClass(entry)}>
              {entry.type === 'return' ? `→ ${entry.text}` : entry.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
