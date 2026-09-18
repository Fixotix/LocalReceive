import React from 'react';

/**
 * Tactile Spring Button from transitions.dev
 * Applies cubic-bezier(0.34, 1.56, 0.64, 1) spring press
 */
interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  shimmer?: boolean;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  children,
  variant = 'primary',
  shimmer = false,
  className = '',
  ...props
}) => {
  const base =
    'spring-press inline-flex items-center justify-center gap-2 rounded-lg text-xs font-semibold select-none outline-none transition-all disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-[#ededed] text-[#070707] dark:bg-white dark:text-black hover:opacity-90 shadow-xs active:scale-[0.96]',
    secondary:
      'bg-accent text-black font-bold shadow-glass-glow hover:bg-accent/90 active:scale-[0.96]',
    outline:
      'border border-[#262626] bg-[#121212] text-zinc-200 hover:bg-[#1a1a1a] hover:border-[#333333] active:scale-[0.96]',
    ghost:
      'text-zinc-400 hover:text-white hover:bg-white/5 active:scale-[0.96]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${shimmer ? 'shimmer-sweep' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Minimalist Conic Arc Spinner from transitions.dev
 */
export const TransitionsSpinner: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 20,
  color = '#E5A93C',
  className = '',
}) => {
  return (
    <svg
      className={`animate-spin ${className}`}
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-15"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Loading Skeleton from transitions.dev
 */
export const TransitionsSkeleton: React.FC<{
  className?: string;
  width?: string | number;
  height?: string | number;
}> = ({ className = '', width = '100%', height = 16 }) => {
  return (
    <div
      className={`rounded-md bg-zinc-800/40 relative overflow-hidden animate-pulse ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-[shimmer-sweep_1.8s_infinite]" />
    </div>
  );
};

/**
 * Prototype 5 — Theme Icon Stack from transitions.dev
 * Morphs sun and moon with scale, opacity, and blur transitions
 */
export const ThemeIconStack: React.FC<{ isDark: boolean; onClick?: () => void; className?: string }> = ({
  isDark,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle theme"
      className={`spring-press relative flex items-center justify-center w-8 h-8 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground transition-all ${className}`}
    >
      <div className="relative w-4 h-4 overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            isDark
              ? 'opacity-0 scale-50 rotate-90 blur-[1px]'
              : 'opacity-100 scale-100 rotate-0 blur-0 text-amber-500'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            isDark
              ? 'opacity-100 scale-100 rotate-0 blur-0 text-accent'
              : 'opacity-0 scale-50 -rotate-90 blur-[1px]'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </button>
  );
};
