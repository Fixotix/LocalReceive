import React from 'react';

export type MatrixMode = 'scan' | 'twinkle' | 'orbit' | 'pulse';

interface MatrixDotLoaderProps {
  mode?: MatrixMode;
  size?: number; // overall size in px, e.g. 24
  className?: string;
  color?: string;
}

/**
 * Prototype 33 — Matrix Dot Loader from transitions.dev
 * 4x4 matrix of micro dots with motion characters:
 * - scan: column sweep
 * - twinkle: organic pulse
 * - orbit: perimeter loop
 * - pulse: center ripple
 */
export const MatrixDotLoader: React.FC<MatrixDotLoaderProps> = ({
  mode = 'pulse',
  size = 28,
  className = '',
  color = '#E5A93C',
}) => {
  const dots = Array.from({ length: 16 });

  return (
    <div
      className={`inline-grid grid-cols-4 gap-1 p-1 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading matrix"
    >
      {dots.map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;

        let delay = 0;
        if (mode === 'scan') {
          delay = col * 120;
        } else if (mode === 'orbit') {
          // Perimeter ordering
          const perimeter = [
            0, 1, 2, 3,
            7, 11, 15,
            14, 13, 12,
            8, 4,
          ];
          const idx = perimeter.indexOf(i);
          delay = idx >= 0 ? idx * 80 : 0;
        } else if (mode === 'pulse') {
          // Distance from center (1.5, 1.5)
          const dist = Math.hypot(row - 1.5, col - 1.5);
          delay = dist * 140;
        } else {
          // twinkle
          delay = ((i * 7) % 11) * 110;
        }

        return (
          <span
            key={i}
            className="w-1 h-1 rounded-full animate-matrix-pulse"
            style={{
              backgroundColor: color,
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
};
