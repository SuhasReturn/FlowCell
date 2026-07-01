import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemAnim = {
  hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const testimonials = [
  {
    quote:
      'I finally understood recursion after five minutes with Flowcell. Watching the stack frames build and collapse made it click instantly.',
    name: 'Riya S.',
    role: 'CS student',
  },
  {
    quote:
      'I use it when debugging interview prep problems. Seeing the call graph live is way faster than adding console.logs everywhere.',
    name: 'Marcus T.',
    role: 'Software engineer',
  },
  {
    quote:
      'My students go from confused to confident in one session once they can see the data flow visually. Nothing else I\'ve tried works as fast.',
    name: 'Dr. Priya M.',
    role: 'Programming instructor',
  },
  {
    quote:
      'The Python support is what sold me. I paste in my recursion homework and the whole call tree just appears.',
    name: 'Jordan K.',
    role: 'Bootcamp student',
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-light py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-blue mb-3"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          WHAT PEOPLE ARE SAYING
        </motion.p>
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-text-heading mb-12"
          variants={itemAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Built for the moment code clicks
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white border border-border-light rounded-xl p-6"
              variants={itemAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-amber fill-amber" />
                ))}
              </div>
              <p className="font-sans text-sm text-text-body italic leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div>
                <p className="font-display text-sm font-medium text-text-heading">{t.name}</p>
                <p className="font-sans text-xs text-text-muted">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
