import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemAnim = {
  hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const languages = [
  {
    name: 'JavaScript',
    badge: { text: 'Supported', variant: 'blue' as const },
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="6" fill="#F7DF1E" />
        <text x="20" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#323330" fontFamily="monospace">JS</text>
      </svg>
    ),
    body: 'Full function call graphs, variable tracing, closures, and step-by-step execution.',
    hoverColor: 'hover:border-blue hover:shadow-[0_0_20px_rgba(91,141,239,0.12)]',
  },
  {
    name: 'Python',
    badge: { text: 'Supported', variant: 'amber' as const },
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="6" fill="#306998" />
        <text x="20" y="28" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="monospace">Py</text>
      </svg>
    ),
    body: 'Powered by Pyodide. Trace loops, recursion, and object methods with the same graph interface.',
    hoverColor: 'hover:border-amber hover:shadow-[0_0_20px_rgba(242,163,60,0.12)]',
  },
  {
    name: 'Java',
    badge: { text: 'Supported', variant: 'blue' as const },
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="6" fill="#ED8B00" />
        <text x="20" y="28" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" fontFamily="monospace">JV</text>
      </svg>
    ),
    body: 'Parse Java classes, methods, fields, and call relationships. Full syntax highlighting in the editor.',
    hoverColor: 'hover:border-amber hover:shadow-[0_0_20px_rgba(242,163,60,0.12)]',
  },
];

export function Languages() {
  return (
    <section id="languages" className="bg-surface-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-blue mb-3"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          LANGUAGE SUPPORT
        </motion.p>
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-text-dark-head mb-12"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Start with what you know
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              className={`bg-panel-dark border border-border-dark rounded-xl p-6 transition-all duration-200 ${lang.hoverColor}`}
              variants={itemAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-4">
                {lang.icon}
                <Badge variant={lang.badge.variant}>{lang.badge.text}</Badge>
              </div>
              <h3 className="font-display text-xl font-semibold text-text-dark-head mb-2">{lang.name}</h3>
              <p className="font-sans text-sm text-text-dark-body leading-relaxed">{lang.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
