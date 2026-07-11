import { useEffect, useCallback, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, SkipBack, Rewind, Play, FastForward, Pause, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Header } from '../components/visualizer/Header';
import { EditorPanel } from '../components/visualizer/EditorPanel';
import { GraphPanel } from '../components/visualizer/GraphPanel';
import { OutputPanel } from '../components/visualizer/OutputPanel';
import { DSADrawer } from '../components/visualizer/DSADrawer';
import { useCodeParser } from '../hooks/useCodeParser';
import { useFlowStore } from '../store/useFlowStore';
import type { ConsoleEntry } from '../types';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MAX_STEPS = 5000;

function DividerPulse() {
  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="divider-pulse"
      animate={{ top: ['-12px', 'calc(100% + 12px)'] }}
      transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
    />
  );
}

export default function Visualize() {
  const [searchParams] = useSearchParams();
  const loadExample = useFlowStore((s) => s.loadExample);
  const code = useFlowStore((s) => s.code);
  const language = useFlowStore((s) => s.language);
  const executionStatus = useFlowStore((s) => s.executionStatus);
  const setExecutionStatus = useFlowStore((s) => s.setExecutionStatus);
  const setConsoleOutput = useFlowStore((s) => s.setConsoleOutput);
  const addConsoleEntry = useFlowStore((s) => s.addConsoleEntry);
  const isPlaying = useFlowStore((s) => s.isPlaying);
  const setIsPlaying = useFlowStore((s) => s.setIsPlaying);
  const currentStep = useFlowStore((s) => s.currentStep);
  const setCurrentStep = useFlowStore((s) => s.setCurrentStep);
  const totalSteps = useFlowStore((s) => s.totalSteps);
  const setTotalSteps = useFlowStore((s) => s.setTotalSteps);

  const [dsaOpen, setDsaOpen] = useState(false);
  const playIntervalRef = useRef<number | null>(null);
  const pyodideRef = useRef<any>(null);
  const pyLoadingRef = useRef(false);

  useCodeParser();

  // Load example from query param if present
  useEffect(() => {
    const example = searchParams.get('example');
    if (example) {
      const keyMap: Record<string, string> = {
        recursion: 'factorial',
        loop: 'array-processing',
        object: 'counter',
        chain: 'callbacks',
      };
      const key = keyMap[example] ?? example;
      loadExample(key);
    }
  }, [searchParams, loadExample]);

  // Cleanup play interval on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  // ── STEP A: Compile & Run ─────────────────────────────
  const handleCompileRun = useCallback(async () => {
    setExecutionStatus('running');
    setConsoleOutput([]);

    if (language === 'javascript') {
      try {
        const logs: ConsoleEntry[] = [];
        let stepCount = 0;

        const mockConsole = {
          log: (...args: any[]) => {
            stepCount++;
            if (stepCount > MAX_STEPS) throw new Error('Execution stopped — possible infinite loop');
            logs.push({
              type: 'normal' as const,
              text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '),
            });
          },
          error: (...args: any[]) => {
            logs.push({ type: 'error' as const, text: args.map(String).join(' ') });
          },
          warn: (...args: any[]) => {
            logs.push({ type: 'normal' as const, text: `[warn] ${args.map(String).join(' ')}` });
          },
          info: (...args: any[]) => {
            logs.push({ type: 'normal' as const, text: args.map(String).join(' ') });
          },
        };

        const fn = new Function('console', code);
        const result = fn(mockConsole);

        if (result !== undefined) {
          logs.push({ type: 'return', text: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result) });
        }

        if (logs.length === 0) {
          logs.push({ type: 'system', text: '(no output)' });
        }

        setConsoleOutput(logs);
        setTotalSteps(logs.length);
        setCurrentStep(logs.length);
        setExecutionStatus('success');
      } catch (err: any) {
        const isInfinite = err.message?.includes('infinite loop') || err.message?.includes('Execution stopped');
        setConsoleOutput([{
          type: 'error',
          text: isInfinite ? 'Execution stopped — possible infinite loop' : `Error: ${err.message}`,
        }]);
        setExecutionStatus('error');
      }
    } else if (language === 'python') {
      try {
        let py = pyodideRef.current;
        if (!py) {
          if (pyLoadingRef.current) {
            addConsoleEntry({ type: 'system', text: 'Python runtime is still loading...' });
            setExecutionStatus('idle');
            return;
          }
          pyLoadingRef.current = true;
          addConsoleEntry({ type: 'system', text: 'Loading Python runtime...' });
          // @ts-expect-error dynamic import from CDN
          const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs');
          py = await loadPyodide();
          pyodideRef.current = py;
          pyLoadingRef.current = false;
        }

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
        const entries: ConsoleEntry[] = lines.length > 0
          ? lines.map((l: string) => ({ type: 'normal' as const, text: l }))
          : [{ type: 'system' as const, text: '(no output)' }];

        setConsoleOutput(entries);
        setTotalSteps(entries.length);
        setCurrentStep(entries.length);
        setExecutionStatus('success');
      } catch (err: any) {
        setConsoleOutput([{ type: 'error', text: `Error: ${err.message}` }]);
        setExecutionStatus('error');
        pyLoadingRef.current = false;
      }
    } else if (language === 'java') {
      setConsoleOutput([
        { type: 'system', text: 'Java execution is not available in the browser.' },
        { type: 'system', text: 'The graph visualization still works as you type.' },
        { type: 'system', text: 'To run Java code, use an IDE like IntelliJ or VS Code.' },
      ]);
      setExecutionStatus('error');
    }
  }, [code, language, setExecutionStatus, setConsoleOutput, addConsoleEntry, setTotalSteps, setCurrentStep]);

  // ── STEP B: Playback ──────────────────────────────────
  const handlePlay = useCallback(() => {
    if (executionStatus !== 'success') return;

    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
      setIsPlaying(false);
      return;
    }

    const start = currentStep >= totalSteps ? 0 : currentStep;
    setCurrentStep(start);
    setIsPlaying(true);

    playIntervalRef.current = window.setInterval(() => {
      const state = useFlowStore.getState();
      if (state.currentStep >= state.totalSteps) {
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
        setIsPlaying(false);
        return;
      }
      setCurrentStep(state.currentStep + 1);
    }, 400);
  }, [executionStatus, isPlaying, currentStep, totalSteps, setIsPlaying, setCurrentStep]);

  const handleStepBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }, [currentStep, setCurrentStep]);

  const handleStepForward = useCallback(() => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  }, [currentStep, totalSteps, setCurrentStep]);

  const handleReset = useCallback(() => {
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    playIntervalRef.current = null;
    setIsPlaying(false);
    setCurrentStep(0);
  }, [setIsPlaying, setCurrentStep]);

  // ── Compile button rendering ──────────────────────────
  const renderCompileButton = () => {
    switch (executionStatus) {
      case 'running':
        return (
          <button className="compile-btn running" disabled>
            <span className="spinner" />
            Running…
          </button>
        );
      case 'success':
        return (
          <button className="compile-btn success" onClick={handleCompileRun}>
            <CheckCircle size={14} />
            ✓ Ready
          </button>
        );
      case 'error':
        return (
          <button className="compile-btn error" onClick={handleCompileRun}>
            <XCircle size={14} />
            ✗ Error — retry
          </button>
        );
      default:
        return (
          <button className="compile-btn idle" onClick={handleCompileRun}>
            <Play size={14} />
            Compile & Run
          </button>
        );
    }
  };

  const playbackDisabled = executionStatus !== 'success';

  return (
    <motion.div
      className="viz-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* DSA Drawer */}
      <DSADrawer isOpen={dsaOpen} onClose={() => setDsaOpen(false)} />

      {/* Top bar */}
      <div className="viz-topbar">
        <div className="viz-topbar-left">
          <Link to="/" className="viz-wordmark">flowcell</Link>
          <button className="dsa-btn" onClick={() => setDsaOpen(true)}>
            <BookOpen size={14} />
            DSA Presets
          </button>
        </div>
        <div className="viz-topbar-center">
          <Header />
          {renderCompileButton()}
        </div>
        <div className="viz-topbar-right">
          <button className="viz-share-btn" title="Sharing coming soon" disabled>
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>

      {/* Main panes */}
      <main className="split-pane">
        <div className="editor-output-column">
          <EditorPanel />
          <OutputPanel />
        </div>
        <div className="pane-divider" aria-hidden="true">
          <DividerPulse />
        </div>
        <GraphPanel />
      </main>

      {/* Playback bar */}
      <div className="playback-bar">
        <div className="playback-controls">
          <button
            className="playback-btn"
            aria-label="Reset"
            disabled={playbackDisabled}
            onClick={handleReset}
          >
            <SkipBack size={16} />
          </button>
          <button
            className="playback-btn"
            aria-label="Step back"
            disabled={playbackDisabled || currentStep <= 0}
            onClick={handleStepBack}
          >
            <Rewind size={16} />
          </button>
          <button
            className="playback-btn primary"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={playbackDisabled}
            onClick={handlePlay}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className="playback-btn"
            aria-label="Step forward"
            disabled={playbackDisabled || currentStep >= totalSteps}
            onClick={handleStepForward}
          >
            <FastForward size={16} />
          </button>
        </div>
        <span className="step-counter">
          Step {currentStep} / {totalSteps}
        </span>
        <div className="speed-selector">
          <button className="speed-btn" disabled={playbackDisabled}>0.5×</button>
          <button className="speed-btn active" disabled={playbackDisabled}>1×</button>
          <button className="speed-btn" disabled={playbackDisabled}>2×</button>
        </div>
      </div>
    </motion.div>
  );
}
