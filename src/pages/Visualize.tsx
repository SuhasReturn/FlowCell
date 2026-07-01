import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, SkipBack, Rewind, Play, FastForward } from 'lucide-react';
import { Header } from '../components/visualizer/Header';
import { EditorPanel } from '../components/visualizer/EditorPanel';
import { GraphPanel } from '../components/visualizer/GraphPanel';
import { useCodeParser } from '../hooks/useCodeParser';
import { useFlowStore } from '../store/useFlowStore';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  return (
    <motion.div
      className="viz-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top bar */}
      <div className="viz-topbar">
        <div className="viz-topbar-left">
          <Link to="/" className="viz-wordmark">flowcell</Link>
        </div>
        <div className="viz-topbar-center">
          <Header />
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
        <EditorPanel />
        <div className="pane-divider" aria-hidden="true">
          <DividerPulse />
        </div>
        <GraphPanel />
      </main>

      {/* Playback bar (placeholder — Phase 2 wires logic) */}
      <div className="playback-bar">
        <div className="playback-controls">
          <button className="playback-btn" aria-label="Reset" disabled>
            <SkipBack size={16} />
          </button>
          <button className="playback-btn" aria-label="Step back" disabled>
            <Rewind size={16} />
          </button>
          <button className="playback-btn primary" aria-label="Play" disabled>
            <Play size={18} />
          </button>
          <button className="playback-btn" aria-label="Step forward" disabled>
            <FastForward size={16} />
          </button>
        </div>
        <span className="step-counter">Step 0 / 0</span>
        <div className="speed-selector">
          <button className="speed-btn" disabled>0.5×</button>
          <button className="speed-btn active" disabled>1×</button>
          <button className="speed-btn" disabled>2×</button>
        </div>
      </div>
    </motion.div>
  );
}
