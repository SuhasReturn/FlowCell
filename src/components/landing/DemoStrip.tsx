import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemAnim = {
  hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const demos = [
  {
    key: 'recursion',
    label: 'Recursion',
    code: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconst result = factorial(5);`,
    nodes: [
      { x: 30, y: 25, label: 'factorial', color: '#5B8DEF' },
      { x: 130, y: 70, label: 'result', color: '#F2A33C' },
      { x: 30, y: 70, label: 'n', color: '#F2A33C' },
    ],
    edges: [
      { x1: 70, y1: 35, x2: 130, y2: 80 },
      { x1: 70, y1: 35, x2: 30, y2: 80 },
    ],
  },
  {
    key: 'loop',
    label: 'Array Loop',
    code: `const nums = [1, 2, 3, 4];\nfunction double(arr) {\n  return arr.map(n => n * 2);\n}\nconst result = double(nums);`,
    nodes: [
      { x: 30, y: 25, label: 'double', color: '#5B8DEF' },
      { x: 130, y: 25, label: 'nums', color: '#F2A33C' },
      { x: 80, y: 75, label: 'result', color: '#F2A33C' },
    ],
    edges: [
      { x1: 70, y1: 35, x2: 130, y2: 35 },
      { x1: 70, y1: 35, x2: 80, y2: 85 },
    ],
  },
  {
    key: 'object',
    label: 'Object Methods',
    code: `let count = 0;\nfunction increment() {\n  count += 1;\n}\nfunction reset() {\n  count = 0;\n}`,
    nodes: [
      { x: 30, y: 20, label: 'increment', color: '#5B8DEF' },
      { x: 30, y: 70, label: 'reset', color: '#5B8DEF' },
      { x: 140, y: 45, label: 'count', color: '#F2A33C' },
    ],
    edges: [
      { x1: 70, y1: 30, x2: 140, y2: 55 },
      { x1: 70, y1: 80, x2: 140, y2: 55 },
    ],
  },
  {
    key: 'chain',
    label: 'Function Chain',
    code: `function parse(s) {\n  return JSON.parse(s);\n}\nfunction validate(data) {\n  return data.valid;\n}\nconst ok = validate(parse(input));`,
    nodes: [
      { x: 30, y: 25, label: 'parse', color: '#5B8DEF' },
      { x: 30, y: 70, label: 'validate', color: '#5B8DEF' },
      { x: 140, y: 50, label: 'ok', color: '#F2A33C' },
    ],
    edges: [
      { x1: 70, y1: 35, x2: 30, y2: 80 },
      { x1: 70, y1: 80, x2: 140, y2: 60 },
    ],
  },
];

export function DemoStrip() {
  return (
    <section id="demo" className="bg-surface-light py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-blue mb-3"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          FLOWCELL IN ACTION
        </motion.p>
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-text-heading mb-2"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Your code, visualized.
        </motion.h2>
        <motion.p
          className="font-sans text-text-body mb-10"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.16 }}
        >
          Pick an example and watch the graph build itself.
        </motion.p>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.key}
              className="flex-shrink-0 w-[280px] snap-start bg-white border border-border-light rounded-xl overflow-hidden hover:-translate-y-[3px] hover:border-blue transition-all duration-200 group"
              variants={itemAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.08 * i }}
            >
              {/* Code preview */}
              <div className="bg-panel-dark p-4 h-[140px] overflow-hidden">
                <pre className="font-mono text-[11px] leading-relaxed text-text-dark-body whitespace-pre-wrap">
                  {demo.code}
                </pre>
              </div>

              {/* Graph preview */}
              <div className="p-4 h-[120px] relative">
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  {demo.edges.map((e, j) => (
                    <line
                      key={j}
                      x1={e.x1}
                      y1={e.y1}
                      x2={e.x2}
                      y2={e.y2}
                      stroke="#5B8DEF"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.35"
                    />
                  ))}
                  {demo.nodes.map((n, j) => (
                    <g key={j}>
                      <rect
                        x={n.x}
                        y={n.y}
                        width={60}
                        height={24}
                        rx={6}
                        fill="white"
                        stroke={n.color}
                        strokeWidth="1.5"
                      />
                      <text
                        x={n.x + 30}
                        y={n.y + 15}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize="8"
                        fill="#4B5263"
                      >
                        {n.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Label + link */}
              <div className="px-4 pb-4 flex items-center justify-between">
                <span className="font-display text-sm font-medium text-text-heading">
                  {demo.label}
                </span>
                <Link
                  to={`/visualize?example=${demo.key}`}
                  className="font-sans text-xs text-blue hover:underline"
                >
                  Try this →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
