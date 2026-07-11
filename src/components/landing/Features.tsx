import { motion } from 'framer-motion';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemAnim = {
  hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/* ── Feature 1 visual: typing animation SVG ─────────────── */
function TypingVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg viewBox="0 0 320 180" className="w-full">
        {/* Editor mock */}
        <rect x="10" y="10" width="140" height="160" rx="8" fill="#1C1F27" stroke="#262932" strokeWidth="1" />
        <motion.rect x="22" y="30" width="100" height="8" rx="2" fill="#5B8DEF" opacity="0.3"
          initial={prefersReducedMotion ? {} : { width: 0 }} animate={{ width: 100 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
        <rect x="22" y="46" width="80" height="8" rx="2" fill="#9DA5B8" opacity="0.2" />
        <rect x="22" y="62" width="110" height="8" rx="2" fill="#9DA5B8" opacity="0.2" />
        {/* Cursor */}
        <motion.rect x="122" y="28" width="2" height="14" fill="#5B8DEF"
          animate={prefersReducedMotion ? {} : { opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }} />

        {/* Arrow */}
        <motion.path d="M160 90 L175 90" stroke="#5B8DEF" strokeWidth="1.5" strokeDasharray="3 2"
          initial={prefersReducedMotion ? {} : { opacity: 0 }} animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.5 }} />

        {/* Graph node appearing */}
        <motion.g initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <rect x="185" y="60" width="120" height="44" rx="8" fill="#1E2128" stroke="#5B8DEF" strokeWidth="1.5" />
          <text x="245" y="78" textAnchor="middle" fill="#9DA5B8" fontSize="8" className="font-mono">FUNCTION</text>
          <text x="245" y="94" textAnchor="middle" fill="#EDEAE3" fontSize="12" className="font-mono" fontWeight="500">factorial</text>
        </motion.g>
      </svg>
    </div>
  );
}

/* ── Feature 2 visual: call graph SVG ───────────────────── */
function CallGraphVisual() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox="0 0 300 160" className="w-full">
        {/* Edges */}
        <line x1="80" y1="45" x2="180" y2="30" stroke="#5B8DEF" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
        <line x1="80" y1="45" x2="180" y2="80" stroke="#5B8DEF" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
        <line x1="80" y1="45" x2="180" y2="130" stroke="#5B8DEF" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
        {/* Labels on edges */}
        <text x="130" y="32" fill="#5B8DEF" fontSize="7" className="font-mono" opacity="0.6">calls</text>
        <text x="130" y="62" fill="#5B8DEF" fontSize="7" className="font-mono" opacity="0.6">calls</text>
        <text x="130" y="95" fill="#5B8DEF" fontSize="7" className="font-mono" opacity="0.6">reads</text>
        {/* Nodes */}
        <rect x="10" y="25" width="70" height="36" rx="6" fill="#1E2128" stroke="#5B8DEF" strokeWidth="1.5" />
        <text x="45" y="48" textAnchor="middle" fill="#EDEAE3" fontSize="10" className="font-mono">process</text>
        <rect x="170" y="10" width="70" height="36" rx="6" fill="#1E2128" stroke="#5B8DEF" strokeWidth="1.5" />
        <text x="205" y="33" textAnchor="middle" fill="#EDEAE3" fontSize="10" className="font-mono">filter</text>
        <rect x="170" y="60" width="70" height="36" rx="6" fill="#1E2128" stroke="#5B8DEF" strokeWidth="1.5" />
        <text x="205" y="83" textAnchor="middle" fill="#EDEAE3" fontSize="10" className="font-mono">sort</text>
        <rect x="170" y="110" width="70" height="36" rx="6" fill="#1E2128" stroke="#F2A33C" strokeWidth="1.5" />
        <text x="205" y="133" textAnchor="middle" fill="#EDEAE3" fontSize="10" className="font-mono">data</text>
      </svg>
    </div>
  );
}

/* ── Feature 3 visual: playback mockup ──────────────────── */
function PlaybackVisual() {
  return (
    <div className="w-full max-w-sm mx-auto bg-panel-dark rounded-xl border border-border-dark p-4">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-7 h-7 rounded-md bg-surface-dark flex items-center justify-center text-blue text-xs">⏮</div>
        <div className="w-7 h-7 rounded-md bg-surface-dark flex items-center justify-center text-blue text-xs">⏪</div>
        <div className="w-9 h-9 rounded-md bg-blue/10 flex items-center justify-center text-blue text-sm">▶</div>
        <div className="w-7 h-7 rounded-md bg-surface-dark flex items-center justify-center text-blue text-xs">⏩</div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <span className="font-mono text-xs text-text-dark-body">Step 3 / 12</span>
        <div className="flex gap-1">
          <span className="font-mono text-[10px] text-text-muted px-2 py-0.5 rounded border border-border-dark">0.5×</span>
          <span className="font-mono text-[10px] text-blue px-2 py-0.5 rounded border border-border-dark bg-blue/5">1×</span>
          <span className="font-mono text-[10px] text-text-muted px-2 py-0.5 rounded border border-border-dark">2×</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature 4 visual: language pills ───────────────────── */
function LanguagePillsVisual() {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        className="px-6 py-3 rounded-xl font-display font-medium text-blue border border-blue/30 bg-blue/5"
        animate={prefersReducedMotion ? {} : { boxShadow: ['0 0 0px rgba(91,141,239,0)', '0 0 20px rgba(91,141,239,0.2)', '0 0 0px rgba(91,141,239,0)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        JavaScript
      </motion.div>
      <motion.div
        className="px-6 py-3 rounded-xl font-display font-medium text-amber border border-amber/30 bg-amber/5"
        animate={prefersReducedMotion ? {} : { boxShadow: ['0 0 0px rgba(242,163,60,0)', '0 0 20px rgba(242,163,60,0.2)', '0 0 0px rgba(242,163,60,0)'] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      >
        Python
      </motion.div>
    </div>
  );
}

/* ── Feature data ───────────────────────────────────────── */
const features = [
  {
    bg: 'bg-surface-light',
    textHeading: 'text-text-heading',
    textBody: 'text-text-body',
    label: 'INSTANT FEEDBACK',
    heading: 'Updates as you type',
    body: 'No more running and guessing. Flowcell parses your JavaScript or Python on every keystroke and redraws the relationship graph in real time — even before your code is syntactically complete.',
    visual: <TypingVisual />,
    reversed: false,
  },
  {
    bg: 'bg-surface-dark',
    textHeading: 'text-text-dark-head',
    textBody: 'text-text-dark-body',
    label: 'CALL GRAPHS',
    heading: 'See what calls what',
    body: 'Every function call, variable reference, and data dependency becomes a visible edge on the graph. Understand structure at a glance instead of reading line by line.',
    visual: <CallGraphVisual />,
    reversed: true,
  },
  {
    bg: 'bg-surface-light',
    textHeading: 'text-text-heading',
    textBody: 'text-text-body',
    label: 'STEP THROUGH',
    heading: 'Replay your execution',
    body: 'Hit Run and step through your code forward or backward. Watch variable values update live on the graph nodes, and calls enter and exit in real time.',
    visual: <PlaybackVisual />,
    reversed: false,
  },
  {
    bg: 'bg-surface-dark',
    textHeading: 'text-text-dark-head',
    textBody: 'text-text-dark-body',
    label: 'MULTI-LANGUAGE',
    heading: 'JavaScript and Python',
    body: 'Switch languages without losing your graph layout. The same visualization, the same controls — powered by different runtimes behind the scenes.',
    visual: <LanguagePillsVisual />,
    reversed: true,
  },
];

export function Features() {
  return (
    <section id="features">
      {features.map((f, i) => (
        <div key={i} className={`${f.bg} py-24 px-6`}>
          <div
            className={`max-w-6xl mx-auto flex flex-col ${
              f.reversed ? 'md:flex-row-reverse' : 'md:flex-row'
            } items-center gap-12 md:gap-20`}
          >
            {/* Text */}
            <div className="flex-1 max-w-lg">
              <motion.p
                className="font-mono text-xs tracking-[0.2em] text-blue mb-3"
                variants={itemAnim}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55 }}
              >
                {f.label}
              </motion.p>
              <motion.h2
                className={`font-display text-3xl md:text-4xl font-bold ${f.textHeading} mb-4`}
                variants={itemAnim}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                {f.heading}
              </motion.h2>
              <motion.p
                className={`font-sans text-base leading-relaxed ${f.textBody}`}
                variants={itemAnim}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.16 }}
              >
                {f.body}
              </motion.p>
            </div>
            {/* Visual */}
            <motion.div
              className="flex-1 flex items-center justify-center"
              variants={itemAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.24 }}
            >
              {f.visual}
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}
