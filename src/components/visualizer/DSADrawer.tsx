import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { dsaCategories, type DSAPreset } from '../../utils/dsaPresets';
import { useFlowStore } from '../../store/useFlowStore';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface DSADrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DSADrawer({ isOpen, onClose }: DSADrawerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const loadPreset = useCallback((preset: DSAPreset) => {
    // All DSA presets are JavaScript — set language + code + reset execution
    useFlowStore.setState({
      language: 'javascript',
      code: preset.code,
      selectedExample: preset.id,
      nodes: [],
      edges: [],
      executionStatus: 'idle',
      consoleOutput: [],
      isPlaying: false,
      currentStep: 0,
      totalSteps: 0,
    });
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="dsa-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="dsa-drawer"
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeOut' }}
          >
            <div className="dsa-drawer-header">
              <span className="dsa-drawer-title">DSA Presets</span>
              <button
                className="dsa-drawer-close"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="dsa-drawer-content">
              {dsaCategories.map((category) => {
                const isExpanded = expandedCategories.has(category.name);
                return (
                  <div key={category.name}>
                    <button
                      className="dsa-category-header"
                      onClick={() => toggleCategory(category.name)}
                      aria-expanded={isExpanded}
                    >
                      <span>{category.emoji} {category.name}</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          {category.presets.map((preset) => (
                            <button
                              key={preset.id}
                              className="dsa-preset-btn"
                              onClick={() => loadPreset(preset)}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
