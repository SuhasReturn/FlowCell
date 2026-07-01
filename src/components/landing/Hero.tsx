import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const headlineWords = ['See', 'your', 'code', 'think.'];

const floatingNodes = [
  { label: 'factorial(n)', x: 15, y: 20, delay: 0 },
  { label: 'result', x: 72, y: 15, delay: 0.5 },
  { label: 'loop(i)', x: 80, y: 65, delay: 1 },
  { label: 'sum', x: 25, y: 72, delay: 1.5 },
  { label: 'getData()', x: 50, y: 40, delay: 2 },
  { label: 'count', x: 10, y: 48, delay: 0.8 },
  { label: 'filter()', x: 65, y: 85, delay: 1.2 },
];

export function Hero() {
  return (
    <section className="relative min-h-screen bg-surface-dark flex items-center justify-center overflow-hidden">
      {/* Floating background nodes */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingNodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs text-blue/20 border border-blue/10 rounded-lg px-3 py-1.5"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: [0, 15, -10, 0],
                    y: [0, -12, 8, 0],
                  }
            }
            transition={{
              duration: 7 + i,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
              delay: node.delay,
            }}
          >
            {node.label}
          </motion.div>
        ))}
        {/* Faint connector lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <line x1="20%" y1="25%" x2="55%" y2="45%" stroke="#5B8DEF" strokeWidth="1" />
          <line x1="55%" y1="45%" x2="75%" y2="20%" stroke="#5B8DEF" strokeWidth="1" />
          <line x1="55%" y1="45%" x2="30%" y2="75%" stroke="#5B8DEF" strokeWidth="1" />
          <line x1="55%" y1="45%" x2="82%" y2="70%" stroke="#5B8DEF" strokeWidth="1" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Label */}
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-blue/80 mb-6"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          LIVE CODE VISUALIZATION
        </motion.p>

        {/* Headline — each word animates in, with proper spacing */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-text-dark-head leading-tight mb-6 flex flex-wrap justify-center gap-x-5">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          className="font-sans text-lg md:text-xl text-text-dark-body max-w-xl mx-auto mb-10"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Watch functions, variables, and logic connect in real time — as you type.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          <Button to="/visualize">Start visualizing →</Button>
          <Button
            variant="ghost-dark"
            onClick={() =>
              document.querySelector('#features')?.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
              })
            }
          >
            See how it works
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
