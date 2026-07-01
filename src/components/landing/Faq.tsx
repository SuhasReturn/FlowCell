import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemAnim = {
  hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const faqs = [
  {
    q: 'Is Flowcell free to use?',
    a: 'Yes. Flowcell runs entirely in your browser with no account required. Everything is free during the current version.',
  },
  {
    q: 'Does my code leave my browser?',
    a: 'Never. Flowcell runs 100% client-side — your code is parsed and executed locally using WebAssembly (for Python) and a sandboxed JavaScript interpreter. Nothing is sent to a server.',
  },
  {
    q: 'Which languages are supported right now?',
    a: 'JavaScript and Python are fully supported. TypeScript support is on the roadmap. More languages are planned.',
  },
  {
    q: 'Can I share my visualizations?',
    a: 'Shareable links are coming soon. For now, you can copy your code manually and share it with others.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. On mobile, the editor and graph stack vertically so both are visible. The full tool, including step controls, works on touch devices.',
  },
  {
    q: 'How is Flowcell different from Python Tutor?',
    a: 'Python Tutor is excellent for memory-state visualization but shows a linear memory table. Flowcell shows a live relationship graph — which functions call which, how variables connect — and it updates as you type, not only after you run. It also supports JavaScript natively.',
  },
];

function FaqItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-border-light"
      variants={itemAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left bg-transparent border-none cursor-pointer group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-sans text-base font-medium text-text-heading group-hover:text-blue transition-colors pr-4">
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="text-text-muted flex-shrink-0"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeOut' }}
          >
            <p className="font-sans text-sm text-text-body leading-relaxed pb-5 pr-8">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-surface-light py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-blue mb-3"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          QUESTIONS
        </motion.p>
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-text-heading mb-10"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Things people ask
        </motion.h2>

        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
