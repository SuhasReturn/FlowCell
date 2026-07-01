import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Visualize = lazy(() => import('./pages/Visualize'));

function LoadingFallback() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-surface-dark">
      <span className="font-mono text-sm text-text-dark-body animate-pulse">Loading…</span>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/visualize" element={<Visualize />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
