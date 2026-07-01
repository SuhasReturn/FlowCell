import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'amber' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    blue: 'bg-blue-light text-blue',
    amber: 'bg-amber-light text-amber',
    muted: 'bg-border-dark text-text-muted',
  };

  return (
    <span
      className={`inline-flex items-center font-sans text-xs font-medium px-3 py-1 rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
