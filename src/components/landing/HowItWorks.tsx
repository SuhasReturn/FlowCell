import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '../ui/Button';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemAnim = {
  hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const steps = [
  {
    num: '1',
    title: 'Type your code',
    body: 'Paste or write JavaScript or Python in the editor. Flowcell watches every keystroke and begins analyzing immediately.',
  },
  {
    num: '2',
    title: 'Watch the graph build',
    body: 'Nodes and edges appear as functions, variables, and calls are detected. The graph updates live with a short debounce so it never flickers.',
  },
  {
    num: '3',
    title: 'Step through execution',
    body: 'Hit Run, use playback controls to move through each step, and see live values overlay the graph nodes in real time.',
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="relative bg-white rounded-xl border border-border-light p-6 flex-1 min-w-[240px]"
      variants={itemAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      <div className="w-12 h-12 rounded-full bg-blue text-white font-display text-xl font-bold flex items-center justify-center mb-4">
        {step.num}
      </div>
      <h3 className="font-display text-xl font-semibold text-text-heading mb-2">{step.title}</h3>
      <p className="font-sans text-sm text-text-body leading-relaxed">{step.body}</p>

      {/* Bottom border that animates width */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-blue rounded-b-xl"
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : { width: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.3, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-soft py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-blue mb-3"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          THREE STEPS
        </motion.p>
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-text-heading mb-12"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          From code to clarity
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>

        <motion.div
          className="text-center"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.32 }}
        >
          <Button to="/visualize">Try it now →</Button>
        </motion.div>
      </div>
    </section>
  );
}
