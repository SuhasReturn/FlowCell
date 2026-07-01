import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'filled' | 'ghost' | 'ghost-dark';
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
}

export function Button({
  children,
  variant = 'filled',
  to,
  href,
  onClick,
  className = '',
  disabled,
  title,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans font-medium text-sm rounded-lg px-5 py-2.5 transition-all duration-150 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2';

  const variants: Record<string, string> = {
    filled: 'bg-blue text-white hover:brightness-110 active:brightness-95',
    ghost:
      'bg-transparent border border-border-light text-text-body hover:border-blue hover:text-blue',
    'ghost-dark':
      'bg-transparent border border-border-dark text-text-dark-body hover:border-blue hover:text-blue',
  };

  const cls = `${base} ${variants[variant]} ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} title={title}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" title={title}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  );
}
