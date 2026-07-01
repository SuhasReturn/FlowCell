import { motion } from 'framer-motion';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { DemoStrip } from '../components/landing/DemoStrip';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Languages } from '../components/landing/Languages';
import { Faq } from '../components/landing/Faq';
import { Footer } from '../components/landing/Footer';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-surface-light"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Navbar />
      <Hero />
      <DemoStrip />
      <Features />
      <HowItWorks />
      <Languages />
      <Faq />
      <Footer />
    </motion.div>
  );
}
